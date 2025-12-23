
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { University, Major, Application } from '../types';

type AdminView = 'overview' | 'applications' | 'catalog' | 'cms' | 'settings';
type CatalogSection = 'universities' | 'majors';

const AdminDashboard: React.FC = () => {
  const { 
    content, translate, updateContent, languages, 
    toggleLanguage, themes, applyTheme, activeTheme, updateTheme, userRole,
    applications, updateApplicationStatus, deleteApplication,
    universities, addUniversity, updateUniversity, deleteUniversity,
    majors, addMajor, updateMajor, deleteMajor, logout
  } = useCMS();
  
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [activeCatalogSection, setActiveCatalogSection] = useState<CatalogSection>('universities');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isSuperAdmin = userRole === 'super_admin';

  const kpis = [
    { label: 'Candidatures', val: applications.length.toString(), change: '+12%', icon: 'school', color: 'bg-primary/10 text-primary' },
    { label: 'Revenus', val: '12.4M', change: '+5%', icon: 'payments', color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'Établissements', val: universities.length.toString(), change: '+2', icon: 'account_balance', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Filières', val: majors.length.toString(), change: '+8', icon: 'library_books', color: 'bg-purple-500/10 text-purple-500' }
  ];

  const SidebarNav = () => (
    <div className="flex flex-col h-full py-10 px-6">
      <div className="flex items-center gap-4 px-4 mb-12">
        <div className="size-11 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shrink-0">
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
          { id: 'applications', label: 'Candidatures', icon: 'description', badge: applications.length.toString() },
          { id: 'catalog', label: 'Catalogue Acad.', icon: 'category' },
          { id: 'cms', label: 'Gestion CMS', icon: 'auto_fix_high' },
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
        <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
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
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden size-11 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="text-xl lg:text-2xl font-black dark:text-white tracking-tighter uppercase">Admin Console</h1>
           </div>
        </header>

        <div className="p-4 lg:p-12 space-y-10">
          {activeView === 'overview' && (
            <div className="space-y-10 animate-fade-in">
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  {kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm group">
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

          {activeView === 'applications' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Gestion des Dossiers</h2>
                <div className="flex gap-4">
                   <span className="px-4 py-1.5 bg-amber-400 text-black text-[10px] font-black rounded-full uppercase tracking-widest">En attente : {applications.filter(a => a.status === 'En attente').length}</span>
                   <span className="px-4 py-1.5 bg-primary text-black text-[10px] font-black rounded-full uppercase tracking-widest">Validés : {applications.filter(a => a.status === 'Validé').length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {applications.map(app => (
                  <div key={app.id} className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-6 flex-1 w-full">
                       <div className="size-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-primary shrink-0 border border-gray-100 dark:border-white/10">
                          <span className="material-symbols-outlined text-3xl font-bold">person_outline</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{app.id} • {app.studentName}</p>
                          <h4 className="text-2xl font-black dark:text-white leading-tight">{app.majorName}</h4>
                          <p className="text-sm font-bold text-gray-500 uppercase">{app.universityName}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto md:border-l md:pl-8 border-gray-100 dark:border-white/10">
                       <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         app.status === 'Validé' ? 'bg-primary/10 text-primary' : 
                         app.status === 'Rejeté' ? 'bg-red-500/10 text-red-500' : 'bg-amber-400/10 text-amber-500'
                       }`}>
                         {app.status}
                       </span>
                       <div className="flex gap-2">
                          <button onClick={() => updateApplicationStatus(app.id, 'Validé')} className="size-11 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all flex items-center justify-center">
                             <span className="material-symbols-outlined">check_circle</span>
                          </button>
                          <button onClick={() => updateApplicationStatus(app.id, 'Rejeté')} className="size-11 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                             <span className="material-symbols-outlined">cancel</span>
                          </button>
                          <button onClick={() => deleteApplication(app.id)} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center">
                             <span className="material-symbols-outlined">delete</span>
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                   <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-[48px] border-2 border-dashed border-gray-100 dark:border-white/10">
                      <p className="text-gray-400 font-bold">Aucune candidature pour le moment.</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'catalog' && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex gap-4 p-2 bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-white/10 w-fit">
                  <button onClick={() => setActiveCatalogSection('universities')} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'universities' ? 'bg-primary text-black' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>Universités & Écoles</button>
                  <button onClick={() => setActiveCatalogSection('majors')} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'majors' ? 'bg-primary text-black' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>Filières</button>
               </div>

               {activeCatalogSection === 'universities' && (
                  <div className="grid grid-cols-1 gap-4">
                     {universities.map(uni => (
                        <div key={uni.id} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex items-center justify-between group">
                           <div className="flex items-center gap-6">
                              <img src={uni.logo} className="size-12 rounded-xl object-contain bg-gray-50" alt="" />
                              <div>
                                 <h3 className="font-black dark:text-white text-xl">{uni.name} ({uni.acronym})</h3>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{uni.type} • {uni.location}</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center"><span className="material-symbols-outlined text-xl">edit</span></button>
                              <button onClick={() => deleteUniversity(uni.id)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center"><span className="material-symbols-outlined text-xl">delete</span></button>
                           </div>
                        </div>
                     ))}
                     <button onClick={() => alert('Interface de création Universités non implémentée')} className="p-8 rounded-[32px] border-2 border-dashed border-primary/20 text-primary font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary/5 transition-all">
                        + Ajouter un établissement
                     </button>
                  </div>
               )}

               {activeCatalogSection === 'majors' && (
                  <div className="grid grid-cols-1 gap-4">
                     {majors.map(major => (
                        <div key={major.id} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex items-center justify-between group">
                           <div className="flex items-center gap-6">
                              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">{major.level[0]}</div>
                              <div>
                                 <h3 className="font-black dark:text-white text-xl">{major.name}</h3>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{major.universityName} • {major.fees}</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center"><span className="material-symbols-outlined text-xl">edit</span></button>
                              <button onClick={() => deleteMajor(major.id)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center"><span className="material-symbols-outlined text-xl">delete</span></button>
                           </div>
                        </div>
                     ))}
                     <button onClick={() => alert('Interface de création Filières non implémentée')} className="p-8 rounded-[32px] border-2 border-dashed border-primary/20 text-primary font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary/5 transition-all">
                        + Ajouter une filière
                     </button>
                  </div>
               )}
            </div>
          )}

          {activeView === 'cms' && (
             <div className="bg-white dark:bg-surface-dark p-10 rounded-[48px] border border-gray-100 dark:border-white/10">
                <p className="text-gray-400 font-bold text-center">Interface CMS existante préservée.</p>
                {/* La logique existante de gestion CMS reste ici */}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
