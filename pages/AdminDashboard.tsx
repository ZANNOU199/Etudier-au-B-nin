
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { University, Major, Application, Faculty } from '../types';

type AdminView = 'overview' | 'applications' | 'catalog' | 'cms' | 'settings';
type CatalogSection = 'universities' | 'majors';
type EstablishmentFilter = 'all' | 'university' | 'school';
type CreationStep = 'institution' | 'faculties' | 'majors';

const UNI_PER_PAGE = 4;
const APPS_PER_PAGE = 8;
const MAJORS_PER_PAGE = 8;

const AdminDashboard: React.FC = () => {
  const { 
    applications, updateApplicationStatus, deleteApplication,
    universities, addUniversity, updateUniversity, deleteUniversity,
    majors, addMajor, updateMajor, deleteMajor, addFaculty, deleteFaculty,
    logout, user, refreshData, isLoading
  } = useCMS();
  
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [activeCatalogSection, setActiveCatalogSection] = useState<CatalogSection>('universities');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [establishmentFilter, setEstablishmentFilter] = useState<EstablishmentFilter>('all');
  const [uniPage, setUniPage] = useState(1);
  const [appsPage, setAppsPage] = useState(1);
  const [majorsPage, setMajorsPage] = useState(1);
  const [appSearch, setAppSearch] = useState('');
  const [majorSearch, setMajorSearch] = useState('');
  
  // States for Creation/Edit Wizard
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<CreationStep>('institution');
  const [currentInstId, setCurrentInstId] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null); // State pour pré-remplir l'édition
  const [isSchoolKind, setIsSchoolKind] = useState(false);
  const [establishmentStatus, setEstablishmentStatus] = useState<'Public' | 'Privé'>('Public');
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  // Filtrage des candidatures
  const filteredApps = useMemo(() => {
    return applications.filter(a => 
      a.majorName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.studentName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.id.includes(appSearch)
    );
  }, [applications, appSearch]);

  const pagedApps = filteredApps.slice((appsPage - 1) * APPS_PER_PAGE, appsPage * APPS_PER_PAGE);
  const totalAppsPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);

  // Filtrage des filières (Majors)
  const filteredMajorsList = useMemo(() => {
    return majors.filter(m => 
      m.name.toLowerCase().includes(majorSearch.toLowerCase()) ||
      (m.universityName && m.universityName.toLowerCase().includes(majorSearch.toLowerCase())) ||
      (m.domain && m.domain.toLowerCase().includes(majorSearch.toLowerCase()))
    );
  }, [majors, majorSearch]);

  const pagedMajors = filteredMajorsList.slice((majorsPage - 1) * MAJORS_PER_PAGE, majorsPage * MAJORS_PER_PAGE);
  const totalMajorsPages = Math.ceil(filteredMajorsList.length / MAJORS_PER_PAGE);

  // Filtrage des universités
  const filteredUnis = useMemo(() => {
    return universities.filter(u => {
      if (establishmentFilter === 'university') return !u.isStandaloneSchool;
      if (establishmentFilter === 'school') return u.isStandaloneSchool;
      return true;
    });
  }, [universities, establishmentFilter]);

  const pagedUnis = filteredUnis.slice((uniPage - 1) * UNI_PER_PAGE, uniPage * UNI_PER_PAGE);

  // Établissement actuellement sélectionné dans le Wizard
  const currentUni = useMemo(() => 
    universities.find(u => String(u.id) === String(currentInstId)), 
    [universities, currentInstId]
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateApplicationStatus(id, status);
    } catch (e) {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const openWizardForEditUni = (uni: University) => {
    setCurrentInstId(uni.id);
    setIsSchoolKind(!!uni.isStandaloneSchool);
    setEstablishmentStatus(uni.type);
    setIsEditing(true);
    setWizardStep('institution');
    setShowWizard(true);
  };

  const openWizardForEditMajor = (major: Major) => {
    setSelectedMajor(major);
    setCurrentInstId(major.universityId || null);
    setIsEditing(true);
    setWizardStep('majors');
    setShowWizard(true);
  };

  const handleInstitutionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    const fd = new FormData(e.currentTarget);
    
    const apiPayload = new FormData();
    apiPayload.append('name', fd.get('name') as string);
    apiPayload.append('acronym', fd.get('acronym') as string);
    apiPayload.append('city', fd.get('location') as string);
    apiPayload.append('type', establishmentStatus.toLowerCase());
    apiPayload.append('is_standalone', isSchoolKind ? '1' : '0');

    try {
      if (isEditing && currentInstId) {
        await updateUniversity(currentInstId, {
          name: fd.get('name'),
          acronym: fd.get('acronym'),
          city: fd.get('location'),
          type: establishmentStatus.toLowerCase()
        });
      } else {
        const result = await addUniversity(apiPayload);
        const newId = result?.id || result?.data?.id || result?.university?.id || result?.institution?.id;
        if (newId) {
          setCurrentInstId(newId.toString());
        }
      }
      setWizardStep(!isSchoolKind ? 'faculties' : 'majors');
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const SidebarNav = () => (
    <div className="flex flex-col h-full py-10 px-6">
      <div className="flex items-center gap-4 px-4 mb-12 text-left">
        <div className="size-11 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shrink-0">
          <span className="material-symbols-outlined text-2xl font-black">shield_person</span>
        </div>
        <div className="text-left">
          <h2 className="font-black text-lg text-white tracking-tight leading-none">AdminHub</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Console Master</p>
        </div>
      </div>

      <nav className="flex-grow space-y-2">
        {[
          { id: 'overview', label: 'Dashboard', icon: 'grid_view' },
          { id: 'applications', label: 'Candidatures', icon: 'description', badge: applications.length.toString() },
          { id: 'catalog', label: 'Catalogue Acad.', icon: 'category' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => { setActiveView(item.id as AdminView); setIsSidebarOpen(false); }}
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
              <button onClick={() => refreshData()} className={`size-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all ${isLoading ? 'animate-spin' : ''}`}>
                <span className="material-symbols-outlined">refresh</span>
              </button>
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-black font-black text-xs shadow-lg">AD</div>
           </div>
        </header>

        <div className="p-4 lg:p-12 space-y-10">
          {activeView === 'catalog' && (
            <div className="space-y-8 animate-fade-in text-left">
               {/* Toggle Catalog Section */}
               <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  <div className="flex gap-2 p-1 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/10">
                    <button onClick={() => setActiveCatalogSection('universities')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'universities' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Universités & Écoles</button>
                    <button onClick={() => setActiveCatalogSection('majors')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'majors' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Filières</button>
                  </div>

                  {activeCatalogSection === 'majors' && (
                    <div className="w-full lg:w-80 relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                       <input 
                         type="text" 
                         placeholder="Nom, Établissement ou Domaine..." 
                         value={majorSearch}
                         onChange={(e) => { setMajorSearch(e.target.value); setMajorsPage(1); }}
                         className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/10 outline-none text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary/20"
                       />
                    </div>
                  )}
               </div>

               {/* Section Universités */}
               {activeCatalogSection === 'universities' && (
                  <div className="bg-[#0d1b13] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pagedUnis.map(uni => (
                        <div key={uni.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/10 transition-all h-full">
                           <div className="flex items-center gap-6 flex-1 w-full text-left">
                              <div className="size-20 rounded-2xl bg-white/10 flex items-center justify-center p-3 border border-white/10 relative shadow-inner">
                                 <img src={uni.logo} className="max-w-full max-h-full object-contain" alt="" />
                                 <span className={`absolute -top-3 -right-3 size-8 rounded-full flex items-center justify-center text-[12px] font-black shadow-lg ${uni.isStandaloneSchool ? 'bg-amber-400 text-black' : 'bg-primary text-black'}`}>
                                    {uni.isStandaloneSchool ? 'E' : 'U'}
                                 </span>
                              </div>
                              <div className="space-y-1 flex-1 text-left">
                                 <h3 className="text-2xl font-black text-white tracking-tighter leading-none">{uni.acronym}</h3>
                                 <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{uni.location}</p>
                                 <p className="text-sm font-black text-gray-300 line-clamp-1">{uni.name}</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <button onClick={() => openWizardForEditUni(uni)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center transition-all border border-white/5">
                                 <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button onClick={() => deleteUniversity(uni.id)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all border border-white/5">
                                 <span className="material-symbols-outlined">delete</span>
                              </button>
                           </div>
                        </div>
                      ))}
                      
                      <button onClick={() => { setShowWizard(true); setWizardStep('institution'); setCurrentInstId(null); setSelectedMajor(null); setIsEditing(false); setEstablishmentStatus('Public'); }} className="min-h-[140px] flex items-center justify-center gap-6 rounded-[32px] border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all group">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl font-bold">add</span>
                        </div>
                        <span className="font-black uppercase text-[10px] tracking-[0.2em] text-primary">Nouvel établissement</span>
                      </button>
                    </div>
                  </div>
               )}

               {/* Section Filières (Page Filière de Catalogue ACAD) */}
               {activeCatalogSection === 'majors' && (
                  <div className="bg-[#0d1b13] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl animate-fade-in">
                    <div className="overflow-x-auto rounded-[32px] border border-white/5 bg-white/2">
                       <table className="w-full text-left border-collapse min-w-[1000px]">
                          <thead className="border-b border-white/5 bg-white/2">
                             <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Formation / Niveau</th>
                                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Établissement</th>
                                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Domaine</th>
                                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Scolarité</th>
                                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em] text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                             {pagedMajors.map(major => (
                               <tr key={major.id} className="hover:bg-white/2 transition-colors">
                                  <td className="px-8 py-5">
                                     <div className="space-y-1">
                                        <p className="text-white font-black text-sm">{major.name}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                          <span className="text-amber-400">{major.level}</span> • {major.duration}
                                        </p>
                                     </div>
                                  </td>
                                  <td className="px-8 py-5">
                                     <div className="space-y-1">
                                       <p className="text-sm font-black text-gray-300 leading-none">{major.universityName}</p>
                                       <p className="text-[9px] text-gray-500 font-bold italic truncate max-w-[200px]">{major.facultyName}</p>
                                     </div>
                                  </td>
                                  <td className="px-8 py-5">
                                     <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-primary uppercase tracking-widest">{major.domain}</span>
                                  </td>
                                  <td className="px-8 py-5">
                                     <p className="text-sm font-black text-gray-400">{major.fees}</p>
                                  </td>
                                  <td className="px-8 py-5 text-right">
                                     <div className="flex justify-end gap-3">
                                        <button 
                                          onClick={() => openWizardForEditMajor(major)}
                                          className="size-9 rounded-xl bg-white/5 text-gray-500 hover:text-primary transition-all flex items-center justify-center border border-white/5"
                                          title="Modifier la filière"
                                        >
                                           <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button 
                                          onClick={() => { if(window.confirm('Supprimer cette filière ?')) deleteMajor(major.id); }}
                                          className="size-9 rounded-xl bg-white/5 text-gray-500 hover:text-red-500 transition-all flex items-center justify-center border border-white/5"
                                          title="Supprimer la filière"
                                        >
                                           <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                     </div>
                                  </td>
                               </tr>
                             ))}
                             {pagedMajors.length === 0 && (
                               <tr>
                                 <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-black italic">Aucune filière trouvée.</td>
                               </tr>
                             )}
                          </tbody>
                       </table>
                    </div>

                    {totalMajorsPages > 1 && (
                      <div className="flex justify-center gap-2">
                         {Array.from({ length: totalMajorsPages }).map((_, i) => (
                            <button 
                               key={i} 
                               onClick={() => setMajorsPage(i + 1)}
                               className={`size-10 rounded-xl font-black text-xs transition-all ${majorsPage === i + 1 ? 'bg-primary text-black' : 'bg-white/5 text-gray-500 border border-white/5'}`}
                            >
                               {i + 1}
                            </button>
                         ))}
                      </div>
                    )}
                  </div>
               )}
            </div>
          )}

          {/* VUES PAR DÉFAUT SI PAS CATALOGUE */}
          {activeView === 'overview' && <div className="text-left font-black opacity-30 uppercase tracking-[0.5em] py-20">Console Overview Active</div>}
          {activeView === 'applications' && <div className="text-left font-black opacity-30 uppercase tracking-[0.5em] py-20">Applications Manager Active</div>}
        </div>

        {/* MODAL: INSTITUTION & MAJOR WIZARD */}
        {showWizard && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-300 border border-white/5">
                <div className="bg-white/5 px-10 py-8 flex items-center justify-between border-b border-white/5">
                   <div className="text-left">
                      <h3 className="text-2xl font-black text-white tracking-tight leading-none">{isEditing ? 'Modifier' : 'Nouvel'} Élément</h3>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="material-symbols-outlined text-primary text-sm font-bold">{wizardStep === 'institution' ? 'account_balance' : wizardStep === 'faculties' ? 'domain' : 'school'}</span>
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest">{wizardStep === 'institution' ? 'Identité Établissement' : wizardStep === 'faculties' ? 'Configuration Composantes' : 'Configuration Filière'}</p>
                      </div>
                   </div>
                   <button onClick={() => { setShowWizard(false); setSelectedMajor(null); }} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                   {wizardStep === 'institution' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white text-left">
                        <form onSubmit={handleInstitutionSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Nom Complet</label>
                              <input name="name" defaultValue={currentUni?.name} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Sigle</label>
                              <input name="acronym" defaultValue={currentUni?.acronym} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Ville</label>
                              <input name="location" defaultValue={currentUni?.location} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           </div>
                           <div className="md:col-span-2 pt-6">
                              <button type="submit" disabled={isProcessing} className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">
                                 {isProcessing ? "Traitement..." : "Enregistrer & Continuer"}
                              </button>
                           </div>
                        </form>
                     </div>
                   )}

                   {wizardStep === 'majors' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white text-left">
                        <div className="text-center space-y-2">
                           <h4 className="text-2xl font-black text-white tracking-tight leading-none">{isEditing ? 'Éditer' : 'Ajouter'} une filière</h4>
                           <p className="text-gray-500 font-medium text-sm">Établissement : <span className="text-primary">{currentUni?.name}</span></p>
                        </div>

                        <form onSubmit={async (e) => {
                           e.preventDefault();
                           setIsProcessing(true);
                           const formRef = e.currentTarget;
                           const fd = new FormData(formRef);
                           try {
                             if (!currentInstId) throw new Error("Établissement manquant.");
                             
                             const majorPayload: any = {
                               university_id: parseInt(currentInstId),
                               faculty_id: fd.get('faculty_id') ? parseInt(fd.get('faculty_id') as string) : null,
                               name: fd.get('name') as string,
                               domain: fd.get('domain') as string,
                               level: fd.get('level') as string,
                               duration: fd.get('duration') as string,
                               fees: fd.get('fees') as string,
                               location: currentUni?.location || 'Bénin',
                             };

                             if (isEditing && selectedMajor) {
                               await updateMajor({ ...selectedMajor, ...majorPayload });
                             } else {
                               await addMajor(majorPayload);
                             }
                             
                             formRef.reset();
                             setSelectedMajor(null);
                             setShowWizard(false);
                             await refreshData();
                           } catch (err: any) {
                             alert("Erreur : " + err.message);
                           } finally {
                             setIsProcessing(false);
                           }
                        }} className="p-8 bg-white/5 rounded-[32px] border border-white/5 space-y-6">
                           
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Composante de rattachement</label>
                              <select 
                                name="faculty_id" 
                                defaultValue={selectedMajor?.faculty_id}
                                className="w-full p-4 rounded-xl bg-[#162a1f] border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                 <option value="">-- Tronc Commun --</option>
                                 {Array.isArray(currentUni?.faculties) && currentUni.faculties.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                 ))}
                              </select>
                           </div>

                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Nom de la filière</label>
                              <input name="name" required defaultValue={selectedMajor?.name} placeholder="ex: Génie Logiciel" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Domaine</label>
                                 <input name="domain" required defaultValue={selectedMajor?.domain} placeholder="ex: Informatique" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Niveau</label>
                                 <select name="level" defaultValue={selectedMajor?.level || 'Licence'} className="w-full p-4 rounded-xl bg-[#162a1f] border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="Licence">Licence</option>
                                    <option value="Master">Master</option>
                                    <option value="Doctorat">Doctorat</option>
                                 </select>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Durée (ex: 3 Ans)</label>
                                 <input name="duration" required defaultValue={selectedMajor?.duration} className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Scolarité (ex: 400.000 FCFA)</label>
                                 <input name="fees" required defaultValue={selectedMajor?.fees} className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                              </div>
                           </div>

                           <button type="submit" disabled={isProcessing} className="w-full py-4 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50">
                              {isProcessing ? "Traitement..." : isEditing ? "Mettre à jour la filière" : "+ Enregistrer la filière"}
                           </button>
                        </form>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                           {!isEditing && <button onClick={() => setWizardStep(!isSchoolKind ? 'faculties' : 'institution')} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Retour</button>}
                           <button onClick={() => { setShowWizard(false); setSelectedMajor(null); }} className="flex-1 py-4 bg-white/5 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-white/5">Annuler</button>
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
