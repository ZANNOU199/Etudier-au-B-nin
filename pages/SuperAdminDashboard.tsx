
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { User, UserRole, University, Major } from '../types';
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
    languages
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
      const result = await processAcademicCSV(
        file, 
        universities, 
        (u: University) => {
          const fd = new FormData();
          fd.append('name', u.name);
          fd.append('acronym', u.acronym);
          fd.append('city', u.location);
          fd.append('type', u.type.toLowerCase());
          fd.append('is_standalone', u.isStandaloneSchool ? '1' : '0');
          addUniversity(fd);
        },
        (u: University) => updateUniversity(u.id, u),
        addMajor
      );
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
      // Simulation d'une création de compte avec latence
      await new Promise(resolve => setTimeout(resolve, 800));

      const defaultPermissions = role === 'super_admin' 
        ? ['manage_catalog', 'validate_apps', 'view_logs', 'edit_cms'] 
        : ['manage_catalog', 'validate_apps'];

      const newUser: User = {
        id: 'staff-' + Math.random().toString(36).substr(2, 9),
        firstName,
        lastName,
        email,
        role,
        permissions: defaultPermissions
      };
      
      addStaffUser(newUser);
      setShowStaffModal(false);
      alert(`Compte ${role === 'super_admin' ? 'Super Admin' : 'Admin'} créé avec succès.`);
    } catch (error) {
      setStaffError("Erreur lors de la création du compte.");
    } finally {
      setStaffLoading(false);
    }
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full p-8 text-white">
      <div className="flex items-center gap-4 mb-16 px-2">
        <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/20 hover:rotate-12 transition-transform">
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
          { id: 'logs', label: 'Flux Logs', icon: 'monitoring' },
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
        <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all group">
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">logout</span>
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

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-80 bg-[#0d1b13] z-[60] lg:hidden animate-in slide-in-from-left duration-300">
            <Sidebar />
          </aside>
        </>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-[#0d1b13]/80 backdrop-blur-md sticky top-0 z-40">
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
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                 <span className="material-symbols-outlined font-black">shield_person</span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
          {activeTab === 'staff' && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 text-left">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Gestion du Staff</h2>
                    <p className="text-gray-500 font-medium italic">Attribuez des accès sécurisés aux collaborateurs de la plateforme.</p>
                  </div>
                  <button 
                    onClick={() => setShowStaffModal(true)}
                    className="flex items-center gap-3 px-10 py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all group"
                  >
                    <span className="material-symbols-outlined text-xl font-bold group-hover:rotate-90 transition-transform">person_add</span>
                    Créer un compte
                  </button>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  <div className="bg-[#0d1b13] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="border-b border-white/5 bg-white/2">
                               <th className="px-10 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Identité & ID</th>
                               <th className="px-10 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Niveau d'accès</th>
                               <th className="px-10 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Permissions actives</th>
                               <th className="px-10 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em] text-right">Contrôle</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {staffUsers.map((s) => (
                               <tr key={s.id} className="hover:bg-white/2 transition-colors group">
                                  <td className="px-10 py-6">
                                     <div className="flex items-center gap-4 text-left">
                                        <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 font-black text-sm border border-white/10 group-hover:border-primary/30 transition-colors">
                                          {s.firstName[0]}{s.lastName[0]}
                                        </div>
                                        <div>
                                           <p className="text-white font-black group-hover:text-primary transition-colors">{s.firstName} {s.lastName}</p>
                                           <p className="text-[10px] text-gray-500 font-bold tracking-widest">ID: {s.id.split('-')[1] || s.id}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-10 py-6">
                                     <div className="flex flex-col gap-1">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                                          s.role === 'super_admin' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        }`}>
                                          {s.role === 'super_admin' ? 'super admin' : 'admin'}
                                        </span>
                                        <p className="text-[9px] text-gray-600 font-bold px-1 italic">{s.email}</p>
                                     </div>
                                  </td>
                                  <td className="px-10 py-6">
                                     <div className="flex gap-2">
                                        {[
                                          { code: 'manage_catalog', icon: 'category', label: 'Catalogue' },
                                          { code: 'validate_apps', icon: 'check_circle', label: 'Admission' },
                                          { code: 'view_logs', icon: 'monitoring', label: 'Logs' },
                                          { code: 'edit_cms', icon: 'palette', label: 'Design' }
                                        ].map(p => (
                                           <div 
                                              key={p.code} 
                                              title={p.label}
                                              className={`size-9 rounded-xl flex items-center justify-center border transition-all ${
                                                 s.permissions?.includes(p.code) 
                                                    ? 'bg-primary/10 border-primary/30 text-primary shadow-sm shadow-primary/5' 
                                                    : 'bg-white/2 border-white/5 text-gray-700 grayscale opacity-30'
                                              }`}
                                           >
                                              <span className="material-symbols-outlined text-lg font-bold">{p.icon}</span>
                                           </div>
                                        ))}
                                     </div>
                                  </td>
                                  <td className="px-10 py-6 text-right">
                                     <div className="flex justify-end gap-3">
                                        <button className="size-10 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all border border-white/5 flex items-center justify-center">
                                          <span className="material-symbols-outlined text-xl">edit</span>
                                        </button>
                                        <button 
                                          onClick={() => { if(confirm('Supprimer cet accès ?')) deleteStaffUser(s.id); }}
                                          className="size-10 rounded-xl bg-white/5 text-gray-500 hover:text-red-500 transition-all border border-white/5 flex items-center justify-center"
                                        >
                                          <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'csv' && (
             <div className="max-w-4xl space-y-12 animate-fade-in text-left text-white">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Nexus <span className="text-primary italic">Import Engine</span></h2>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed">Mise à jour massive du catalogue académique via fichier structuré.</p>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="p-24 rounded-[60px] border-2 border-dashed border-white/10 bg-white/2 hover:bg-white/5 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center group relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleImportCSV} />
                   <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-6xl font-black">upload_file</span>
                   </div>
                   <p className="font-black uppercase tracking-[0.3em] text-sm text-primary mb-4">Charger le fichier CSV</p>
                   <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Formats supportés : .csv, .txt (LMD Standard)</p>
                </div>

                <div className="bg-white/5 p-10 rounded-[40px] border border-white/5 space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">info</span>
                      Instructions d'importation
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      <div className="space-y-3">
                         <p className="font-bold text-gray-300">Structure requise :</p>
                         <ul className="space-y-2 text-gray-500 font-medium italic">
                            <li>• sigle_inst : Sigle de l'université</li>
                            <li>• nom_inst : Nom complet</li>
                            <li>• nom_filiere : Libellé de la formation</li>
                            <li>• cycle : Licence / Master / Doctorat</li>
                         </ul>
                      </div>
                      <div className="space-y-3">
                         <p className="font-bold text-gray-300">Comportement Nexus :</p>
                         <ul className="space-y-2 text-gray-500 font-medium italic">
                            <li>• Crée l'établissement s'il n'existe pas</li>
                            <li>• Identifie les composantes automatiquement</li>
                            <li>• Alerte en cas de doublon de filière</li>
                         </ul>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'cms' && (
            <div className="space-y-10 animate-fade-in text-left">
               <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Configuration Visuelle</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-4">
                     <span className="material-symbols-outlined text-4xl text-primary font-bold">translate</span>
                     <h3 className="text-lg font-black text-white">Traductions</h3>
                     <p className="text-xs text-gray-500 leading-relaxed font-medium">Gérez les labels et textes statiques de la plateforme pour toutes les langues actives.</p>
                     <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Éditer les clés</button>
                  </div>
                  <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-4">
                     <span className="material-symbols-outlined text-4xl text-blue-500 font-bold">palette</span>
                     <h3 className="text-lg font-black text-white">Thèmes (Branding)</h3>
                     <p className="text-xs text-gray-500 leading-relaxed font-medium">Ajustez les couleurs primaires, les arrondis et les fonds pour l'ensemble du site.</p>
                     <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Configurer Nexus UI</button>
                  </div>
                  <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-4 opacity-50 grayscale cursor-not-allowed">
                     <span className="material-symbols-outlined text-4xl text-amber-500 font-bold">notifications_active</span>
                     <h3 className="text-lg font-black text-white">Marketing SMS/Mail</h3>
                     <p className="text-xs text-gray-500 leading-relaxed font-medium">Envoyez des notifications groupées aux étudiants selon leurs filières d'intérêt.</p>
                     <button disabled className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-700">Bientôt disponible</button>
                  </div>
               </div>
            </div>
          )}
          
          {activeTab === 'logs' && (
            <div className="space-y-10 animate-fade-in text-left">
               <h2 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                 <span className="size-3 bg-red-500 rounded-full animate-pulse"></span>
                 Activités Système
               </h2>
               <div className="bg-black rounded-[40px] p-10 font-mono text-xs border border-white/5 min-h-[500px] shadow-2xl relative">
                  <div className="absolute top-4 right-8 flex gap-2">
                     <div className="size-3 rounded-full bg-red-500/20"></div>
                     <div className="size-3 rounded-full bg-amber-500/20"></div>
                     <div className="size-3 rounded-full bg-green-500/20"></div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-primary">[SYSTEM] Kernel Nexus v2.4 initialized...</p>
                     <p className="text-gray-500">[{new Date().toLocaleTimeString()}] AUTH_LOGIN: user "master@eden.com" verified (IP: 197.234.xx.xx)</p>
                     <p className="text-gray-500">[{new Date().toLocaleTimeString()}] DB_QUERY: fetched 142 universities in 42ms</p>
                     <p className="text-amber-500">[{new Date().toLocaleTimeString()}] WARN: API limit approaching for "Cipaph Gate"</p>
                     <p className="text-gray-500">[{new Date().toLocaleTimeString()}] DASHBOARD_ACCESS: SuperAdmin role activated</p>
                     <p className="animate-pulse text-primary inline-block">_</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* MODAL: ADD STAFF */}
        {showStaffModal && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-[#162a1f] w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border border-white/5 animate-in zoom-in-95 duration-300">
                <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex justify-between items-center text-left">
                   <div>
                      <h3 className="text-2xl font-black text-white tracking-tight leading-none">Nouvel accès administratif</h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified_user</span>
                        Protocole de sécurité Eden
                      </p>
                   </div>
                   <button onClick={() => setShowStaffModal(false)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                
                <form onSubmit={handleAddStaffMember} className="p-10 space-y-6 text-left">
                   {staffError && (
                     <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                       {staffError}
                     </div>
                   )}
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Prénom</label>
                        <input name="fn" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Nom</label>
                        <input name="ln" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Email Professionnel</label>
                      <input name="email" type="email" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Mot de passe temporaire</label>
                      <input name="password" type="password" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="••••••••" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Rôle & Droits</label>
                      <div className="relative">
                        <select name="role" className="w-full p-4 rounded-2xl bg-[#0d1b13] border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                           <option value="admin">Administrateur Standard (Gestion de base)</option>
                           <option value="super_admin">Super Administrateur (Nexus Master Access)</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 pointer-events-none">expand_more</span>
                      </div>
                   </div>
                   
                   <button 
                    disabled={staffLoading}
                    type="submit" 
                    className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 mt-6 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                   >
                     {staffLoading ? (
                       <>
                         <span className="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                         Initialisation...
                       </>
                     ) : "Finaliser et créer le compte"}
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
