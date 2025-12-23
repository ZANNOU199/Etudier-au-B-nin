
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { University, Major, Application, Faculty, CareerProspect, RequiredDiploma } from '../types';

type AdminView = 'overview' | 'applications' | 'catalog' | 'cms' | 'settings';
type CatalogSection = 'universities' | 'majors';
type EstablishmentFilter = 'all' | 'university' | 'school';
type CreationStep = 'institution' | 'faculties' | 'majors';

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
  
  // Guided Creation State
  const [creationStep, setCreationStep] = useState<CreationStep>('institution');
  const [currentCreationId, setCurrentCreationId] = useState<string | null>(null);
  const [isSchoolKind, setIsSchoolKind] = useState(false);

  // Form Modals
  const [showUniForm, setShowUniForm] = useState(false);
  const [showMajorForm, setShowMajorForm] = useState(false);
  const [editingUni, setEditingUni] = useState<University | null>(null);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);

  const navigate = useNavigate();

  const filteredUniversities = useMemo(() => {
    return universities.filter(u => {
      if (establishmentFilter === 'university') return !u.isStandaloneSchool;
      if (establishmentFilter === 'school') return u.isStandaloneSchool;
      return true;
    });
  }, [universities, establishmentFilter]);

  const kpis = [
    { label: 'Candidatures', val: applications.length.toString(), icon: 'school', color: 'bg-primary/10 text-primary' },
    { label: 'Établissements', val: universities.length.toString(), icon: 'account_balance', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Filières', val: majors.length.toString(), icon: 'library_books', color: 'bg-purple-500/10 text-purple-500' },
    { label: 'Utilisateurs', val: '1.2k', icon: 'groups', color: 'bg-amber-500/10 text-amber-500' }
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Gestion des Dossiers</h2>
                <div className="flex gap-2">
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
                          <h4 className="text-xl md:text-2xl font-black dark:text-white leading-tight">{app.majorName}</h4>
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
              </div>

              {selectedApp && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedApp(null)}>
                   <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[48px] overflow-y-auto max-h-[90vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                      <div className="p-8 md:p-10 space-y-8">
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
                         <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-white/10">
                            <button onClick={() => { updateApplicationStatus(selectedApp.id, 'Validé'); setSelectedApp(null); }} className="flex-1 min-w-[120px] py-4 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl">Valider</button>
                            <button onClick={() => { updateApplicationStatus(selectedApp.id, 'Rejeté'); setSelectedApp(null); }} className="flex-1 min-w-[120px] py-4 bg-red-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl">Rejeter</button>
                            <button onClick={() => setSelectedApp(null)} className="flex-1 min-w-[120px] py-4 bg-gray-100 dark:bg-white/10 text-gray-400 font-black rounded-2xl text-[10px] uppercase tracking-widest">Fermer</button>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {activeView === 'catalog' && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/10">
                  <div className="flex gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <button onClick={() => setActiveCatalogSection('universities')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'universities' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'}`}>Universités & Écoles</button>
                    <button onClick={() => setActiveCatalogSection('majors')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'majors' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'}`}>Filières</button>
                  </div>
                  {activeCatalogSection === 'universities' && (
                    <div className="flex gap-2">
                       {['all', 'university', 'school'].map(f => (
                         <button key={f} onClick={() => setEstablishmentFilter(f as EstablishmentFilter)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${establishmentFilter === f ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-400 border border-gray-100 dark:border-white/10'}`}>
                           {f === 'all' ? 'Tout' : f === 'university' ? 'Universités' : 'Écoles'}
                         </button>
                       ))}
                    </div>
                  )}
               </div>

               {activeCatalogSection === 'universities' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                     {filteredUniversities.map(uni => (
                        <div key={uni.id} className="bg-white dark:bg-surface-dark p-6 rounded-[40px] border border-gray-100 dark:border-white/5 flex flex-col justify-between group hover:shadow-xl transition-all h-full">
                           <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center p-2 border border-gray-100 dark:border-white/10 relative">
                                   <img src={uni.logo} className="max-w-full max-h-full object-contain" alt="" />
                                   <span className={`absolute -top-2 -right-2 size-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-md ${uni.isStandaloneSchool ? 'bg-amber-400 text-black' : 'bg-primary text-black'}`}>
                                      {uni.isStandaloneSchool ? 'E' : 'U'}
                                   </span>
                                </div>
                                <div>
                                   <h3 className="font-black dark:text-white text-lg leading-none">{uni.acronym}</h3>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{uni.location}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                 <button onClick={() => { setEditingUni(uni); setIsSchoolKind(uni.isStandaloneSchool || false); setShowUniForm(true); setCreationStep('institution'); }} className="size-9 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                 <button onClick={() => deleteUniversity(uni.id)} className="size-9 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <h4 className="font-black dark:text-white text-sm line-clamp-1">{uni.name}</h4>
                              <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/10">
                                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{uni.type}</span>
                                 <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{uni.faculties.length} Entités</span>
                              </div>
                           </div>
                        </div>
                     ))}
                     <button onClick={() => { setEditingUni(null); setIsSchoolKind(false); setShowUniForm(true); setCreationStep('institution'); }} className="min-h-[200px] flex flex-col items-center justify-center gap-4 rounded-[40px] border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all group">
                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl font-bold">add</span>
                        </div>
                        <span className="font-black uppercase text-[11px] tracking-[0.3em] text-primary">Nouveau établissement</span>
                     </button>
                  </div>
               )}

               {activeCatalogSection === 'majors' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                     {majors.map(major => (
                        <div key={major.id} className="bg-white dark:bg-surface-dark p-6 rounded-[40px] border border-gray-100 dark:border-white/5 flex flex-col justify-between group h-full">
                           <div className="flex justify-between items-start mb-4">
                              <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-full uppercase tracking-widest">{major.level}</span>
                              <div className="flex gap-1">
                                 <button onClick={() => { setEditingMajor(major); setShowMajorForm(true); }} className="size-9 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                 <button onClick={() => deleteMajor(major.id)} className="size-9 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <h3 className="font-black dark:text-white text-lg leading-tight">{major.name}</h3>
                              <p className="text-xs font-bold text-gray-500 line-clamp-1">{major.universityName}</p>
                           </div>
                           <div className="mt-6 pt-4 border-t border-gray-50 dark:border-white/10 flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{major.duration}</span>
                              <span className="font-black text-primary text-xs">{major.fees}</span>
                           </div>
                        </div>
                     ))}
                     <button onClick={() => { setEditingMajor(null); setShowMajorForm(true); }} className="min-h-[200px] flex flex-col items-center justify-center gap-4 rounded-[40px] border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all group">
                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl font-bold">add</span>
                        </div>
                        <span className="font-black uppercase text-[11px] tracking-[0.3em] text-primary">Nouvelle filière</span>
                     </button>
                  </div>
               )}

               {/* Multi-step Creation Modal for University/School */}
               {showUniForm && (
                 <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
                   <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden my-auto">
                     
                     {/* Stepper Header */}
                     <div className="bg-gray-50 dark:bg-white/5 px-10 py-8 flex items-center justify-between border-b border-gray-100 dark:border-white/10">
                        <div className="flex gap-4 items-center">
                           {[
                             { id: 'institution', icon: 'account_balance' },
                             { id: 'faculties', icon: 'domain', disabled: !editingUni && creationStep === 'institution' },
                             { id: 'majors', icon: 'school', disabled: !editingUni && creationStep !== 'majors' }
                           ].map((s, i) => (
                             <div key={s.id} className="flex items-center">
                                <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${creationStep === s.id ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-white/10 text-gray-400'}`}>
                                   <span className="material-symbols-outlined text-xl font-bold">{s.icon}</span>
                                </div>
                                {i < 2 && <div className="w-6 h-0.5 bg-gray-200 dark:bg-white/10 mx-2"></div>}
                             </div>
                           ))}
                        </div>
                        <button onClick={() => setShowUniForm(false)} className="size-11 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                           <span className="material-symbols-outlined">close</span>
                        </button>
                     </div>

                     <div className="p-8 md:p-12 space-y-8">
                        {creationStep === 'institution' && (
                          <div className="space-y-8 animate-in slide-in-from-right-4">
                             <div className="flex gap-4 p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl">
                                <button onClick={() => setIsSchoolKind(false)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isSchoolKind ? 'bg-primary text-black shadow-lg' : 'text-gray-400'}`}>Université</button>
                                <button onClick={() => setIsSchoolKind(true)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSchoolKind ? 'bg-amber-400 text-black shadow-lg' : 'text-gray-400'}`}>École</button>
                             </div>
                             <form onSubmit={(e) => {
                                e.preventDefault();
                                const fd = new FormData(e.currentTarget);
                                const id = editingUni?.id || (isSchoolKind ? 'sch-' : 'uni-') + Date.now();
                                const data: University = {
                                  id,
                                  name: fd.get('name') as string,
                                  acronym: fd.get('acronym') as string,
                                  location: fd.get('location') as string,
                                  type: fd.get('type') as any,
                                  description: fd.get('description') as string,
                                  isStandaloneSchool: isSchoolKind,
                                  logo: editingUni?.logo || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=100',
                                  cover: editingUni?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
                                  stats: editingUni?.stats || { students: '0', majors: 0, founded: '2024', ranking: 'N/A' },
                                  faculties: editingUni?.faculties || []
                                };
                                if (editingUni) updateUniversity(data);
                                else addUniversity(data);
                                setCurrentCreationId(id);
                                if (!isSchoolKind) setCreationStep('faculties');
                                else setCreationStep('majors');
                             }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                  <label className="text-[10px] font-black uppercase text-gray-400">Nom complet</label>
                                  <input name="name" required defaultValue={editingUni?.name} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white font-bold" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-gray-400">Acronyme</label>
                                  <input name="acronym" required defaultValue={editingUni?.acronym} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white font-bold" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-gray-400">Statut</label>
                                  <select name="type" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white font-bold">
                                     <option value="Public">Public</option>
                                     <option value="Privé">Privé</option>
                                  </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                  <label className="text-[10px] font-black uppercase text-gray-400">Ville principale</label>
                                  <input name="location" required defaultValue={editingUni?.location} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white font-bold" />
                                </div>
                                <div className="md:col-span-2 pt-6">
                                   <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                                      Continuer vers l'étape suivante
                                   </button>
                                </div>
                             </form>
                          </div>
                        )}

                        {creationStep === 'faculties' && (
                          <div className="space-y-8 animate-in slide-in-from-right-4 text-center">
                             <div className="space-y-2">
                                <h4 className="text-2xl font-black dark:text-white tracking-tight">Ajouter des Facultés ou Écoles rattachées</h4>
                                <p className="text-gray-400 font-medium text-sm">Définissez les entités qui composent cette université.</p>
                             </div>
                             
                             {/* Formulaire simplifié pour ajouter une faculté */}
                             <form onSubmit={(e) => {
                               e.preventDefault();
                               const fd = new FormData(e.currentTarget);
                               const newFac: Faculty = {
                                 id: 'fac-' + Date.now(),
                                 name: fd.get('facName') as string,
                                 description: fd.get('facDesc') as string,
                                 levels: ['Licence', 'Master'],
                                 type: fd.get('facType') as any
                               };
                               const targetUni = universities.find(u => u.id === currentCreationId);
                               if (targetUni) {
                                  updateUniversity({ ...targetUni, faculties: [...targetUni.faculties, newFac] });
                                  e.currentTarget.reset();
                               }
                             }} className="bg-gray-50 dark:bg-white/5 p-6 rounded-[32px] space-y-4 border border-gray-100 dark:border-white/10">
                                <input name="facName" placeholder="Nom de la faculté / école (ex: EPAC)" required className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border-none dark:text-white text-sm font-bold shadow-sm" />
                                <div className="flex flex-col sm:flex-row gap-4">
                                   <select name="facType" className="flex-1 p-4 rounded-xl bg-white dark:bg-surface-dark border-none dark:text-white text-sm font-bold shadow-sm">
                                      <option value="Ecole">École</option>
                                      <option value="Faculté">Faculté</option>
                                      <option value="Institut">Institut</option>
                                   </select>
                                   <button type="submit" className="px-10 py-4 bg-primary text-black font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg">+ Ajouter</button>
                                </div>
                             </form>

                             <div className="max-h-40 overflow-y-auto space-y-2">
                                {universities.find(u => u.id === currentCreationId)?.faculties.map(f => (
                                  <div key={f.id} className="p-4 bg-white dark:bg-white/5 rounded-2xl flex justify-between items-center text-left border border-gray-50 dark:border-white/10">
                                     <span className="font-black text-sm dark:text-white">{f.name}</span>
                                     <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">{f.type}</span>
                                  </div>
                                ))}
                             </div>

                             <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button onClick={() => setCreationStep('institution')} className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest border border-gray-100 dark:border-white/10 rounded-2xl">Retour</button>
                                <button onClick={() => setCreationStep('majors')} className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20">Configurer les filières</button>
                             </div>
                          </div>
                        )}

                        {creationStep === 'majors' && (
                          <div className="space-y-8 animate-in slide-in-from-right-4">
                             <div className="text-center space-y-2">
                                <h4 className="text-2xl font-black dark:text-white tracking-tight">Ajouter des Filières</h4>
                                <p className="text-gray-400 font-medium text-sm">Configurez les formations, débouchés et diplômes requis.</p>
                             </div>

                             <form onSubmit={(e) => {
                                e.preventDefault();
                                const fd = new FormData(e.currentTarget);
                                const prospect: CareerProspect = { title: fd.get('prospect') as string, icon: 'work' };
                                const diploma: RequiredDiploma = { name: fd.get('diploma') as string, icon: 'school' };
                                
                                const uni = universities.find(u => u.id === currentCreationId);
                                const majorData: Major = {
                                  id: 'maj-' + Date.now(),
                                  name: fd.get('mName') as string,
                                  universityId: currentCreationId || '',
                                  universityName: uni?.name || '',
                                  facultyName: fd.get('fName') as string,
                                  domain: fd.get('domain') as string,
                                  level: fd.get('level') as any,
                                  duration: fd.get('duration') as string,
                                  fees: fd.get('fees') as string,
                                  location: uni?.location || '',
                                  image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
                                  careerProspects: [prospect],
                                  requiredDiplomas: [diploma]
                                };
                                addMajor(majorData);
                                setShowUniForm(false);
                             }} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   <input name="mName" placeholder="Nom de la filière" required className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white text-sm font-bold" />
                                   <select name="fName" className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white text-sm font-bold">
                                      {universities.find(u => u.id === currentCreationId)?.faculties.map(f => (
                                        <option key={f.id} value={f.name}>{f.name}</option>
                                      ))}
                                      {isSchoolKind && <option value="Principal">Principal</option>}
                                   </select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   <input name="prospect" placeholder="Débouché principal (ex: Développeur)" required className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white text-sm font-bold" />
                                   <input name="diploma" placeholder="Diplôme requis (ex: BAC C / D)" required className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white text-sm font-bold" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                   <input name="level" placeholder="Niveau" defaultValue="Licence" className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white text-sm font-bold" />
                                   <input name="duration" placeholder="Durée" defaultValue="3 Ans" className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white text-sm font-bold" />
                                   <input name="fees" placeholder="Frais" defaultValue="450.000 FCFA" className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white text-sm font-bold" />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                   <button type="button" onClick={() => setShowUniForm(false)} className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest border border-gray-100 dark:border-white/10 rounded-2xl">Terminer plus tard</button>
                                   <button type="submit" className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20">Sauvegarder et Finir</button>
                                </div>
                             </form>
                          </div>
                        )}
                     </div>
                   </div>
                 </div>
               )}

               {/* Regular Major Form (Legacy standalone mode) */}
               {showMajorForm && !showUniForm && (
                 <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
                   <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[48px] shadow-2xl p-10 md:p-12 space-y-8 my-auto">
                     <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-black dark:text-white">{editingMajor ? 'Modifier' : 'Ajouter'} une Filière</h3>
                       <button onClick={() => setShowMajorForm(false)} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                     </div>
                     <form onSubmit={(e) => {
                       e.preventDefault();
                       const fd = new FormData(e.currentTarget);
                       const uni = universities.find(u => u.id === fd.get('universityId'));
                       const data: Major = {
                         id: editingMajor?.id || 'maj-' + Date.now(),
                         name: fd.get('name') as string,
                         universityId: fd.get('universityId') as string,
                         universityName: uni?.name || '',
                         facultyName: fd.get('facultyName') as string,
                         domain: fd.get('domain') as string,
                         level: fd.get('level') as any,
                         duration: fd.get('duration') as string,
                         fees: fd.get('fees') as string,
                         location: uni?.location || '',
                         image: editingMajor?.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
                       };
                       if (editingMajor) updateMajor(data);
                       else addMajor(data);
                       setShowMajorForm(false);
                     }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black uppercase text-gray-400">Établissement</label>
                           <select name="universityId" required defaultValue={editingMajor?.universityId} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white font-bold">
                              {universities.map(u => <option key={u.id} value={u.id}>{u.acronym} - {u.name}</option>)}
                           </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black uppercase text-gray-400">Nom de la filière</label>
                           <input name="name" required defaultValue={editingMajor?.name} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-gray-400">Frais annuels</label>
                           <input name="fees" required defaultValue={editingMajor?.fees} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-gray-400">Durée</label>
                           <input name="duration" required defaultValue={editingMajor?.duration} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none dark:text-white font-bold" />
                        </div>
                        <div className="md:col-span-2 pt-6">
                           <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl">Sauvegarder</button>
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
                  <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-8">
                     <div className="flex items-center gap-4 border-b border-gray-50 dark:border-white/5 pb-6">
                        <span className="material-symbols-outlined text-primary font-bold">palette</span>
                        <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-[11px]">Apparence & Thème</h3>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {themes.map(t => (
                          <button key={t.id} onClick={() => applyTheme(t.id)} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${t.isActive ? 'border-primary bg-primary/5' : 'border-gray-50 dark:border-white/5'}`}>
                             <div className="size-10 rounded-xl shadow-inner" style={{ backgroundColor: t.primary }}></div>
                             <span className="font-black text-[10px] uppercase tracking-widest dark:text-white">{t.name}</span>
                             {t.isActive && <span className="material-symbols-outlined text-primary text-sm font-bold">check_circle</span>}
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-8">
                     <div className="flex items-center gap-4 border-b border-gray-50 dark:border-white/5 pb-6">
                        <span className="material-symbols-outlined text-primary font-bold">translate</span>
                        <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-[11px]">Langues de la plateforme</h3>
                     </div>
                     <div className="flex flex-wrap gap-4">
                        {languages.map(l => (
                          <button key={l.code} onClick={() => toggleLanguage(l.code)} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${l.isActive ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                            {l.label}
                          </button>
                        ))}
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
               <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[48px] border border-gray-100 dark:border-white/10 space-y-8">
                  {Object.keys(content).map(key => (
                    <div key={key} className="space-y-4 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                       <h4 className="font-black text-primary uppercase text-[10px] tracking-widest">ID: {key}</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {languages.filter(l => l.isActive).map(l => (
                            <div key={l.code} className="space-y-1">
                               <label className="text-[9px] font-bold text-gray-400 uppercase">{l.label}</label>
                               <textarea value={content[key][l.code]} onChange={(e) => updateContent(key, l.code, e.target.value)} className="w-full p-4 rounded-xl border-none font-bold text-sm bg-white dark:bg-surface-dark resize-none" />
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
