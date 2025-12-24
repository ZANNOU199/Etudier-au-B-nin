
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { User, UserRole, ThemeConfig, UserPermission } from '../types';
import { processAcademicCSV } from '../utils/ImportService';

const AVAILABLE_PERMISSIONS: UserPermission[] = [
  { id: '1', label: 'Gérer le catalogue', code: 'manage_catalog' },
  { id: '2', label: 'Valider les dossiers', code: 'validate_apps' },
  { id: '3', label: 'Voir les logs système', code: 'view_logs' },
  { id: '4', label: 'Modifier le style (CMS)', code: 'edit_cms' },
];

const SuperAdminDashboard: React.FC = () => {
  const { 
    universities, 
    addUniversity, 
    updateUniversity, 
    addMajor, 
    logout, 
    user,
    themes,
    applyTheme,
    updateTheme,
    languages,
    toggleLanguage
  } = useCMS();
  
  const [activeTab, setActiveTab] = useState<'csv' | 'staff' | 'cms' | 'settings' | 'logs'>('csv');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [staffList, setStaffList] = useState<User[]>([
    { id: 'STF-001', firstName: 'Jean', lastName: 'Admin', email: 'jean@eden.bj', role: 'admin', permissions: ['manage_catalog', 'validate_apps'] },
    { id: 'STF-002', firstName: 'Alice', lastName: 'Super', email: 'alice@eden.bj', role: 'super_admin', permissions: ['manage_catalog', 'validate_apps', 'view_logs', 'edit_cms'] }
  ]);
  
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemeConfig | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await processAcademicCSV(file, universities, addUniversity, updateUniversity, addMajor);
      alert(`IMPORTATION TERMINÉE :\n- ${result.uniCount} Établissements créés/vérifiés\n- ${result.majorCount} Filières injectées.`);
    } catch (err) {
      alert("Erreur lors de l'importation : " + (err as Error).message);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addStaffMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const selectedPermissions = AVAILABLE_PERMISSIONS
      .filter(p => fd.get(`perm_${p.code}`) === 'on')
      .map(p => p.code);

    const newUser: User = {
      id: 'STF-' + Math.floor(Math.random() * 1000),
      firstName: fd.get('fn') as string,
      lastName: fd.get('ln') as string,
      email: fd.get('email') as string,
      role: fd.get('role') as UserRole,
      permissions: selectedPermissions
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
          { id: 'staff', label: 'Staff & Permissions', icon: 'admin_panel_settings' },
          { id: 'cms', label: 'Gestion CMS', icon: 'palette' },
          { id: 'settings', label: 'Paramètres', icon: 'settings' },
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
            <div className="max-w-4xl space-y-12 animate-fade-in text-left">
               <div className="space-y-4">
                  <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Nexus <span className="text-primary italic">Import</span></h2>
                  <p className="text-gray-500 text-lg font-medium">Injectez massivement vos données académiques dans le système.</p>
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
                     <p className="text-gray-500 text-sm font-medium">Cliquez pour sélectionner votre fichier.</p>
                  </div>

                  <div className="p-10 rounded-[48px] bg-white/5 border border-white/10 text-white flex flex-col justify-between shadow-2xl">
                     <div className="space-y-6">
                        <div className="size-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                           <span className="material-symbols-outlined font-black">table_chart</span>
                        </div>
                        <h3 className="text-xl font-black tracking-tight leading-none">Colonnes requises</h3>
                        <div className="text-[10px] font-bold text-gray-400 grid grid-cols-2 gap-y-2 uppercase tracking-widest">
                           <div className="flex items-center gap-2"><div className="size-1.5 bg-primary rounded-full"></div> type_inst</div>
                           <div className="flex items-center gap-2"><div className="size-1.5 bg-primary rounded-full"></div> nom_inst</div>
                           <div className="flex items-center gap-2"><div className="size-1.5 bg-primary rounded-full"></div> sigle_inst</div>
                           <div className="flex items-center gap-2"><div className="size-1.5 bg-primary rounded-full"></div> ville</div>
                           <div className="flex items-center gap-2"><div className="size-1.5 bg-primary rounded-full"></div> statut_inst</div>
                           <div className="flex items-center gap-2"><div className="size-1.5 bg-primary rounded-full"></div> nom_filiere</div>
                           <div className="flex items-center gap-2"><div className="size-1.5 bg-primary rounded-full"></div> cycle</div>
                           <div className="flex items-center gap-2"><div className="size-1.5 bg-primary rounded-full"></div> debouches</div>
                        </div>
                     </div>
                     <p className="text-[9px] text-gray-500 font-medium italic mt-4">Note: Utilisez "|" pour séparer les débouchés et diplômes.</p>
                  </div>
               </div>
            </div>
          )}

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
                        {staffList.map((s) => (
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
                                    {s.role.replace('_', ' ')}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex gap-2">
                                    {AVAILABLE_PERMISSIONS.map(p => (
                                       <div 
                                          key={p.code} 
                                          title={p.label}
                                          className={`size-8 rounded-lg flex items-center justify-center border ${
                                             s.permissions?.includes(p.code) 
                                                ? 'bg-primary/10 border-primary/30 text-primary' 
                                                : 'bg-white/5 border-white/5 text-gray-600 grayscale'
                                          }`}
                                       >
                                          <span className="material-symbols-outlined text-sm font-bold">
                                             {p.code === 'manage_catalog' ? 'category' : 
                                              p.code === 'validate_apps' ? 'check_circle' : 
                                              p.code === 'view_logs' ? 'monitoring' : 'palette'}
                                          </span>
                                       </div>
                                    ))}
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex gap-4">
                                    <button className="text-gray-500 hover:text-white transition-colors"><span className="material-symbols-outlined">edit</span></button>
                                    <button className="text-gray-500 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'cms' && (
            <div className="space-y-12 animate-fade-in text-left">
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Gestion <span className="text-primary italic">CMS</span></h2>
                <p className="text-gray-500 text-lg font-medium">Contrôlez l'apparence visuelle et les réglages de langue du portail.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Section Thèmes */}
                <div className="space-y-6">
                   <div className="flex items-center gap-4 px-2">
                     <span className="material-symbols-outlined text-primary font-bold">palette</span>
                     <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">Personnalisation des Thèmes</h3>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      {themes.map(t => (
                        <div key={t.id} className={`p-8 rounded-[40px] border-2 transition-all flex flex-col md:flex-row justify-between items-center gap-6 ${t.isActive ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                           <div className="flex items-center gap-6">
                              <div className="size-16 rounded-[24px] border border-white/10 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: t.background }}>
                                 <div className="size-8 rounded-full shadow-lg" style={{ backgroundColor: t.primary }}></div>
                                 <div className="absolute inset-0 bg-white/5"></div>
                              </div>
                              <div className="space-y-1">
                                 <h4 className="text-xl font-black text-white tracking-tight">{t.name}</h4>
                                 <div className="flex gap-2">
                                    <div className="size-3 rounded-full" style={{ backgroundColor: t.primary }}></div>
                                    <div className="size-3 rounded-full" style={{ backgroundColor: t.background }}></div>
                                    <div className="size-3 rounded-full" style={{ backgroundColor: t.surface }}></div>
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <button 
                                onClick={() => setEditingTheme(t)}
                                className="size-12 rounded-2xl bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all border border-white/5"
                              >
                                <span className="material-symbols-outlined text-xl">tune</span>
                              </button>
                              {!t.isActive && (
                                <button 
                                  onClick={() => applyTheme(t.id)}
                                  className="px-8 py-3 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                >
                                  Activer
                                </button>
                              )}
                              {t.isActive && (
                                <span className="px-8 py-3 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
                                   Actif
                                   <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                                </span>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Section Langues & International */}
                <div className="space-y-6">
                   <div className="flex items-center gap-4 px-2">
                     <span className="material-symbols-outlined text-primary font-bold">language</span>
                     <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">Langues du Système</h3>
                   </div>
                   <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6">
                      <p className="text-gray-400 text-sm font-medium">Cochez les langues disponibles pour les utilisateurs sur le portail public.</p>
                      <div className="grid grid-cols-1 gap-4">
                         {languages.map(lang => (
                           <div key={lang.code} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center text-primary font-black uppercase text-xs">
                                    {lang.code}
                                 </div>
                                 <div>
                                    <p className="font-black text-white">{lang.label}</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{lang.isActive ? 'Disponible sur le portail' : 'Désactivé'}</p>
                                 </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={lang.isActive} 
                                  onChange={() => toggleLanguage(lang.code)}
                                  className="sr-only peer" 
                                />
                                <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                              </label>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-12 animate-fade-in text-left">
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Réglages <span className="text-primary italic">Système</span></h2>
                <p className="text-gray-500 text-lg font-medium">Paramétrez les informations globales et les états du site.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                 {/* Configuration Identité */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                       <span className="material-symbols-outlined text-primary font-bold">info</span>
                       <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">Identité du Portail</h3>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Nom de la Plateforme</label>
                          <input defaultValue="Etudier au Bénin" className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Email de Support Principal</label>
                          <input defaultValue="contact@etudieraubenin.com" className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Ligne WhatsApp Officielle</label>
                          <input defaultValue="+229 21 00 00 00" className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                       </div>
                       <button className="w-full py-4 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">Sauvegarder les changements</button>
                    </div>
                 </div>

                 {/* Configuration État & Maintenance */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                       <span className="material-symbols-outlined text-primary font-bold">power_settings_new</span>
                       <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">État du Système</h3>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-8">
                       <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                          <div>
                             <p className="font-black text-white">Mode Maintenance</p>
                             <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Désactive le portail public pour tous</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={isMaintenance} 
                              onChange={() => setIsMaintenance(!isMaintenance)}
                              className="sr-only peer" 
                            />
                            <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                          </label>
                       </div>

                       <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl space-y-3">
                          <div className="flex items-center gap-2 text-amber-500">
                             <span className="material-symbols-outlined font-bold">warning</span>
                             <p className="text-[10px] font-black uppercase tracking-widest">Attention</p>
                          </div>
                          <p className="text-xs text-amber-500/80 font-medium">L'activation du mode maintenance rendra le site inaccessible aux étudiants. Seuls les comptes Super Admin pourront se connecter.</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
             <div className="space-y-8 animate-fade-in max-w-2xl text-left">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Flux Système</h2>
                <div className="bg-black/40 rounded-[32px] p-8 border border-white/5 font-mono text-xs text-primary space-y-4 shadow-inner">
                   <p className="opacity-60">[10:15:22] SYNC_WIZARD started...</p>
                   <p>[10:15:24] Nexus Bridge connection established.</p>
                   <p className="text-white font-black">[10:16:01] Importation massive complétée par SuperAdmin.</p>
                   <div className="animate-pulse">_</div>
                </div>
             </div>
          )}
        </div>

        {/* MODAL: EDIT THEME */}
        {editingTheme && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border border-white/5 my-auto animate-in zoom-in-95 duration-300">
                <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex justify-between items-center text-left">
                   <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined font-bold">tune</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Personnaliser {editingTheme.name}</h3>
                   </div>
                   <button onClick={() => setEditingTheme(null)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                <div className="p-10 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Couleur Primaire</label>
                         <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <input 
                              type="color" 
                              value={editingTheme.primary} 
                              onChange={(e) => updateTheme(editingTheme.id, { primary: e.target.value })}
                              className="size-10 bg-transparent border-none cursor-pointer" 
                            />
                            <span className="font-mono text-xs text-white uppercase">{editingTheme.primary}</span>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Arrière-plan</label>
                         <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <input 
                              type="color" 
                              value={editingTheme.background} 
                              onChange={(e) => updateTheme(editingTheme.id, { background: e.target.value })}
                              className="size-10 bg-transparent border-none cursor-pointer" 
                            />
                            <span className="font-mono text-xs text-white uppercase">{editingTheme.background}</span>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Surface des cartes</label>
                         <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <input 
                              type="color" 
                              value={editingTheme.surface} 
                              onChange={(e) => updateTheme(editingTheme.id, { surface: e.target.value })}
                              className="size-10 bg-transparent border-none cursor-pointer" 
                            />
                            <span className="font-mono text-xs text-white uppercase">{editingTheme.surface}</span>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Rayon des coins (Radius)</label>
                         <select 
                            value={editingTheme.radius} 
                            onChange={(e) => updateTheme(editingTheme.id, { radius: e.target.value })}
                            className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 font-black text-xs text-white appearance-none outline-none focus:ring-2 focus:ring-primary/20"
                         >
                            <option value="0px" className="bg-[#162a1f]">Carré (0px)</option>
                            <option value="0.5rem" className="bg-[#162a1f]">Classique (0.5rem)</option>
                            <option value="1rem" className="bg-[#162a1f]">Arrondi (1rem)</option>
                            <option value="2rem" className="bg-[#162a1f]">Premium (2rem)</option>
                            <option value="3rem" className="bg-[#162a1f]">Ultra (3rem)</option>
                         </select>
                      </div>
                   </div>

                   <div className="p-8 rounded-[32px] border-2 border-dashed border-white/5 bg-white/2 space-y-4">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Aperçu en temps réel</p>
                      <div className="flex justify-center">
                         <div className="w-full p-6 rounded-[2rem] shadow-2xl border border-white/5" style={{ backgroundColor: editingTheme.surface, borderRadius: editingTheme.radius }}>
                            <div className="h-4 w-24 mb-4 rounded-full" style={{ backgroundColor: editingTheme.primary }}></div>
                            <div className="h-2 w-full mb-2 bg-white/5 rounded-full"></div>
                            <div className="h-2 w-3/4 bg-white/5 rounded-full"></div>
                         </div>
                      </div>
                   </div>

                   <button 
                    onClick={() => setEditingTheme(null)}
                    className="w-full py-5 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl mt-6"
                   >
                    Fermer le Customiseur
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* MODAL: ADD STAFF */}
        {showStaffModal && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-white/5 my-auto animate-in zoom-in-95 duration-300">
                <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex justify-between items-center text-left">
                   <h3 className="text-2xl font-black text-white tracking-tight">Nouvel accès administratif</h3>
                   <button onClick={() => setShowStaffModal(false)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                <form onSubmit={addStaffMember} className="p-10 space-y-6 text-left">
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
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Rôle</label>
                      <select name="role" className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                         <option value="admin" className="bg-[#162a1f]">Administrateur (Dashboard Admin)</option>
                         <option value="super_admin" className="bg-[#162a1f]">Super Admin (Super Console)</option>
                      </select>
                   </div>
                   
                   <div className="space-y-4 pt-4">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Permissions granulaires</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {AVAILABLE_PERMISSIONS.map(p => (
                            <label key={p.code} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                               <input type="checkbox" name={`perm_${p.code}`} className="size-5 rounded border-gray-600 text-primary focus:ring-primary" />
                               <span className="text-xs font-bold text-gray-300">{p.label}</span>
                            </label>
                         ))}
                      </div>
                   </div>

                   <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 mt-6">Créer le compte & assigner les droits</button>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
