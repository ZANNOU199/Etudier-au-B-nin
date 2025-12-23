
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { University, Major, Application, Faculty, CareerProspect, RequiredDiploma } from '../types';

type AdminView = 'overview' | 'applications' | 'catalog' | 'cms' | 'settings';
type CatalogSection = 'universities' | 'majors';
type EstablishmentFilter = 'all' | 'university' | 'school';
type CreationStep = 'institution' | 'faculties' | 'majors';

const ITEMS_PER_PAGE = 4;

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
  
  // Pagination States
  const [uniPage, setUniPage] = useState(1);
  const [majorPage, setMajorPage] = useState(1);
  
  // Creation Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<CreationStep>('institution');
  const [currentInstId, setCurrentInstId] = useState<string | null>(null);
  const [isSchoolKind, setIsSchoolKind] = useState(false);

  // Standalone Major Creation
  const [showStandaloneMajorForm, setShowStandaloneMajorForm] = useState(false);

  const navigate = useNavigate();

  // KPI Data for Overview
  const kpis = [
    { label: 'Candidatures', val: applications.length.toString(), icon: 'description', color: 'bg-primary/10 text-primary' },
    { label: 'Établissements', val: universities.length.toString(), icon: 'account_balance', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Filières', val: majors.length.toString(), icon: 'library_books', color: 'bg-purple-500/10 text-purple-500' },
    { label: 'Activité', val: '89%', icon: 'trending_up', color: 'bg-amber-500/10 text-amber-500' }
  ];

  // Filters & Pagination Logic
  const filteredUnis = useMemo(() => {
    return universities.filter(u => {
      if (establishmentFilter === 'university') return !u.isStandaloneSchool;
      if (establishmentFilter === 'school') return u.isStandaloneSchool;
      return true;
    });
  }, [universities, establishmentFilter]);

  const totalUniPages = Math.ceil(filteredUnis.length / ITEMS_PER_PAGE);
  const pagedUnis = filteredUnis.slice((uniPage - 1) * ITEMS_PER_PAGE, uniPage * ITEMS_PER_PAGE);

  const totalMajorPages = Math.ceil(majors.length / ITEMS_PER_PAGE);
  const pagedMajors = majors.slice((majorPage - 1) * ITEMS_PER_PAGE, majorPage * ITEMS_PER_PAGE);

  const currentUni = useMemo(() => universities.find(u => u.id === currentInstId), [universities, currentInstId]);
  const currentInstMajors = useMemo(() => majors.filter(m => m.universityId === currentInstId), [majors, currentInstId]);

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

      <div className="pt-10 border-t border-white/5">
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
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
          {/* VIEW: OVERVIEW */}
          {activeView === 'overview' && (
            <div className="space-y-10 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                  <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm group">
                    <div className={`size-12 rounded-xl flex items-center justify-center ${kpi.color} mb-6`}>
                      <span className="material-symbols-outlined font-bold text-2xl">{kpi.icon}</span>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                    <p className="text-3xl font-black dark:text-white tracking-tighter">{kpi.val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0d1b13] p-10 rounded-[40px] text-white flex items-center justify-between relative overflow-hidden">
                 <div className="space-y-4 relative z-10">
                    <h2 className="text-4xl font-black tracking-tight leading-none">Console de Contrôle <br/><span className="text-primary italic">EDEN Communication</span></h2>
                    <p className="text-gray-400 font-medium max-w-lg">Gérez l'ensemble des établissements, filières et candidatures depuis cette interface sécurisée.</p>
                 </div>
                 <span className="material-symbols-outlined text-[120px] opacity-10 absolute -right-10 top-0">security</span>
              </div>
            </div>
          )}

          {/* VIEW: APPLICATIONS */}
          {activeView === 'applications' && (
            <div className="space-y-8 animate-fade-in">
               <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Flux de Candidatures</h2>
               <div className="grid grid-cols-1 gap-4">
                  {applications.map(app => (
                    <div key={app.id} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-lg transition-all">
                       <div className="flex items-center gap-6 flex-1 w-full">
                          <div className="size-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                             <span className="material-symbols-outlined text-2xl">description</span>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-primary uppercase tracking-widest">{app.id}</p>
                             <h4 className="text-lg font-black dark:text-white leading-tight">{app.studentName}</h4>
                             <p className="text-xs font-bold text-gray-500">{app.majorName} • {app.universityName}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 w-full md:w-auto">
                          <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 ${
                             app.status === 'Validé' ? 'text-primary bg-primary/10' : 
                             app.status === 'Rejeté' ? 'text-red-500 bg-red-500/10' : 'text-amber-500 bg-amber-500/10'
                          }`}>
                             {app.status}
                          </span>
                          <button onClick={() => setSelectedApp(app)} className="size-11 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center transition-all"><span className="material-symbols-outlined">visibility</span></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* VIEW: CATALOG (REFACTORED) */}
          {activeView === 'catalog' && (
            <div className="space-y-8 animate-fade-in">
               <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  <div className="flex gap-2 p-1 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/10">
                    <button onClick={() => setActiveCatalogSection('universities')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'universities' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Universités & Écoles</button>
                    <button onClick={() => setActiveCatalogSection('majors')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'majors' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Filières</button>
                  </div>
                  {activeCatalogSection === 'universities' && (
                    <div className="flex gap-2 bg-white dark:bg-surface-dark p-1 rounded-xl border border-gray-100 dark:border-white/10">
                       {['all', 'university', 'school'].map(f => (
                         <button key={f} onClick={() => { setEstablishmentFilter(f as EstablishmentFilter); setUniPage(1); }} className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${establishmentFilter === f ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm' : 'text-gray-400 hover:text-primary'}`}>
                           {f === 'all' ? 'Tout' : f === 'university' ? 'Universités' : 'Écoles'}
                         </button>
                       ))}
                    </div>
                  )}
               </div>

               {activeCatalogSection === 'universities' && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pagedUnis.map(uni => (
                        <div key={uni.id} className="bg-white dark:bg-surface-dark p-6 rounded-[40px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-xl transition-all h-full">
                           <div className="flex items-center gap-6 flex-1 w-full">
                              <div className="size-20 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center p-3 border border-gray-100 dark:border-white/10 relative">
                                 <img src={uni.logo} className="max-w-full max-h-full object-contain" alt="" />
                                 <span className={`absolute -top-3 -right-3 size-7 rounded-full flex items-center justify-center text-[11px] font-black shadow-lg ${uni.isStandaloneSchool ? 'bg-amber-400 text-black' : 'bg-primary text-black'}`}>
                                    {uni.isStandaloneSchool ? 'E' : 'U'}
                                 </span>
                              </div>
                              <div className="space-y-1 flex-1">
                                 <h3 className="text-2xl font-black dark:text-white tracking-tighter leading-none">{uni.acronym}</h3>
                                 <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{uni.location}</p>
                                 <p className="text-sm font-black dark:text-white line-clamp-1">{uni.name}</p>
                                 <div className="flex gap-4 pt-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{uni.type}</span>
                                    <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{uni.faculties.length} Entités</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-3 w-full md:w-auto md:border-l md:pl-8 border-gray-100 dark:border-white/10">
                              <button className="size-11 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center transition-all"><span className="material-symbols-outlined">edit</span></button>
                              <button onClick={() => deleteUniversity(uni.id)} className="size-11 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all"><span className="material-symbols-outlined">delete</span></button>
                           </div>
                        </div>
                      ))}
                      <button onClick={() => { setShowWizard(true); setWizardStep('institution'); setCurrentInstId(null); }} className="min-h-[140px] flex items-center justify-center gap-6 rounded-[40px] border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all group">
                        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl font-bold">add</span>
                        </div>
                        <span className="font-black uppercase text-[11px] tracking-[0.3em] text-primary">Nouveau établissement</span>
                      </button>
                    </div>
                    {totalUniPages > 1 && (
                      <div className="flex justify-center items-center gap-3 pt-8">
                        <button onClick={() => setUniPage(p => Math.max(1, p - 1))} disabled={uniPage === 1} className="size-14 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center disabled:opacity-30 hover:border-primary transition-all text-gray-400"><span className="material-symbols-outlined font-black">west</span></button>
                        <div className="flex gap-2">
                           {Array.from({ length: totalUniPages }).map((_, i) => (
                             <button key={i} onClick={() => setUniPage(i + 1)} className={`size-14 rounded-2xl font-black text-xs transition-all border ${uniPage === i + 1 ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 dark:text-white'}`}>{i + 1}</button>
                           ))}
                        </div>
                        <button onClick={() => setUniPage(p => Math.min(totalUniPages, p + 1))} disabled={uniPage === totalUniPages} className="size-14 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center disabled:opacity-30 hover:border-primary transition-all text-gray-400"><span className="material-symbols-outlined font-black">east</span></button>
                      </div>
                    )}
                  </div>
               )}

               {activeCatalogSection === 'majors' && (
                  <div className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pagedMajors.map(major => (
                           <div key={major.id} className="bg-white dark:bg-surface-dark p-6 rounded-[40px] border border-gray-100 dark:border-white/5 flex flex-col justify-between group hover:shadow-xl transition-all h-full">
                              <div className="flex justify-between items-start mb-6">
                                 <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase tracking-widest">{major.level.charAt(0)}</div>
                                    <div className="space-y-1">
                                       <h3 className="text-xl font-black dark:text-white tracking-tight leading-none">{major.name}</h3>
                                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{major.universityName} • {major.facultyName}</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="size-9 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                    <button onClick={() => deleteMajor(major.id)} className="size-9 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50 dark:border-white/10">
                                 <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Frais annuels</p>
                                    <p className="text-sm font-black text-primary">{major.fees}</p>
                                 </div>
                                 <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Durée cycle</p>
                                    <p className="text-sm font-black dark:text-white">{major.duration}</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                        <button onClick={() => setShowStandaloneMajorForm(true)} className="min-h-[140px] flex items-center justify-center gap-6 rounded-[40px] border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all group">
                           <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined text-3xl font-bold">add_circle</span>
                           </div>
                           <span className="font-black uppercase text-[11px] tracking-[0.3em] text-primary">Nouvelle filière</span>
                        </button>
                     </div>
                     {totalMajorPages > 1 && (
                        <div className="flex justify-center items-center gap-3 pt-8">
                           <button onClick={() => setMajorPage(p => Math.max(1, p - 1))} disabled={majorPage === 1} className="size-14 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center disabled:opacity-30 hover:border-primary transition-all text-gray-400"><span className="material-symbols-outlined font-black">west</span></button>
                           <div className="flex gap-2">
                              {Array.from({ length: totalMajorPages }).map((_, i) => (
                                 <button key={i} onClick={() => setMajorPage(i + 1)} className={`size-14 rounded-2xl font-black text-xs transition-all border ${majorPage === i + 1 ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 dark:text-white'}`}>{i + 1}</button>
                              ))}
                           </div>
                           <button onClick={() => setMajorPage(p => Math.min(totalMajorPages, p + 1))} disabled={majorPage === totalMajorPages} className="size-14 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center disabled:opacity-30 hover:border-primary transition-all text-gray-400"><span className="material-symbols-outlined font-black">east</span></button>
                        </div>
                     )}
                  </div>
               )}
            </div>
          )}

          {/* VIEW: CMS */}
          {activeView === 'cms' && (
            <div className="space-y-8 animate-fade-in">
               <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Gestionnaire de Contenu</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 space-y-6">
                     <h3 className="text-xl font-black dark:text-white">Traductions & Langues</h3>
                     <div className="space-y-4">
                        {languages.map(lang => (
                           <div key={lang.code} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                              <span className="font-black dark:text-white">{lang.label} ({lang.code.toUpperCase()})</span>
                              <button onClick={() => toggleLanguage(lang.code)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang.isActive ? 'bg-primary text-black' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                                 {lang.isActive ? 'Active' : 'Inactive'}
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 space-y-6">
                     <h3 className="text-xl font-black dark:text-white">Identité Visuelle</h3>
                     <div className="space-y-4">
                        {themes.map(theme => (
                           <button key={theme.id} onClick={() => applyTheme(theme.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${theme.isActive ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5'}`}>
                              <span className="font-black dark:text-white">{theme.name}</span>
                              <div className="size-6 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeView === 'settings' && (
            <div className="space-y-8 animate-fade-in">
               <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Paramètres Système</h2>
               <div className="bg-white dark:bg-surface-dark p-10 rounded-[48px] border border-gray-100 dark:border-white/5 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Maintenance du Site</label>
                        <div className="flex items-center gap-4">
                           <div className="size-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center"><span className="material-symbols-outlined">construction</span></div>
                           <div className="flex-1">
                              <h4 className="font-black dark:text-white">Mode Maintenance</h4>
                              <p className="text-xs text-gray-400">Restreindre l'accès au site public.</p>
                           </div>
                           <button className="size-12 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10"></button>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sauvegarde des données</label>
                        <button className="w-full py-4 bg-gray-50 dark:bg-white/5 text-gray-500 font-black rounded-2xl border border-gray-200 dark:border-white/10 uppercase tracking-widest text-[10px] hover:bg-primary hover:text-black transition-all">Exporter la base de données (JSON)</button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* MODAL: WIZARD DE CRÉATION GUIDÉ */}
        {showWizard && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-300">
                <div className="bg-gray-50 dark:bg-white/5 px-10 py-8 flex items-center justify-between border-b border-gray-100 dark:border-white/10">
                   <div>
                      <h3 className="text-2xl font-black dark:text-white tracking-tight leading-none">Assistant de Création</h3>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="material-symbols-outlined text-primary text-sm font-bold">{wizardStep === 'institution' ? 'account_balance' : wizardStep === 'faculties' ? 'domain' : 'school'}</span>
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest">{wizardStep === 'institution' ? 'Établissement' : wizardStep === 'faculties' ? 'Composantes' : 'Offre Académique'}</p>
                      </div>
                   </div>
                   <button onClick={() => setShowWizard(false)} className="size-11 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="p-8 md:p-12 space-y-10">
                   {wizardStep === 'institution' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4">
                        <div className="flex gap-4 p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                           <button onClick={() => setIsSchoolKind(false)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isSchoolKind ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400'}`}>Université</button>
                           <button onClick={() => setIsSchoolKind(true)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSchoolKind ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'text-gray-400'}`}>École / Institut</button>
                        </div>
                        <form onSubmit={(e) => {
                           e.preventDefault();
                           const fd = new FormData(e.currentTarget);
                           const id = (isSchoolKind ? 'sch-' : 'uni-') + Date.now();
                           const data: University = {
                              id,
                              name: fd.get('name') as string,
                              acronym: fd.get('acronym') as string,
                              location: fd.get('location') as string,
                              type: fd.get('type') as any,
                              description: fd.get('desc') as string || 'Établissement académique supérieur.',
                              isStandaloneSchool: isSchoolKind,
                              logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=100',
                              cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
                              stats: { students: '0', majors: 0, founded: '2024', ranking: 'N/A' },
                              faculties: []
                           };
                           addUniversity(data);
                           setCurrentInstId(id);
                           setWizardStep(!isSchoolKind ? 'faculties' : 'majors');
                        }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nom Complet</label>
                              <input name="name" required className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold dark:text-white" placeholder="Ex: Université d'Abomey-Calavi" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sigle</label>
                              <input name="acronym" required className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold dark:text-white" placeholder="Ex: UAC" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Ville</label>
                              <input name="location" required className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold dark:text-white" placeholder="Ex: Cotonou" />
                           </div>
                           <div className="md:col-span-2 pt-6"><button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">Continuer</button></div>
                        </form>
                     </div>
                   )}
                   {wizardStep === 'faculties' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4">
                        <div className="text-center space-y-2">
                           <h4 className="text-2xl font-black dark:text-white tracking-tight leading-none">Écoles & Facultés rattachées</h4>
                           <p className="text-gray-400 font-medium text-sm">Ajoutez toutes les composantes de cette université.</p>
                        </div>
                        <form onSubmit={(e) => {
                           e.preventDefault();
                           const fd = new FormData(e.currentTarget);
                           const newFac: Faculty = { id: 'fac-' + Date.now(), name: fd.get('fName') as string, description: 'Formation spécialisée', levels: ['Licence', 'Master'], type: fd.get('fType') as any };
                           if (currentUni) { updateUniversity({ ...currentUni, faculties: [...currentUni.faculties, newFac] }); e.currentTarget.reset(); }
                        }} className="p-6 bg-gray-50 dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/10 space-y-4">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <input name="fName" required placeholder="Nom (ex: ENEAM, EPAC...)" className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border-none font-bold text-sm dark:text-white" />
                              <select name="fType" className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border-none font-bold text-sm dark:text-white">
                                 <option value="Ecole">École</option><option value="Faculté">Faculté</option><option value="Institut">Institut</option>
                              </select>
                           </div>
                           <button type="submit" className="w-full py-3 bg-white dark:bg-white/10 text-primary border border-primary/20 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all">+ Ajouter une autre entité</button>
                        </form>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                           {currentUni?.faculties.map(f => (
                              <div key={f.id} className="p-4 bg-white dark:bg-white/5 rounded-2xl flex justify-between items-center border border-gray-50 dark:border-white/10 animate-fade-in">
                                 <div><p className="font-black text-sm dark:text-white leading-none">{f.name}</p><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{f.type}</p></div>
                                 <span className="material-symbols-outlined text-gray-300 text-lg">check_circle</span>
                              </div>
                           ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-white/10">
                           <button onClick={() => setWizardStep('institution')} className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest border border-gray-100 dark:border-white/10 rounded-2xl">Retour</button>
                           <button onClick={() => setWizardStep('majors')} disabled={!currentUni?.faculties.length} className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all">Configurer les filières</button>
                        </div>
                     </div>
                   )}
                   {wizardStep === 'majors' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4">
                        <div className="text-center space-y-2"><h4 className="text-2xl font-black dark:text-white tracking-tight leading-none">Ajouter des Filières</h4><p className="text-gray-400 font-medium text-sm">Configurez l'offre académique de l'établissement.</p></div>
                        <form onSubmit={(e) => {
                           e.preventDefault();
                           const fd = new FormData(e.currentTarget);
                           const prospect: CareerProspect = { title: fd.get('career') as string, icon: 'work' };
                           const diploma: RequiredDiploma = { name: fd.get('diploma') as string, icon: 'school' };
                           const majorData: Major = {
                              id: 'maj-' + Date.now(), name: fd.get('mName') as string, universityId: currentInstId || '', universityName: currentUni?.name || '', facultyName: fd.get('fName') as string, domain: fd.get('domain') as string, level: fd.get('level') as any, duration: fd.get('duration') as string, fees: fd.get('fees') as string, location: currentUni?.location || '', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400', careerProspects: [prospect], requiredDiplomas: [diploma]
                           };
                           addMajor(majorData); e.currentTarget.reset();
                        }} className="space-y-4 p-6 bg-gray-50 dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/10">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <input name="mName" required placeholder="Nom de la filière" className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border-none font-bold text-sm dark:text-white" />
                              <select name="fName" className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border-none font-bold text-sm dark:text-white">
                                 {currentUni?.faculties.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                                 {isSchoolKind && <option value="Principal">Principal</option>}
                              </select>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <input name="career" required placeholder="Débouché principal" className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border-none font-bold text-sm dark:text-white" />
                              <input name="diploma" required placeholder="Diplôme requis (ex: BAC C / D)" className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border-none font-bold text-sm dark:text-white" />
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <select name="level" className="p-4 rounded-xl bg-white dark:bg-surface-dark border-none font-bold text-xs dark:text-white"><option value="Licence">Licence</option><option value="Master">Master</option><option value="Doctorat">Doctorat</option></select>
                              <input name="fees" required placeholder="Frais (ex: 450.000 FCFA)" className="p-4 rounded-xl bg-white dark:bg-surface-dark border-none font-bold text-xs dark:text-white" />
                              <input name="duration" required placeholder="Durée (ex: 3 Ans)" className="p-4 rounded-xl bg-white dark:bg-surface-dark border-none font-bold text-xs dark:text-white" />
                           </div>
                           <button type="submit" className="w-full py-3 bg-white dark:bg-white/10 text-primary border border-primary/20 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all">+ Enregistrer cette filière</button>
                        </form>
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-white/10">
                           <button onClick={() => setWizardStep('faculties')} className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest border border-gray-100 dark:border-white/10 rounded-2xl">Retour</button>
                           <button onClick={() => setShowWizard(false)} className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all">Terminer</button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* MODAL: FILIÈRE INDÉPENDANTE */}
        {showStandaloneMajorForm && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[48px] shadow-2xl p-8 md:p-12 space-y-10 my-auto animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center"><h3 className="text-3xl font-black dark:text-white tracking-tight">Ajouter une Filière</h3><button onClick={() => setShowStandaloneMajorForm(false)} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">close</span></button></div>
                <form onSubmit={(e) => {
                   e.preventDefault(); const fd = new FormData(e.currentTarget); const uni = universities.find(u => u.id === fd.get('uniId')); const majorData: Major = {
                      id: 'maj-' + Date.now(), name: fd.get('mName') as string, universityId: fd.get('uniId') as string, universityName: uni?.name || '', facultyName: fd.get('fName') as string, domain: 'Général', level: 'Licence', duration: fd.get('duration') as string, fees: fd.get('fees') as string, location: uni?.location || '', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400'
                   }; addMajor(majorData); setShowStandaloneMajorForm(false);
                }} className="space-y-6">
                   <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-2">Établissement</label><select name="uniId" required className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold text-sm dark:text-white">{universities.map(u => <option key={u.id} value={u.id}>{u.acronym} - {u.name}</option>)}</select></div>
                   <input name="mName" required placeholder="Nom de la filière" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold text-sm dark:text-white" />
                   <input name="fName" required placeholder="Faculté / Composante" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold text-sm dark:text-white" />
                   <div className="grid grid-cols-2 gap-4"><input name="fees" required placeholder="Frais" className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold text-xs dark:text-white" /><input name="duration" required placeholder="Durée" className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold text-xs dark:text-white" /></div>
                   <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">Enregistrer</button>
                </form>
             </div>
          </div>
        )}

        {/* MODAL: DOSSIER CANDIDATURE */}
        {selectedApp && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in" onClick={() => setSelectedApp(null)}>
             <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-10 space-y-8">
                   <div className="flex justify-between items-start">
                      <div><p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Dossier N° {selectedApp.id}</p><h3 className="text-3xl font-black dark:text-white tracking-tighter leading-none">{selectedApp.studentName}</h3><p className="text-gray-500 font-bold mt-2">Candidat pour : {selectedApp.majorName}</p></div>
                      <button onClick={() => setSelectedApp(null)} className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">close</span></button>
                   </div>
                   <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-white/10">
                      <button onClick={() => { updateApplicationStatus(selectedApp.id, 'Validé'); setSelectedApp(null); }} className="flex-1 min-w-[140px] py-4 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">Valider</button>
                      <button onClick={() => { updateApplicationStatus(selectedApp.id, 'Rejeté'); setSelectedApp(null); }} className="flex-1 min-w-[140px] py-4 bg-red-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl">Rejeter</button>
                      <button onClick={() => setSelectedApp(null)} className="flex-1 min-w-[140px] py-4 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 font-black rounded-2xl text-[10px] uppercase tracking-widest">Fermer</button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
