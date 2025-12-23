
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { University, Major, Application, Faculty, CareerProspect, RequiredDiploma } from '../types';

type AdminView = 'overview' | 'applications' | 'catalog' | 'cms' | 'settings';
type CatalogSection = 'universities' | 'majors';
type EstablishmentFilter = 'all' | 'university' | 'school';
type CreationStep = 'institution' | 'faculties' | 'majors';

const UNI_PER_PAGE = 4;
const MAJOR_PER_PAGE = 3;

const AdminDashboard: React.FC = () => {
  const { 
    applications, updateApplicationStatus, deleteApplication,
    universities, addUniversity, updateUniversity, deleteUniversity,
    majors, addMajor, updateMajor, deleteMajor, logout, user,
    languages, toggleLanguage, themes, applyTheme
  } = useCMS();
  
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [activeCatalogSection, setActiveCatalogSection] = useState<CatalogSection>('universities');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  // LOGIQUE CATALOGUE EXCLUSIVE
  const [establishmentFilter, setEstablishmentFilter] = useState<EstablishmentFilter>('all');
  const [uniPage, setUniPage] = useState(1);
  const [majorPage, setMajorPage] = useState(1);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<CreationStep>('institution');
  const [currentInstId, setCurrentInstId] = useState<string | null>(null);
  const [isSchoolKind, setIsSchoolKind] = useState(false);

  const navigate = useNavigate();

  // Filtrage Etablissements
  const filteredUnis = useMemo(() => {
    return universities.filter(u => {
      if (establishmentFilter === 'university') return !u.isStandaloneSchool;
      if (establishmentFilter === 'school') return u.isStandaloneSchool;
      return true;
    });
  }, [universities, establishmentFilter]);

  // Pagination Etablissements (4 par page)
  const totalUniPages = Math.ceil(filteredUnis.length / UNI_PER_PAGE);
  const pagedUnis = filteredUnis.slice((uniPage - 1) * UNI_PER_PAGE, uniPage * UNI_PER_PAGE);

  // Pagination Filières (3 par page)
  const totalMajorPages = Math.ceil(majors.length / MAJOR_PER_PAGE);
  const pagedMajors = majors.slice((majorPage - 1) * MAJOR_PER_PAGE, majorPage * MAJOR_PER_PAGE);

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
          
          {/* CATALOGUE ACADÉMIQUE (REFACTORED) */}
          {activeView === 'catalog' && (
            <div className="space-y-8 animate-fade-in">
               
               {/* Filtrage Dynamique & Navigation Catalogue */}
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

               {/* Section Universités & Écoles (Style Sombre Spécifique) */}
               {activeCatalogSection === 'universities' && (
                  <div className="bg-[#0d1b13] p-8 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pagedUnis.map(uni => (
                        <div key={uni.id} className="bg-white/5 p-6 rounded-[40px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/10 transition-all h-full">
                           <div className="flex items-center gap-6 flex-1 w-full">
                              <div className="size-20 rounded-2xl bg-white/5 flex items-center justify-center p-3 border border-white/10 relative shadow-inner">
                                 <img src={uni.logo} className="max-w-full max-h-full object-contain" alt="" />
                                 {/* Badge U/E */}
                                 <span className={`absolute -top-3 -right-3 size-8 rounded-full flex items-center justify-center text-[12px] font-black shadow-lg ${uni.isStandaloneSchool ? 'bg-amber-400 text-black' : 'bg-primary text-black'}`}>
                                    {uni.isStandaloneSchool ? 'E' : 'U'}
                                 </span>
                              </div>
                              <div className="space-y-1 flex-1">
                                 <h3 className="text-2xl font-black text-white tracking-tighter leading-none">{uni.acronym}</h3>
                                 <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{uni.location}</p>
                                 <p className="text-sm font-black text-gray-400 line-clamp-1">{uni.name}</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <button onClick={() => deleteUniversity(uni.id)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all border border-white/5"><span className="material-symbols-outlined">delete</span></button>
                           </div>
                        </div>
                      ))}
                      
                      {/* Bouton Wizard */}
                      <button onClick={() => { setShowWizard(true); setWizardStep('institution'); setCurrentInstId(null); }} className="min-h-[140px] flex items-center justify-center gap-6 rounded-[40px] border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all group">
                        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl font-bold">add</span>
                        </div>
                        <span className="font-black uppercase text-[11px] tracking-[0.3em] text-primary">Ajouter un établissement</span>
                      </button>
                    </div>

                    {/* Pagination Etablissements (4/page) */}
                    {totalUniPages > 1 && (
                      <div className="flex justify-center items-center gap-3 pt-6 border-t border-white/5">
                        <div className="flex gap-2">
                           {Array.from({ length: totalUniPages }).map((_, i) => (
                             <button key={i} onClick={() => setUniPage(i + 1)} className={`size-14 rounded-2xl font-black text-xs transition-all border ${uniPage === i + 1 ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-white hover:border-primary'}`}>{i + 1}</button>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
               )}

               {/* Section Filières (Style Sombre Spécifique) */}
               {activeCatalogSection === 'majors' && (
                  <div className="bg-[#0d1b13] p-8 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pagedMajors.map(major => (
                           <div key={major.id} className="bg-white/5 p-6 rounded-[40px] border border-white/5 flex flex-col justify-between group hover:bg-white/10 transition-all h-full">
                              <div className="space-y-4">
                                 <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase">{major.level.charAt(0)}</div>
                                    <div className="space-y-1">
                                       <h3 className="text-lg font-black text-white tracking-tight leading-none">{major.name}</h3>
                                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{major.universityName}</p>
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
                                    <div>
                                       <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Coûts</p>
                                       <p className="text-xs font-black text-primary">{major.fees}</p>
                                    </div>
                                    <div>
                                       <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Durée</p>
                                       <p className="text-xs font-black text-white">{major.duration}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex justify-end pt-6">
                                 <button onClick={() => deleteMajor(major.id)} className="text-gray-500 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Pagination Filières (3/page) */}
                     {totalMajorPages > 1 && (
                        <div className="flex justify-center items-center gap-3 pt-6 border-t border-white/5">
                           <div className="flex gap-2">
                              {Array.from({ length: totalMajorPages }).map((_, i) => (
                                 <button key={i} onClick={() => setMajorPage(i + 1)} className={`size-14 rounded-2xl font-black text-xs transition-all border ${majorPage === i + 1 ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white'}`}>{i + 1}</button>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
          )}

          {/* Vues Classiques Admin (Intactes) */}
          {activeView === 'overview' && (
            <div className="space-y-10 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: 'Candidatures', val: applications.length.toString(), icon: 'description', color: 'bg-primary/10 text-primary' },
                  { label: 'Établissements', val: universities.length.toString(), icon: 'account_balance', color: 'bg-blue-500/10 text-blue-500' },
                  { label: 'Filières', val: majors.length.toString(), icon: 'library_books', color: 'bg-purple-500/10 text-purple-500' },
                  { label: 'Activité', val: '89%', icon: 'trending_up', color: 'bg-amber-500/10 text-amber-500' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
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
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeView === 'cms' && (
            <div className="space-y-8 animate-fade-in">
               <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Gestion CMS</h2>
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
               </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="space-y-8 animate-fade-in">
               <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Paramètres Système</h2>
               <div className="bg-white dark:bg-surface-dark p-10 rounded-[48px] border border-gray-100 dark:border-white/5 space-y-10">
                  <button className="w-full py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all">Sauvegarder les préférences</button>
               </div>
            </div>
          )}
        </div>

        {/* 🧩 WIZARD DE CRÉATION GUIDÉ (Catalogue Uniquement) */}
        {showWizard && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-300 border border-white/5">
                <div className="bg-white/5 px-10 py-8 flex items-center justify-between border-b border-white/5">
                   <div>
                      <h3 className="text-2xl font-black text-white tracking-tight leading-none">Nouvel Établissement</h3>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="material-symbols-outlined text-primary text-sm font-bold">{wizardStep === 'institution' ? 'account_balance' : wizardStep === 'faculties' ? 'domain' : 'school'}</span>
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest">{wizardStep === 'institution' ? 'Étape 1 : Identité' : wizardStep === 'faculties' ? 'Étape 2 : Composantes' : 'Étape 3 : Filières'}</p>
                      </div>
                   </div>
                   <button onClick={() => setShowWizard(false)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                   
                   {/* 🟢 ÉTAPE 1 : IDENTITÉ */}
                   {wizardStep === 'institution' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white">
                        <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                           <button onClick={() => setIsSchoolKind(false)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isSchoolKind ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-500'}`}>Université</button>
                           <button onClick={() => setIsSchoolKind(true)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSchoolKind ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'text-gray-500'}`}>École / Institut</button>
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
                              description: 'Nouveau pôle académique.',
                              isStandaloneSchool: isSchoolKind,
                              logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100',
                              cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
                              stats: { students: '0', majors: 0, founded: '2024', ranking: 'N/A' },
                              faculties: []
                           };
                           addUniversity(data);
                           setCurrentInstId(id);
                           setWizardStep(!isSchoolKind ? 'faculties' : 'majors');
                        }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Nom Complet</label>
                              <input name="name" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Sigle</label>
                              <input name="acronym" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Ville</label>
                              <input name="location" required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           </div>
                           <div className="md:col-span-2 pt-6">
                              <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">Continuer</button>
                           </div>
                        </form>
                     </div>
                   )}

                   {/* 🟡 ÉTAPE 2 : COMPOSANTES (Si Uni) */}
                   {wizardStep === 'faculties' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white">
                        <div className="text-center space-y-2">
                           <h4 className="text-2xl font-black text-white tracking-tight">Composantes internes</h4>
                           <p className="text-gray-500 font-medium text-sm">Ajoutez les écoles ou facultés rattachées.</p>
                        </div>
                        <form onSubmit={(e) => {
                           e.preventDefault();
                           const fd = new FormData(e.currentTarget);
                           const newFac: Faculty = {
                              id: 'fac-' + Date.now(),
                              name: fd.get('fName') as string,
                              description: 'Formation spécialisée',
                              levels: ['Licence', 'Master'],
                              type: fd.get('fType') as any
                           };
                           if (currentUni) {
                              updateUniversity({ ...currentUni, faculties: [...currentUni.faculties, newFac] });
                              e.currentTarget.reset();
                           }
                        }} className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                           <input name="fName" required placeholder="Nom (ex: ENEAM)" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white" />
                           <button type="submit" className="w-full py-3 border border-primary/20 text-primary font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all">+ Ajouter la composante</button>
                        </form>
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                           <button onClick={() => setWizardStep('institution')} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest">Retour</button>
                           <button onClick={() => setWizardStep('majors')} disabled={!currentUni?.faculties.length} className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20">Configurer les filières</button>
                        </div>
                     </div>
                   )}

                   {/* 🔵 ÉTAPE 3 : FILIÈRES */}
                   {wizardStep === 'majors' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white">
                        <div className="text-center space-y-2">
                           <h4 className="text-2xl font-black text-white tracking-tight leading-none">Offre Académique</h4>
                           <p className="text-gray-500 font-medium text-sm">Ajoutez les filières (Débouchés & Diplômes obligatoires).</p>
                        </div>
                        <form onSubmit={(e) => {
                           e.preventDefault();
                           const fd = new FormData(e.currentTarget);
                           const majorData: Major = {
                              id: 'maj-' + Date.now(),
                              name: fd.get('mName') as string,
                              universityId: currentInstId || '',
                              universityName: currentUni?.name || '',
                              facultyName: fd.get('fName') as string,
                              domain: fd.get('domain') as string,
                              level: fd.get('level') as any,
                              duration: fd.get('duration') as string,
                              fees: fd.get('fees') as string,
                              location: currentUni?.location || '',
                              image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
                              careerProspects: [{ title: fd.get('career') as string, icon: 'work' }],
                              requiredDiplomas: [{ name: fd.get('diploma') as string, icon: 'school' }]
                           };
                           addMajor(majorData);
                           e.currentTarget.reset();
                        }} className="space-y-4 p-6 bg-white/5 rounded-[32px] border border-white/5">
                           <input name="mName" required placeholder="Nom Filière" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white" />
                           <div className="grid grid-cols-2 gap-4">
                              <input name="career" required placeholder="Débouché principal" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white" />
                              <input name="diploma" required placeholder="Diplôme requis" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white" />
                           </div>
                           <button type="submit" className="w-full py-3 bg-white/10 text-primary border border-primary/20 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all">Enregistrer la filière</button>
                        </form>
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                           <button onClick={() => setWizardStep('faculties')} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest">Retour</button>
                           <button onClick={() => setShowWizard(false)} className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all">Terminer</button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
