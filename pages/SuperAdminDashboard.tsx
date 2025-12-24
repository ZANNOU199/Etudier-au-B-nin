
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { User, UserRole, ThemeConfig } from '../types';
import { processAcademicCSV } from '../utils/ImportService';

const SuperAdminDashboard: React.FC = () => {
  const { 
    universities, 
    addUniversity, 
    updateUniversity, 
    addMajor, 
    logout, 
    user,
    staffUsers,
    addStaffUser,
    deleteStaffUser,
    themes,
    applyTheme,
    updateTheme,
    languages,
    toggleLanguage
  } = useCMS();
  
  const [activeTab, setActiveTab] = useState<'csv' | 'staff' | 'cms' | 'settings' | 'logs'>('staff');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await processAcademicCSV(file, universities, addUniversity, updateUniversity, addMajor);
      alert(`IMPORTATION TERMINÉE :\n- ${result.uniCount} Établissements\n- ${result.majorCount} Filières.`);
    } catch (err) {
      alert("Erreur : " + (err as Error).message);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddStaffMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStaffLoading(true);
    setStaffError('');

    const fd = new FormData(e.currentTarget);
    const firstName = fd.get('fn') as string;
    const lastName = fd.get('ln') as string;
    const email = (fd.get('email') as string).toLowerCase().trim();
    const password = fd.get('password') as string;
    const role = fd.get('role') as UserRole;

    try {
      // Appel direct à l'API de register pour créer le nouveau compte
      const response = await fetch('https://api.cipaph.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      
      const result = await response.json();

      if (result.status === "success") {
        // Attribution automatique des permissions selon le rôle sélectionné
        const defaultPermissions = role === 'super_admin' 
          ? ['manage_catalog', 'validate_apps', 'view_logs', 'edit_cms'] 
          : ['manage_catalog', 'validate_apps'];

        const newUser: User = {
          id: result.user.id.toString(),
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          role: role, // On force le rôle admin/super_admin choisi dans le formulaire
          permissions: defaultPermissions
        };
        
        addStaffUser(newUser);
        setShowStaffModal(false);
        alert(`Compte ${role === 'super_admin' ? 'Super Admin' : 'Admin'} créé avec succès.`);
      } else {
        setStaffError(result.message || "Échec de la création du compte.");
      }
    } catch (error) {
      setStaffError("Erreur de connexion au serveur d'authentification.");
    } finally {
      setStaffLoading(false);
    }
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full p-8 text-white">
      <div className="flex items-center gap-4 mb-16 px-2">
        <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined font-black text-2xl">diamond</span>
        </div>
        <div className="text-left">
          <h2 className="text-xl font-black tracking-tighter leading-none">Super Console</h2>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1.5">Master Access</p>
        </div>
      </div>

      <nav className="flex-grow space-y-3">
        {[
          { id: 'csv', label: 'Nexus Import (CSV)', icon: 'terminal' },
          { id: 'staff', label: 'Staff & Permissions', icon: 'admin_panel_settings' },
          { id: 'cms', label: 'Gestion CMS', icon: 'palette' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
              activeTab === item.id ? 'bg-primary text-black shadow-xl shadow-primary/20 scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/5">
        <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
          <span className="material-symbols-outlined">logout</span>
          Sortie Système
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#090f0b] font-display overflow-hidden relative">
      <aside className="hidden lg:flex w-80 bg-[#0d1b13] flex-col shrink-0 z-30 border-r border-white/5 shadow-2xl">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-[#0d1b13]/80 backdrop-blur-md">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Super Admin Panel</h1>
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-black text-white leading-none">{user?.firstName} {user?.lastName}</p>
                 <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">Super Privilèges</p>
              </div>
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                 <span className="material-symbols-outlined font-black">shield_person</span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar">
          {activeTab === 'staff' && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 text-left">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Staff & Permissions</h2>
                    <p className="text-gray-500 font-medium italic">Gérez les comptes administrateurs et leurs droits d'accès.</p>
                  </div>
                  <button 
                    onClick={() => setShowStaffModal(true)}
                    className="flex items-center gap-3 px-10 py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    <span className="material-symbols-outlined text-xl font-bold">person_add</span>
                    Créer un compte
                  </button>
               </div>

               <div className="overflow-x-auto rounded-[40px] border border-white/5 bg-[#0d1b13] shadow-2xl">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-white/5 bg-white/2">
                           <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Identité</th>
                           <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Rôle</th>
                           <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Permissions actives</th>
                           <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {staffUsers.map((s) => (
                           <tr key={s.id} className="hover:bg-white/2 transition-colors">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4 text-left">
                                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 font-black text-xs">{s.firstName[0]}{s.lastName[0]}</div>
                                    <div>
                                       <p className="text-white font-black">{s.firstName} {s.lastName}</p>
                                       <p className="text-[10px] text-gray-500 font-bold">{s.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    s.role === 'super_admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                 }`}>
                                    {s.role === 'super_admin' ? 'super admin' : 'admin'}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex gap-2">
                                    {['manage_catalog', 'validate_apps', 'view_logs', 'edit_cms'].map(code => (
                                       <div 
                                          key={code} 
                                          className={`size-8 rounded-lg flex items-center justify-center border ${
                                             s.permissions?.includes(code) 
                                                ? 'bg-primary/10 border-primary/30 text-primary' 
                                                : 'bg-white/5 border-white/5 text-gray-600 grayscale'
                                          }`}
                                       >
                                          <span className="material-symbols-outlined text-sm font-bold">
                                             {code === 'manage_catalog' ? 'category' : 
                                              code === 'validate_apps' ? 'check_circle' : 
                                              code === 'view_logs' ? 'monitoring' : 'palette'}
                                          </span>
                                       </div>
                                    ))}
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex gap-4">
                                    <button className="text-gray-500 hover:text-white transition-colors"><span className="material-symbols-outlined">edit</span></button>
                                    <button onClick={() => deleteStaffUser(s.id)} className="text-gray-500 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'csv' && (
             <div className="max-w-4xl space-y-12 animate-fade-in text-left text-white">
                <h2 className="text-5xl font-black tracking-tighter">Nexus <span className="text-primary italic">Import</span></h2>
                <div onClick={() => fileInputRef.current?.click()} className="p-16 rounded-[48px] border-2 border-dashed border-white/10 bg-white/5 hover:border-primary/50 cursor-pointer flex flex-col items-center">
                   <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleImportCSV} />
                   <span className="material-symbols-outlined text-6xl text-primary mb-4">upload_file</span>
                   <p className="font-black uppercase tracking-widest text-sm">Charger le fichier CSV</p>
                </div>
             </div>
          )}

          {activeTab === 'cms' && <div className="text-white p-10 font-black uppercase tracking-widest opacity-40">Module CMS Actif</div>}
          {activeTab === 'settings' && <div className="text-white p-10 font-black uppercase tracking-widest opacity-40">Paramètres Système</div>}
          {activeTab === 'logs' && <div className="text-white p-10 font-black uppercase tracking-widest opacity-40">Flux Temps Réel</div>}
        </div>

        {/* MODAL: ADD STAFF */}
        {showStaffModal && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-[#162a1f] w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border border-white/5 animate-in zoom-in-95">
                <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex justify-between items-center text-left">
                   <h3 className="text-2xl font-black text-white tracking-tight">Nouvel accès administratif</h3>
                   <button onClick={() => setShowStaffModal(false)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><span className="material-symbols-outlined">close</span></button>
                </div>
                
                <form onSubmit={handleAddStaffMember} className="p-10 space-y-6 text-left">
                   {staffError && (
                     <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest">
                       {staffError}
                     </div>
                   )}
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Prénom</label>
                        <input name="fn" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Nom</label>
                        <input name="ln" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Email Professionnel</label>
                      <input name="email" type="email" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Mot de passe temporaire</label>
                      <input name="password" type="password" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Rôle</label>
                      <select name="role" className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                         <option value="admin" className="bg-[#162a1f]">Administrateur (Dashboard Admin)</option>
                         <option value="super_admin" className="bg-[#162a1f]">Super Admin (Super Console)</option>
                      </select>
                   </div>
                   
                   <button 
                    disabled={staffLoading}
                    type="submit" 
                    className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 mt-6 disabled:opacity-50"
                   >
                     {staffLoading ? "Création en cours..." : "Finaliser et créer le compte"}
                   </button>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
