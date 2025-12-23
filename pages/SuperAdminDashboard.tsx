
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { User, UserRole } from '../types';
import { processAcademicCSV } from '../utils/ImportService';

const SuperAdminDashboard: React.FC = () => {
  const { universities, addUniversity, updateUniversity, addMajor, logout, user } = useCMS();
  const [activeTab, setActiveTab] = useState<'csv' | 'staff' | 'logs'>('csv');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Mock Staff State (In a real app, this would be in CMSContext or an API)
  const [staffList, setStaffList] = useState<User[]>([
    { id: 'STF-001', firstName: 'Jean', lastName: 'Admin', email: 'jean@eden.bj', role: 'super_admin' },
    { id: 'STF-002', firstName: 'Alice', lastName: 'Editeur', email: 'alice@eden.bj', role: 'editor' }
  ]);
  const [showStaffModal, setShowStaffModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await processAcademicCSV(file, universities, addUniversity, updateUniversity, addMajor);
      alert(`IMPORTATION RÉUSSIE :\n- ${result.uniCount} Établissements créés\n- ${result.majorCount} Filières créées.`);
    } catch (err) {
      alert("Erreur lors de l'importation CSV.");
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addStaffMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newUser: User = {
      id: 'STF-' + Math.floor(Math.random() * 1000),
      firstName: fd.get('fn') as string,
      lastName: fd.get('ln') as string,
      email: fd.get('email') as string,
      role: fd.get('role') as UserRole
    };
    setStaffList([...staffList, newUser]);
    setShowStaffModal(false);
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full p-8 text-white">
      <div className="flex items-center gap-4 mb-16 px-2">
        <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined font-black text-2xl">diamond</span>
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tighter leading-none">Super Console</h2>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1.5">Master Access</p>
        </div>
      </div>

      <nav className="flex-grow space-y-3">
        {[
          { id: 'csv', label: 'Nexus Import (CSV)', icon: 'terminal' },
          { id: 'staff', label: 'Staff & Autorités', icon: 'admin_panel_settings' },
          { id: 'logs', label: 'Flux Système', icon: 'monitoring' },
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

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-80 bg-[#0d1b13] z-[60] lg:hidden animate-in slide-in-from-left duration-300">
            <Sidebar />
          </aside>
        </>
      )}

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
          {activeTab === 'csv' && (
            <div className="max-w-4xl space-y-12 animate-fade-in">
               <div className="space-y-4">
                  <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Nexus <span className="text-primary italic">Import</span></h2>
                  <p className="text-gray-500 text-lg font-medium">Synchronisez votre base de données académique en une seule étape.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-16 rounded-[48px] border-2 border-dashed border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                     <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleImportCSV} />
                     <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-5xl">upload_file</span>
                     </div>
                     <h3 className="text-xl font-black text-white mb-2">Charger un CSV</h3>
                     <p className="text-gray-500 text-sm font-medium">Glissez-déposez ou cliquez pour importer.</p>
                  </div>

                  <div className="p-12 rounded-[48px] bg-primary text-black flex flex-col justify-between shadow-2xl shadow-primary/20">
                     <div className="space-y-4">
                        <div className="size-12 bg-black rounded-xl flex items-center justify-center text-primary">
                           <span className="material-symbols-outlined font-black">info</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight leading-none">Structure requise</h3>
                        <p className="text-sm font-bold opacity-80 leading-relaxed">
                          Colonnes minimales : sigle_inst, nom_inst, ville, statut_inst, nom_filiere, cycle, frais, debouche, diplome.
                        </p>
                     </div>
                     <button className="w-full py-4 bg-black text-white font-black rounded-2xl text-[10px] uppercase tracking-widest mt-8">Télécharger Modèle</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Gestion du Staff</h2>
                    <p className="text-gray-500 font-medium italic">Attribuez les accès éditeurs et administrateurs.</p>
                  </div>
                  <button 
                    onClick={() => setShowStaffModal(true)}
                    className="flex items-center gap-3 px-10 py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    <span className="material-symbols-outlined text-xl font-bold">person_add</span>
                    Nouveau Staff
                  </button>
               </div>

               <div className="overflow-x-auto rounded-[40px] border border-white/5 bg-[#0d1b13] shadow-2xl">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-white/5 bg-white/2">
                           <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Identité</th>
                           <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Email</th>
                           <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Rôle</th>
                           <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {staffList.map((s) => (
                           <tr key={s.id} className="hover:bg-white/2 transition-colors">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 font-black text-xs">{s.firstName[0]}{s.lastName[0]}</div>
                                    <p className="text-white font-black">{s.firstName} {s.lastName}</p>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-gray-400 font-bold">{s.email}</td>
                              <td className="px-8 py-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    s.role === 'super_admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                 }`}>
                                    {s.role}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <button className="text-gray-500 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'logs' && (
             <div className="space-y-8 animate-fade-in max-w-2xl">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Flux Système en temps réel</h2>
                <div className="bg-black/40 rounded-[32px] p-8 border border-white/5 font-mono text-xs text-primary space-y-4">
                   <p className="opacity-60">[09:41:22] SYNC_WIZARD started...</p>
                   <p>[09:41:24] Connection established with Super_Console_Node_01</p>
                   <p className="text-white font-black">[09:42:01] 45 entities synchronized from CSV payload</p>
                   <p className="opacity-40">[09:45:00] Cleaning cache...</p>
                   <p>[09:45:02] System ready. All nodes online.</p>
                   <div className="animate-pulse">_</div>
                </div>
             </div>
          )}
        </div>

        {/* MODAL: ADD STAFF */}
        {showStaffModal && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border border-white/5 my-auto animate-in zoom-in-95 duration-300">
                <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex justify-between items-center">
                   <h3 className="text-2xl font-black text-white tracking-tight">Nouvel accès Système</h3>
                   <button onClick={() => setShowStaffModal(false)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                <form onSubmit={addStaffMember} className="p-10 space-y-6">
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
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Rôle Système</label>
                      <select name="role" className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                         <option value="editor" className="bg-[#162a1f]">Éditeur de contenu</option>
                         <option value="super_admin" className="bg-[#162a1f]">Super Administrateur</option>
                      </select>
                   </div>
                   <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 mt-6">Initialiser le compte</button>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
