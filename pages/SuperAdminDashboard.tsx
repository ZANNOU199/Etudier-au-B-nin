
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { User, UserRole, University, Major } from '../types';
import { processAcademicCSV } from '../utils/ImportService';

const STAFF_PER_PAGE = 6;

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
    updateStaffUser,
    deleteStaffUser,
    isLoading,
    refreshData
  } = useCMS();
  
  const [activeTab, setActiveTab] = useState<'csv' | 'staff' | 'cms' | 'settings' | 'logs'>('staff');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // FILTRAGE : On accepte 'admin', 'super_admin' et leurs variantes (minuscules)
  const filteredStaff = useMemo(() => {
    if (!staffUsers || staffUsers.length === 0) return [];
    return staffUsers.filter(u => {
      const r = (u.role || '').toLowerCase().trim();
      return r === 'admin' || r === 'super_admin' || r === 'superadmin' || r === 'administrator';
    });
  }, [staffUsers]);

  // PAGINATION : 6 PAR PAGE
  const totalPages = Math.ceil(filteredStaff.length / STAFF_PER_PAGE);
  const pagedStaff = useMemo(() => {
    const start = (currentPage - 1) * STAFF_PER_PAGE;
    return filteredStaff.slice(start, start + STAFF_PER_PAGE);
  }, [filteredStaff, currentPage]);

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
      if (selectedStaff) {
        // Mode Edition
        const defaultPermissions = role === 'super_admin' 
          ? ['manage_catalog', 'validate_apps', 'view_logs', 'edit_cms'] 
          : ['manage_catalog', 'validate_apps'];

        updateStaffUser({
          ...selectedStaff,
          firstName,
          lastName,
          email,
          role,
          permissions: defaultPermissions
        });
        setShowStaffModal(false);
        setSelectedStaff(null);
      } else {
        // Mode Création
        const response = await fetch('https://api.cipaph.com/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, password, role })
        });
        
        const result = await response.json();

        if (result.status === "success" || response.status === 201 || response.status === 200) {
          refreshData(); // Recharger la liste depuis le serveur
          setShowStaffModal(false);
          alert(`Compte créé avec succès.`);
        } else {
          setStaffError(result.message || "Échec de la création du compte.");
        }
      }
    } catch (error) {
      setStaffError("Erreur de connexion au serveur d'authentification.");
    } finally {
      setStaffLoading(false);
    }
  };

  const handleEditClick = (s: User) => {
    setSelectedStaff(s);
    setShowStaffModal(true);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-8 text-white text-left">
      <div className="flex items-center gap-4 mb-12 lg:mb-16 px-2">
        <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/20 shrink-0">
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
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-80 bg-[#0d1b13] flex-col shrink-0 z-30 border-r border-white/5 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile/Tablette (Drawer) */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-80 bg-[#0d1b13] z-[70] lg:hidden animate-in slide-in-from-left duration-300 shadow-2xl">
            <SidebarContent />
          </aside>
        </>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between border-b border-white/5 bg-[#0d1b13]/80 backdrop-blur-md sticky top-0 z-50">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="lg:hidden size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="text-xl lg:text-2xl font-black text-white tracking-tighter uppercase truncate max-w-[150px] sm:max-w-none">Super Panel</h1>
           </div>
           
           <div className="flex items-center gap-4 lg:gap-6">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-black text-white leading-none uppercase">{user?.firstName} {user?.lastName}</p>
                 <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">Super Privilèges</p>
              </div>
              <div className="size-11 lg:size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                 <span className="material-symbols-outlined font-black">shield_person</span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-16 custom-scrollbar bg-gradient-to-b from-[#0d1b13]/20 to-transparent">
          {activeTab === 'staff' && (
            <div className="space-y-8 lg:space-y-10 animate-fade-in text-left">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none">Staff & <span className="text-primary italic">Permissions</span></h2>
                    <p className="text-gray-500 font-medium italic text-sm">Gérez les comptes administratifs du système.</p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => { refreshData(); setCurrentPage(1); }}
                      className={`size-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-white/5 ${isLoading ? 'animate-spin' : ''}`}
                    >
                      <span className="material-symbols-outlined">refresh</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedStaff(null); setShowStaffModal(true); }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 lg:px-10 py-4 lg:py-5 bg-primary text-black font-black rounded-2xl text-[10px] lg:text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl font-bold">person_add</span>
                      Nouveau Compte
                    </button>
                  </div>
               </div>

               <div className="overflow-x-auto rounded-[32px] lg:rounded-[40px] border border-white/5 bg-[#0d1b13] shadow-2xl">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                     <thead>
                        <tr className="border-b border-white/5 bg-white/2">
                           <th className="px-6 lg:px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Administrateur</th>
                           <th className="px-6 lg:px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Rôle Système</th>
                           <th className="px-6 lg:px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {isLoading && (
                           <tr><td colSpan={3} className="p-20 text-center text-gray-500 animate-pulse font-black uppercase tracking-widest">Nexus Synchronisation...</td></tr>
                        )}
                        {!isLoading && pagedStaff.map((s) => (
                           <tr key={s.id} className="hover:bg-white/2 transition-colors">
                              <td className="px-6 lg:px-8 py-6">
                                 <div className="flex items-center gap-4 text-left">
                                    <div className="size-10 lg:size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 font-black text-xs border border-white/5">
                                       {(s.firstName?.[0] || 'U')}{(s.lastName?.[0] || 'A')}
                                    </div>
                                    <div className="min-w-0">
                                       <p className="text-white font-black truncate">{s.firstName} {s.lastName}</p>
                                       <p className="text-[10px] text-gray-500 font-bold truncate">{s.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 lg:px-8 py-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border inline-block ${
                                    (s.role || '').toLowerCase().trim().includes('super') ? 'bg-primary/10 text-primary border-primary/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                 }`}>
                                    {s.role}
                                 </span>
                              </td>
                              <td className="px-6 lg:px-8 py-6 text-right">
                                 <div className="flex justify-end gap-3 lg:gap-4">
                                    <button onClick={() => handleEditClick(s)} className="size-10 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all flex items-center justify-center border border-white/5"><span className="material-symbols-outlined text-lg">edit</span></button>
                                    <button onClick={() => { if(confirm(`Révoquer l'accès de ${s.firstName} ?`)) deleteStaffUser(s.id); }} className="size-10 rounded-xl bg-white/5 text-gray-500 hover:text-red-500 transition-all flex items-center justify-center border border-white/5"><span className="material-symbols-outlined text-lg">delete</span></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                        {!isLoading && filteredStaff.length === 0 && (
                           <tr><td colSpan={3} className="p-20 text-center text-gray-500 font-medium italic">Aucun administrateur détecté dans le flux de données.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>

               {/* PAGINATION STAFF */}
               {totalPages > 1 && (
                 <div className="flex justify-center items-center gap-3 pt-6 animate-fade-in">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="size-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:text-primary transition-all"
                    >
                      <span className="material-symbols-outlined">west</span>
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`size-11 rounded-xl font-black text-xs transition-all border ${currentPage === i + 1 ? 'bg-primary text-black border-primary' : 'bg-white/5 text-gray-500 border-white/10 hover:border-primary'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="size-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:text-primary transition-all"
                    >
                      <span className="material-symbols-outlined">east</span>
                    </button>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'csv' && (
             <div className="max-w-4xl space-y-10 lg:space-y-12 animate-fade-in text-left text-white">
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tighter">Nexus <span className="text-primary italic">Import</span></h2>
                  <p className="text-gray-500 font-medium max-w-2xl">Mettez à jour massivement le catalogue académique via l'importation de fichiers CSV structurés.</p>
                </div>
                
                <div onClick={() => fileInputRef.current?.click()} className="p-12 lg:p-20 rounded-[40px] lg:rounded-[48px] border-2 border-dashed border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center group">
                   <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleImportCSV} />
                   <div className="size-20 lg:size-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-5xl">upload_file</span>
                   </div>
                   <p className="font-black uppercase tracking-[0.2em] text-sm text-white group-hover:text-primary transition-colors">Charger le fichier .csv</p>
                   <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-bold">Encodage UTF-8 recommandé</p>
                </div>
             </div>
          )}

          {activeTab === 'cms' && <div className="text-white p-10 font-black uppercase tracking-widest opacity-40 text-left bg-white/5 rounded-[32px] border border-white/5">Module CMS en cours de déploiement...</div>}
          {activeTab === 'settings' && <div className="text-white p-10 font-black uppercase tracking-widest opacity-40 text-left bg-white/5 rounded-[32px] border border-white/5">Paramètres du noyau système</div>}
          {activeTab === 'logs' && <div className="text-white p-10 font-black uppercase tracking-widest opacity-40 text-left bg-white/5 rounded-[32px] border border-white/5">Flux des logs en temps réel</div>}
        </div>

        {/* MODAL: ADD/EDIT STAFF */}
        {showStaffModal && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-xl rounded-[40px] lg:rounded-[48px] shadow-2xl overflow-hidden border border-white/5 animate-in zoom-in-95 my-auto">
                <div className="px-8 lg:px-10 py-6 lg:py-8 bg-white/5 border-b border-white/5 flex justify-between items-center text-left">
                   <div>
                      <h3 className="text-xl lg:text-2xl font-black text-white tracking-tight">
                        {selectedStaff ? 'Mettre à jour le profil' : 'Créer un accès Administrateur'}
                      </h3>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">Configuration des privilèges</p>
                   </div>
                   <button onClick={() => { setShowStaffModal(false); setSelectedStaff(null); }} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                     <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                
                <form onSubmit={handleAddStaffMember} className="p-8 lg:p-10 space-y-6 text-left">
                   {staffError && (
                     <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest animate-shake">
                       {staffError}
                     </div>
                   )}
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Prénom</label>
                        <input name="fn" required defaultValue={selectedStaff?.firstName} className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Nom de famille</label>
                        <input name="ln" required defaultValue={selectedStaff?.lastName} className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">E-mail professionnel</label>
                      <input name="email" type="email" required defaultValue={selectedStaff?.email} className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                   </div>

                   {!selectedStaff && (
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Clé d'accès (Password)</label>
                        <input name="password" type="password" required className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
                     </div>
                   )}

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Niveau d'accréditation</label>
                      <select name="role" defaultValue={selectedStaff?.role || "admin"} className="w-full p-4 rounded-2xl bg-[#0d1b13] border border-white/5 font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                         <option value="admin">Administrateur Standard</option>
                         <option value="super_admin">Super Administrateur Système</option>
                      </select>
                   </div>
                   
                   <button 
                    disabled={staffLoading}
                    type="submit" 
                    className="w-full py-5 lg:py-6 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 mt-4 disabled:opacity-50 hover:bg-green-400 transition-all flex items-center justify-center gap-3"
                   >
                     {staffLoading ? (
                       <span className="size-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                     ) : (
                       <span className="material-symbols-outlined text-xl">verified_user</span>
                     )}
                     {staffLoading ? "Nexus Traitement..." : selectedStaff ? "Valider les modifications" : "Générer les accès"}
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
