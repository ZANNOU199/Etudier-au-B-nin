
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { University, Major, Application } from '../types';

type AdminView = 'overview' | 'applications' | 'catalog' | 'cms' | 'settings';
type CatalogSection = 'universities' | 'majors';
type EstablishmentFilter = 'all' | 'university' | 'school';

const AdminDashboard: React.FC = () => {
  const { 
    content, translate, updateContent, languages, 
    toggleLanguage, themes, applyTheme, activeTheme, updateTheme, userRole,
    applications, updateApplicationStatus, deleteApplication,
    universities, addUniversity, updateUniversity, deleteUniversity,
    majors, addMajor, updateMajor, deleteMajor, logout, user
  } = useCMS();
  
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [activeCatalogSection, setActiveCatalogSection] = useState<CatalogSection>('universities');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [establishmentFilter, setEstablishmentFilter] = useState<EstablishmentFilter>('all');
  
  // Catalog Form States
  const [showUniForm, setShowUniForm] = useState(false);
  const [showMajorForm, setShowMajorForm] = useState(false);
  const [editingUni, setEditingUni] = useState<University | null>(null);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);

  // Modal logic states
  const [isSchoolKind, setIsSchoolKind] = useState(false);
  const [parentUniId, setParentUniId] = useState<string>('');

  const navigate = useNavigate();

  const isSuperAdmin = userRole === 'super_admin';

  const kpis = [
    { label: 'Candidatures', val: applications.length.toString(), change: '+12%', icon: 'school', color: 'bg-primary/10 text-primary' },
    { label: 'Revenus', val: '12.4M', change: '+5%', icon: 'payments', color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'Établissements', val: universities.length.toString(), change: '+2', icon: 'account_balance', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Filières', val: majors.length.toString(), change: '+8', icon: 'library_books', color: 'bg-purple-500/10 text-purple-500' }
  ];

  const filteredUniversities = useMemo(() => {
    return universities.filter(u => {
      if (establishmentFilter === 'university') return !u.isStandaloneSchool;
      if (establishmentFilter === 'school') return u.isStandaloneSchool;
      return true;
    });
  }, [universities, establishmentFilter]);

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
            {item.badge && item.badge !== '0' && (
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
           <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-black font-black text-xs shadow-lg">AD</div>
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
                       <button onClick={() => setSelectedApp(app)} className="size-11 rounded-xl bg-primary text-black hover:bg-green-400 transition-all flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined font-bold">visibility</span>
                       </button>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                   <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-[48px] border-2 border-dashed border-gray-100 dark:border-white/10">
                      <p className="text-gray-400 font-bold">Aucune candidature pour le moment.</p>
                   </div>
                )}
              </div>

              {/* Application Details Modal */}
              {selectedApp && (
                <div 
                  className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
                  onClick={() => setSelectedApp(null)}
                >
                   <div 
                    className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                   >
                      <div className="p-10 space-y-8">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Dossier N° {selectedApp.id}</p>
                               <h3 className="text-3xl font-black dark:text-white tracking-tighter leading-none">{selectedApp.studentName}</h3>
                               <p className="text-gray-500 font-bold mt-2">Candidat pour : {selectedApp.majorName}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                               <span className="material-symbols-outlined">close</span>
                            </button>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Établissement</p>
                               <p className="font-black dark:text-white">{selectedApp.universityName}</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Soumis le</p>
                               <p className="font-black dark:text-white">{selectedApp.date}</p>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Documents du dossier</h4>
                            <div className="grid grid-cols-1 gap-2">
                               {selectedApp.documents.map((doc, i) => (
                                 <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 group">
                                    <div className="flex items-center gap-3">
                                       <span className="material-symbols-outlined text-primary">article</span>
                                       <span className="text-sm font-bold dark:text-white">{doc}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary cursor-pointer">download</span>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-white/10">
                            <button 
                              onClick={() => { updateApplicationStatus(selectedApp.id, 'Validé'); setSelectedApp(null); }}
                              className="flex-1 min-w-[140px] py-4 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                            >
                              Valider
                            </button>
                            <button 
                              onClick={() => { updateApplicationStatus(selectedApp.id, 'Rejeté'); setSelectedApp(null); }}
                              className="flex-1 min-w-[140px] py-4 bg-red-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
                            >
                              Rejeter
                            </button>
                            <button 
                              onClick={() => setSelectedApp(null)}
                              className="flex-1 min-w-[140px] py-4 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                            >
                              Fermer
                            </button>
                            <button 
                              onClick={() => { deleteApplication(selectedApp.id); setSelectedApp(null); }}
                              className="size-14 rounded-2xl border border-gray-100 dark:border-white/10 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center"
                              title="Supprimer la candidature"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {activeView === 'catalog' && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                 <div className="flex gap-4 p-2 bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-white/10 w-fit">
                    <button onClick={() => setActiveCatalogSection('universities')} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'universities' ? 'bg-primary text-black' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>Universités & Écoles</button>
                    <button onClick={() => setActiveCatalogSection('majors')} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'majors' ? 'bg-primary text-black' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>Filières</button>
                 </div>

                 {activeCatalogSection === 'universities' && (
                   <div className="flex gap-2 p-1 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/10">
                      {[
                        { id: 'all', label: 'Tout' },
                        { id: 'university', label: 'Universités' },
                        { id: 'school', label: 'Écoles' }
                      ].map(filter => (
                        <button
                          key={filter.id}
                          onClick={() => setEstablishmentFilter(filter.id as EstablishmentFilter)}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${establishmentFilter === filter.id ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                          {filter.label}
                        </button>
                      ))}
                   </div>
                 )}
               </div>

               {activeCatalogSection === 'universities' && (
                  <div className="grid grid-cols-1 gap-4">
                     {filteredUniversities.map(uni => (
                        <div key={uni.id} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex items-center justify-between group">
                           <div className="flex items-center gap-6">
                              <div className="relative">
                                <img src={uni.logo} className="size-14 rounded-xl object-contain bg-gray-50 border border-gray-100" alt="" />
                                <span className={`absolute -top-2 -right-2 size-5 rounded-full flex items-center justify-center text-[8px] font-black ${uni.isStandaloneSchool ? 'bg-amber-400 text-black' : 'bg-primary text-black'}`} title={uni.isStandaloneSchool ? 'École' : 'Université'}>
                                   {uni.isStandaloneSchool ? 'E' : 'U'}
                                </span>
                              </div>
                              <div>
                                 <h3 className="font-black dark:text-white text-xl">{uni.name} ({uni.acronym})</h3>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {uni.isStandaloneSchool ? 'École' : 'Université'} • {uni.type} • {uni.location}
                                 </p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => { 
                                setEditingUni(uni); 
                                setIsSchoolKind(uni.isStandaloneSchool || false);
                                setShowUniForm(true); 
                              }} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center"><span className="material-symbols-outlined text-xl">edit</span></button>
                              <button onClick={() => deleteUniversity(uni.id)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center"><span className="material-symbols-outlined text-xl">delete</span></button>
                           </div>
                        </div>
                     ))}
                     <button onClick={() => { 
                       setEditingUni(null); 
                       setIsSchoolKind(false);
                       setShowUniForm(true); 
                     }} className="p-8 rounded-[32px] border-2 border-dashed border-primary/20 text-primary font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary/5 transition-all">
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
                              <button onClick={() => { setEditingMajor(major); setShowMajorForm(true); }} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center"><span className="material-symbols-outlined text-xl">edit</span></button>
                              <button onClick={() => deleteMajor(major.id)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center"><span className="material-symbols-outlined text-xl">delete</span></button>
                           </div>
                        </div>
                     ))}
                     <button onClick={() => { setEditingMajor(null); setShowMajorForm(true); }} className="p-8 rounded-[32px] border-2 border-dashed border-primary/20 text-primary font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary/5 transition-all">
                        + Ajouter une filière
                     </button>
                  </div>
               )}

               {/* University/School Form Modal */}
               {showUniForm && (
                 <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in overflow-y-auto">
                   <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[40px] shadow-2xl p-10 space-y-8 my-10">
                     <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-black dark:text-white">{editingUni ? 'Modifier' : 'Ajouter'} un Établissement</h3>
                       <button onClick={() => setShowUniForm(false)} className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                     </div>

                     <div className="flex gap-4 p-1.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                        <button 
                          onClick={() => setIsSchoolKind(false)} 
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isSchoolKind ? 'bg-primary text-black shadow-lg' : 'text-gray-400'}`}
                        >
                          Université
                        </button>
                        <button 
                          onClick={() => setIsSchoolKind(true)} 
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSchoolKind ? 'bg-amber-400 text-black shadow-lg' : 'text-gray-400'}`}
                        >
                          École
                        </button>
                     </div>

                     <form onSubmit={(e) => {
                       e.preventDefault();
                       const formData = new FormData(e.currentTarget);
                       const uniData: Partial<University> = {
                         id: editingUni?.id || (isSchoolKind ? 'sch-' : 'uni-') + Date.now(),
                         name: formData.get('name') as string,
                         acronym: formData.get('acronym') as string,
                         location: formData.get('location') as string,
                         type: formData.get('type') as any,
                         description: formData.get('description') as string,
                         isStandaloneSchool: isSchoolKind,
                         logo: editingUni?.logo || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=100',
                         cover: editingUni?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
                         stats: editingUni?.stats || { students: '0', majors: 0, founded: '2024', ranking: 'N/A' },
                         faculties: editingUni?.faculties || []
                       };
                       
                       // Si c'est une école rattachée (parentUniId sélectionné)
                       if (isSchoolKind && parentUniId) {
                          // Logique de rattachement : on pourrait soit l'ajouter au faculties de l'uni parent
                          // soit gérer via un champ parentId (pour l'instant on reste simple : Standalone = Ecole)
                       }

                       if (editingUni) updateUniversity(uniData as University);
                       else addUniversity(uniData as University);
                       setShowUniForm(false);
                     }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="md:col-span-2 space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Nom Complet</label>
                         <input name="name" required defaultValue={editingUni?.name} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                       </div>
                       
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Sigle (Acronyme)</label>
                         <input name="acronym" required defaultValue={editingUni?.acronym} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Statut Financier</label>
                         <select name="type" required defaultValue={editingUni?.type} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary/20">
                           <option value="Public">Public</option>
                           <option value="Privé">Privé</option>
                         </select>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Ville principale</label>
                         <input name="location" required defaultValue={editingUni?.location} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                       </div>

                       {isSchoolKind && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400">Université de rattachement</label>
                          <select 
                            value={parentUniId} 
                            onChange={(e) => setParentUniId(e.target.value)}
                            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">Aucune (École Autonome)</option>
                            {universities.filter(u => !u.isStandaloneSchool).map(u => (
                              <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                          </select>
                        </div>
                       )}

                       <div className="md:col-span-2 space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Description / Présentation</label>
                         <textarea name="description" rows={3} defaultValue={editingUni?.description} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 dark:text-white font-bold resize-none outline-none focus:ring-2 focus:ring-primary/20" />
                       </div>

                       <div className="md:col-span-2 pt-4">
                         <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-xl hover:scale-[1.02] transition-all">
                           {editingUni ? 'Enregistrer les modifications' : 'Créer l\'établissement'}
                         </button>
                       </div>
                     </form>
                   </div>
                 </div>
               )}

               {/* Major Form Modal (Same as before but ensures university list is updated) */}
               {showMajorForm && (
                 <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in overflow-y-auto">
                   <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[40px] shadow-2xl p-10 space-y-8">
                     <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-black dark:text-white">{editingMajor ? 'Modifier' : 'Ajouter'} une Filière</h3>
                       <button onClick={() => setShowMajorForm(false)} className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                     </div>
                     <form onSubmit={(e) => {
                       e.preventDefault();
                       const formData = new FormData(e.currentTarget);
                       const selectedUni = universities.find(u => u.id === formData.get('universityId'));
                       const majorData: Partial<Major> = {
                         id: editingMajor?.id || 'maj-' + Date.now(),
                         name: formData.get('name') as string,
                         universityId: formData.get('universityId') as string,
                         universityName: selectedUni?.name || 'Inconnu',
                         facultyName: formData.get('facultyName') as string,
                         domain: formData.get('domain') as string,
                         level: formData.get('level') as any,
                         duration: formData.get('duration') as string,
                         fees: formData.get('fees') as string,
                         location: selectedUni?.location || 'Cotonou',
                         image: editingMajor?.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
                       };
                       if (editingMajor) updateMajor(majorData as Major);
                       else addMajor(majorData as Major);
                       setShowMajorForm(false);
                     }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Nom de la filière</label>
                         <input name="name" required defaultValue={editingMajor?.name} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-bold" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Établissement</label>
                         <select name="universityId" required defaultValue={editingMajor?.universityId} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-bold">
                           {universities.map(u => <option key={u.id} value={u.id}>{u.acronym} - {u.name}</option>)}
                         </select>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Niveau</label>
                         <select name="level" required defaultValue={editingMajor?.level} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-bold">
                           <option value="Licence">Licence</option>
                           <option value="Master">Master</option>
                           <option value="Doctorat">Doctorat</option>
                         </select>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Domaine</label>
                         <input name="domain" required defaultValue={editingMajor?.domain} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-bold" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Coûts annuels</label>
                         <input name="fees" required defaultValue={editingMajor?.fees} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-bold" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Durée (Cycle)</label>
                         <input name="duration" required defaultValue={editingMajor?.duration} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-bold" />
                       </div>
                       <div className="md:col-span-2 pt-4">
                         <button type="submit" className="w-full py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-xl">Sauvegarder</button>
                       </div>
                     </form>
                   </div>
                 </div>
               )}
            </div>
          )}

          {activeView === 'settings' && (
            <div className="space-y-10 animate-fade-in max-w-4xl">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Paramètres Système</h2>
                  <p className="text-gray-500 font-medium">Configurez l'apparence et les préférences globales de la plateforme.</p>
               </div>

               <div className="grid grid-cols-1 gap-8">
                  {/* Appearance Settings */}
                  <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-8">
                     <div className="flex items-center gap-4 border-b border-gray-50 dark:border-white/5 pb-6">
                        <span className="material-symbols-outlined text-primary font-bold">palette</span>
                        <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-[11px]">Apparence & Thème</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {themes.map(t => (
                          <button 
                            key={t.id}
                            onClick={() => applyTheme(t.id)}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${t.isActive ? 'border-primary bg-primary/5' : 'border-gray-50 dark:border-white/5'}`}
                          >
                             <div className="size-10 rounded-xl shadow-inner" style={{ backgroundColor: t.primary }}></div>
                             <span className="font-black text-[10px] uppercase tracking-widest dark:text-white">{t.name}</span>
                             {t.isActive && <span className="material-symbols-outlined text-primary text-sm font-bold">check_circle</span>}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Language Settings */}
                  <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-8">
                     <div className="flex items-center gap-4 border-b border-gray-50 dark:border-white/5 pb-6">
                        <span className="material-symbols-outlined text-primary font-bold">translate</span>
                        <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-[11px]">Langues de la plateforme</h3>
                     </div>
                     <div className="flex gap-4">
                        {languages.map(l => (
                          <button 
                            key={l.code}
                            onClick={() => toggleLanguage(l.code)}
                            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${l.isActive ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}
                          >
                            {l.label}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Profile Settings (Admin Only) */}
                  <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-8">
                     <div className="flex items-center gap-4 border-b border-gray-50 dark:border-white/5 pb-6">
                        <span className="material-symbols-outlined text-primary font-bold">admin_panel_settings</span>
                        <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-[11px]">Mon Profil Administrateur</h3>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                           <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Connecté en tant que</span>
                           <span className="font-black dark:text-white">{user?.firstName} {user?.lastName}</span>
                        </div>
                        <div className="flex justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                           <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Rôle Master</span>
                           <span className="font-black text-primary uppercase text-[10px] tracking-widest">{user?.role}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'cms' && (
             <div className="space-y-10 animate-fade-in max-w-4xl">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Gestion CMS</h2>
                  <p className="text-gray-500 font-medium">Modifiez les textes statiques de la plateforme.</p>
               </div>
               <div className="bg-white dark:bg-surface-dark p-10 rounded-[48px] border border-gray-100 dark:border-white/10 space-y-8">
                  {Object.keys(content).map(key => (
                    <div key={key} className="space-y-4 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                       <h4 className="font-black text-primary uppercase text-[10px] tracking-widest">ID: {key}</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {languages.filter(l => l.isActive).map(l => (
                            <div key={l.code} className="space-y-1">
                               <label className="text-[9px] font-bold text-gray-400 uppercase">{l.label}</label>
                               <textarea 
                                  value={content[key][l.code]} 
                                  onChange={(e) => updateContent(key, l.code, e.target.value)}
                                  className="w-full p-4 rounded-xl border-none font-bold text-sm bg-white dark:bg-surface-dark resize-none"
                               />
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
