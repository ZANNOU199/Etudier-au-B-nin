
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';

type AdminView = 'overview' | 'applications' | 'cms' | 'analytics' | 'settings';
type CMSSectionType = 'content' | 'theme' | 'languages';

const AdminDashboard: React.FC = () => {
  const { 
    content, translate, updateContent, languages, 
    toggleLanguage, themes, applyTheme, activeTheme, updateTheme, userRole 
  } = useCMS();
  
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [activeCMSSection, setActiveCMSSection] = useState<CMSSectionType>('content');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isSuperAdmin = userRole === 'super_admin';

  const kpis = [
    { label: 'Candidatures 2024', val: '12 450', change: '+12%', icon: 'school', color: 'bg-primary/10 text-primary' },
    { label: 'Revenus Collectés', val: '24.5M', change: '+18%', icon: 'payments', color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'Taux de Validation', val: '92%', change: '+2%', icon: 'verified', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Utilisateurs Actifs', val: '3,840', change: '+5%', icon: 'groups', color: 'bg-purple-500/10 text-purple-500' }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const SidebarNav = () => (
    <div className="flex flex-col h-full py-10 px-6">
      <div className="flex items-center gap-4 px-4 mb-12">
        <div className="size-11 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/30 shrink-0">
          <span className="material-symbols-outlined text-2xl font-black">shield_person</span>
        </div>
        <div>
          <h2 className="font-black text-lg text-white tracking-tight leading-none">AdminHub</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Console Master</p>
        </div>
      </div>

      <nav className="flex-grow space-y-2">
        {[
          { id: 'overview', label: 'Dashboard', icon: 'grid_view' },
          { id: 'applications', label: 'Candidatures', icon: 'description', badge: '12' },
          { id: 'cms', label: 'Gestion CMS', icon: 'auto_fix_high' },
          { id: 'analytics', label: 'Rapports', icon: 'leaderboard' },
          { id: 'settings', label: 'Paramètres', icon: 'settings' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => {
              setActiveView(item.id as AdminView);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
              activeView === item.id 
              ? 'bg-primary text-black shadow-lg shadow-primary/20' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </div>
            {item.badge && (
              <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeView === item.id ? 'bg-black text-white' : 'bg-white/10 text-gray-400'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="pt-10">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
          <span className="material-symbols-outlined text-xl">logout</span>
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#f4f7f6] dark:bg-background-dark font-display overflow-hidden relative">
      
      <aside className="hidden lg:flex w-80 bg-[#0d1b13] flex-col shrink-0 z-30 shadow-2xl border-r border-white/5">
        <SidebarNav />
      </aside>

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-80 bg-[#0d1b13] z-[60] lg:hidden animate-in slide-in-from-left duration-300">
            <SidebarNav />
          </aside>
        </>
      )}

      <main className="flex-1 overflow-y-auto h-screen bg-gray-50 dark:bg-background-dark/50 flex flex-col">
        
        <header className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 lg:px-12 py-6 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden size-11 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="hidden sm:block space-y-0.5">
                 <h1 className="text-xl lg:text-2xl font-black dark:text-white tracking-tighter uppercase">
                    {activeView === 'overview' ? 'Administration' : 
                     activeView === 'cms' ? 'Portail CMS' :
                     activeView === 'applications' ? 'Candidatures' :
                     activeView === 'analytics' ? 'Analyses' : 'Paramètres'}
                 </h1>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pilotage Central Session 2024</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="size-11 rounded-xl bg-primary text-black flex items-center justify-center font-black shadow-lg shadow-primary/20">
                AD
              </div>
           </div>
        </header>

        <div className="p-4 lg:p-12 space-y-10">
          
          {/* VIEW: OVERVIEW */}
          {activeView === 'overview' && (
            <div className="space-y-12 animate-fade-in">
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  {kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`size-12 rounded-xl flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                          <span className="material-symbols-outlined font-bold text-2xl">{kpi.icon}</span>
                        </div>
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{kpi.change}</span>
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                      <p className="text-3xl font-black dark:text-white tracking-tighter">{kpi.val}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* VIEW: CMS */}
          {activeView === 'cms' && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex flex-wrap gap-4 bg-white dark:bg-surface-dark p-2 rounded-[24px] shadow-sm border border-gray-100 dark:border-white/5">
                  {[
                    { id: 'content', label: 'Textes & Blocs', icon: 'edit_note' },
                    { id: 'theme', label: 'Thèmes & Design', icon: 'palette', restricted: !isSuperAdmin },
                    { id: 'languages', label: 'Langues', icon: 'translate', restricted: !isSuperAdmin },
                  ].filter(s => !s.restricted).map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setActiveCMSSection(s.id as CMSSectionType)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCMSSection === s.id ? 'bg-primary text-black' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <span className="material-symbols-outlined text-lg">{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
               </div>

               {/* CMS SECTION: CONTENT */}
               {activeCMSSection === 'content' && (
                 <div className="grid grid-cols-1 gap-6">
                    {Object.keys(content).map(key => (
                      <div key={key} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-4">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Clé: {key}</span>
                          <span className="material-symbols-outlined text-gray-300">key</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {languages.filter(l => l.isActive).map(lang => (
                            <div key={lang.code} className="space-y-2">
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{lang.label}</label>
                              <textarea 
                                value={content[key][lang.code] || ''}
                                onChange={(e) => updateContent(key, lang.code, e.target.value)}
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none font-bold dark:text-white resize-none"
                                rows={2}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end pt-4">
                      <button className="px-12 py-5 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[11px] uppercase tracking-widest">
                        Publier les changements
                      </button>
                    </div>
                 </div>
               )}

               {/* CMS SECTION: THEME */}
               {activeCMSSection === 'theme' && (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {themes.map(theme => (
                        <div key={theme.id} className={`bg-white dark:bg-surface-dark p-8 rounded-[32px] border-2 transition-all ${theme.isActive ? 'border-primary shadow-xl' : 'border-transparent opacity-60'}`}>
                           <div className="flex justify-between items-center mb-6">
                             <h3 className="text-xl font-black dark:text-white tracking-tight">{theme.name}</h3>
                             {theme.isActive && <span className="material-symbols-outlined text-primary">check_circle</span>}
                           </div>
                           <div className="flex gap-3 mb-8">
                              <div className="size-10 rounded-xl shadow-inner" style={{ backgroundColor: theme.primary }}></div>
                              <div className="size-10 rounded-xl shadow-inner" style={{ backgroundColor: theme.background }}></div>
                              <div className="size-10 rounded-xl shadow-inner" style={{ backgroundColor: theme.surface }}></div>
                           </div>
                           <button 
                             onClick={() => applyTheme(theme.id)}
                             disabled={theme.isActive}
                             className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${theme.isActive ? 'bg-primary text-black' : 'bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary'}`}
                           >
                             {theme.isActive ? 'Actif' : 'Sélectionner'}
                           </button>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-premium space-y-8">
                      <h3 className="text-sm font-black dark:text-white uppercase tracking-widest border-b border-gray-50 dark:border-white/5 pb-4">Style Dynamique</h3>
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Couleur Primaire</label>
                            <div className="flex items-center gap-4">
                              <input 
                                type="color" 
                                value={activeTheme.primary} 
                                onChange={(e) => updateTheme(activeTheme.id, { primary: e.target.value })}
                                className="size-12 rounded-xl bg-transparent cursor-pointer" 
                              />
                              <span className="text-xs font-black dark:text-white uppercase">{activeTheme.primary}</span>
                            </div>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bords arrondis (Radius)</label>
                            <input 
                              type="text" 
                              value={activeTheme.radius} 
                              onChange={(e) => updateTheme(activeTheme.id, { radius: e.target.value })}
                              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none outline-none font-bold dark:text-white" 
                            />
                         </div>
                      </div>
                    </div>
                 </div>
               )}

               {/* CMS SECTION: LANGUAGES */}
               {activeCMSSection === 'languages' && (
                 <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-10">
                    <div className="flex items-center gap-4 border-b border-gray-50 dark:border-white/5 pb-6">
                      <span className="material-symbols-outlined text-primary">translate</span>
                      <h3 className="text-xl font-black dark:text-white tracking-tighter uppercase tracking-widest text-xs">Gestion Multilingue</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {languages.map(lang => (
                        <div key={lang.code} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-[24px] border border-gray-100 dark:border-white/5">
                           <div className="flex items-center gap-4">
                             <div className="size-12 bg-white dark:bg-surface-dark rounded-xl flex items-center justify-center font-black text-primary shadow-sm">{lang.code.toUpperCase()}</div>
                             <div>
                               <p className="font-black dark:text-white">{lang.label}</p>
                               <p className="text-[10px] text-gray-400 uppercase font-black">{lang.isActive ? 'Activée' : 'Désactivée'}</p>
                             </div>
                           </div>
                           <button 
                             onClick={() => toggleLanguage(lang.code)}
                             className={`size-12 rounded-xl flex items-center justify-center transition-all ${lang.isActive ? 'bg-primary text-black' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}
                           >
                             <span className="material-symbols-outlined">{lang.isActive ? 'visibility' : 'visibility_off'}</span>
                           </button>
                        </div>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
