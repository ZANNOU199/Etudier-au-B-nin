
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { University, Major, Application, Faculty } from '../types';

type AdminView = 'overview' | 'applications' | 'catalog' | 'cms' | 'settings';
type CatalogSection = 'universities' | 'majors';
type EstablishmentFilter = 'all' | 'university' | 'school';
type CreationStep = 'institution' | 'faculties' | 'majors';

const ITEMS_PER_PAGE = 4;

const AdminDashboard: React.FC = () => {
  const { 
    applications, updateApplicationStatus, deleteApplication,
    universities, addUniversity, updateUniversity, deleteUniversity,
    majors, addMajor, updateMajor, deleteMajor, addFaculty, deleteFaculty,
    logout, user, refreshData
  } = useCMS();
  
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [activeCatalogSection, setActiveCatalogSection] = useState<CatalogSection>('universities');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [establishmentFilter, setEstablishmentFilter] = useState<EstablishmentFilter>('all');
  const [searchMajor, setSearchMajor] = useState('');
  const [uniPage, setUniPage] = useState(1);
  const [majorPage, setMajorPage] = useState(1);
  
  // States for Institution Wizard
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<CreationStep>('institution');
  const [currentInstId, setCurrentInstId] = useState<string | null>(null);
  const [isSchoolKind, setIsSchoolKind] = useState(false);
  const [establishmentStatus, setEstablishmentStatus] = useState<'Public' | 'Privé'>('Public');
  const [isEditing, setIsEditing] = useState(false);
  
  // States for Major Editor (Standalone)
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  // Établissement sélectionné dans le Wizard
  const currentUni = useMemo(() => 
    universities.find(u => String(u.id) === String(currentInstId)), 
    [universities, currentInstId]
  );
  
  // Filières de l'établissement en cours (Wizard - Step 3)
  const currentInstMajors = useMemo(() => {
    if (!currentInstId) return [];
    return majors.filter(m => String(m.universityId) === String(currentInstId));
  }, [majors, currentInstId]);

  // Filtrage des universités (Tab 1)
  const filteredUnis = useMemo(() => {
    return universities.filter(u => {
      if (establishmentFilter === 'university') return !u.isStandaloneSchool;
      if (establishmentFilter === 'school') return u.isStandaloneSchool;
      return true;
    });
  }, [universities, establishmentFilter]);

  const pagedUnis = filteredUnis.slice((uniPage - 1) * ITEMS_PER_PAGE, uniPage * ITEMS_PER_PAGE);

  // Filtrage des filières (Tab 2)
  const filteredMajors = useMemo(() => {
    return majors.filter(m => 
      m.name.toLowerCase().includes(searchMajor.toLowerCase()) ||
      m.universityName.toLowerCase().includes(searchMajor.toLowerCase()) ||
      m.domain.toLowerCase().includes(searchMajor.toLowerCase())
    );
  }, [majors, searchMajor]);

  const pagedMajors = filteredMajors.slice((majorPage - 1) * ITEMS_PER_PAGE, majorPage * ITEMS_PER_PAGE);

  const openWizardForEdit = (uni: University) => {
    setCurrentInstId(uni.id);
    setIsSchoolKind(!!uni.isStandaloneSchool);
    setEstablishmentStatus(uni.type);
    setIsEditing(true);
    setWizardStep('institution');
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
        if (newId) setCurrentInstId(newId.toString());
      }
      setWizardStep(!isSchoolKind ? 'faculties' : 'majors');
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMajorFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    const fd = new FormData(e.currentTarget);
    
    const universityId = fd.get('university_id') as string;
    const selectedUni = universities.find(u => String(u.id) === String(universityId));

    const payload = {
      university_id: parseInt(universityId),
      faculty_id: fd.get('faculty_id') ? parseInt(fd.get('faculty_id') as string) : null,
      name: fd.get('name') as string,
      domain: fd.get('domain') as string,
      level: fd.get('level') as string,
      duration: fd.get('duration') as string,
      fees: fd.get('fees') as string,
      location: selectedUni?.location || 'Bénin',
      career_prospects: (fd.get('career') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      required_diplomas: (fd.get('diplomas') as string)?.split(',').map(s => s.trim()).filter(Boolean) || []
    };

    try {
      if (editingMajor) {
        await updateMajor({
          ...editingMajor,
          name: payload.name,
          domain: payload.domain,
          level: payload.level as any,
          duration: payload.duration,
          fees: payload.fees,
          universityId: universityId,
          faculty_id: payload.faculty_id?.toString()
        });
      } else {
        await addMajor(payload);
      }
      setShowMajorModal(false);
      setEditingMajor(null);
      await refreshData();
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

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
          {activeView === 'catalog' && (
            <div className="space-y-8 animate-fade-in">
               <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  <div className="flex gap-2 p-1 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/10">
                    <button onClick={() => setActiveCatalogSection('universities')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'universities' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Universités & Écoles</button>
                    <button onClick={() => setActiveCatalogSection('majors')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'majors' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Filières</button>
                  </div>

                  {activeCatalogSection === 'universities' ? (
                    <div className="flex gap-2 bg-white dark:bg-surface-dark p-1 rounded-xl border border-gray-100 dark:border-white/10">
                       {['all', 'university', 'school'].map(f => (
                         <button key={f} onClick={() => { setEstablishmentFilter(f as EstablishmentFilter); setUniPage(1); }} className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${establishmentFilter === f ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm' : 'text-gray-400 hover:text-primary'}`}>
                           {f === 'all' ? 'Tout' : f === 'university' ? 'Universités' : 'Écoles'}
                         </button>
                       ))}
                    </div>
                  ) : (
                    <div className="flex-1 max-w-md w-full relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">search</span>
                      <input 
                        type="text" 
                        placeholder="Rechercher une filière..." 
                        value={searchMajor}
                        onChange={(e) => setSearchMajor(e.target.value)}
                        className="w-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 pl-10 pr-4 py-3 rounded-xl font-bold text-xs outline-none"
                      />
                    </div>
                  )}
               </div>

               {activeCatalogSection === 'universities' && (
                  <div className="bg-[#0d1b13] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pagedUnis.map(uni => (
                        <div key={uni.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/10 transition-all">
                           <div className="flex items-center gap-6 flex-1 w-full text-left">
                              <div className="size-20 rounded-2xl bg-white/10 flex items-center justify-center p-3 border border-white/10 relative shadow-inner">
                                 <img src={uni.logo} className="max-w-full max-h-full object-contain" alt="" />
                                 <span className={`absolute -top-3 -right-3 size-8 rounded-full flex items-center justify-center text-[12px] font-black shadow-lg ${uni.isStandaloneSchool ? 'bg-amber-400 text-black' : 'bg-primary text-black'}`}>
                                    {uni.isStandaloneSchool ? 'E' : 'U'}
                                 </span>
                              </div>
                              <div className="space-y-1 flex-1">
                                 <h3 className="text-2xl font-black text-white tracking-tighter leading-none">{uni.acronym}</h3>
                                 <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{uni.location}</p>
                                 <p className="text-sm font-black text-gray-300 line-clamp-1">{uni.name}</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <button onClick={() => openWizardForEdit(uni)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center border border-white/5">
                                 <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button onClick={() => deleteUniversity(uni.id)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center border border-white/5">
                                 <span className="material-symbols-outlined">delete</span>
                              </button>
                           </div>
                        </div>
                      ))}
                      
                      <button onClick={() => { setShowWizard(true); setWizardStep('institution'); setCurrentInstId(null); setIsEditing(false); }} className="min-h-[140px] flex items-center justify-center gap-6 rounded-[32px] border-2 border-dashed border-primary/20 hover:bg-primary/5 group">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl font-bold">add</span>
                        </div>
                        <span className="font-black uppercase text-[10px] tracking-[0.2em] text-primary">Nouvel établissement</span>
                      </button>
                    </div>
                  </div>
               )}

               {activeCatalogSection === 'majors' && (
                  <div className="bg-[#0d1b13] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pagedMajors.map(major => (
                        <div key={major.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/10 transition-all">
                           <div className="flex items-center gap-6 flex-1 w-full text-left">
                              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                                 <span className="material-symbols-outlined text-3xl font-bold">school</span>
                              </div>
                              <div className="space-y-1 flex-1">
                                 <div className="flex items-center gap-2">
                                   <h3 className="text-xl font-black text-white tracking-tighter leading-none">{major.name}</h3>
                                   <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest">{major.level}</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{major.universityName}</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <button onClick={() => { setEditingMajor(major); setShowMajorModal(true); }} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center border border-white/5">
                                 <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button onClick={() => deleteMajor(major.id)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center border border-white/5">
                                 <span className="material-symbols-outlined">delete</span>
                              </button>
                           </div>
                        </div>
                      ))}
                      
                      <button onClick={() => { setEditingMajor(null); setShowMajorModal(true); }} className="min-h-[120px] flex items-center justify-center gap-6 rounded-[32px] border-2 border-dashed border-primary/20 hover:bg-primary/5 group">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl font-bold">add_task</span>
                        </div>
                        <span className="font-black uppercase text-[10px] tracking-[0.2em] text-primary">Nouvelle filière</span>
                      </button>
                    </div>
                  </div>
               )}
            </div>
          )}
        </div>

        {/* MODAL: INSTITUTION WIZARD (STEP-BY-STEP) */}
        {showWizard && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden my-auto border border-white/5 animate-in zoom-in-95">
                <div className="bg-white/5 px-10 py-8 flex items-center justify-between border-b border-white/5">
                   <div className="text-left">
                      <h3 className="text-2xl font-black text-white tracking-tight leading-none">{isEditing ? 'Modifier' : 'Nouvel'} Établissement</h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-2">{wizardStep === 'institution' ? 'Étape 1 : Identité' : wizardStep === 'faculties' ? 'Étape 2 : Composantes' : 'Étape 3 : Filières'}</p>
                   </div>
                   <button onClick={() => setShowWizard(false)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>

                <div className="p-8 md:p-12">
                   {wizardStep === 'institution' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-4">
                           <button onClick={() => setIsSchoolKind(false)} className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${!isSchoolKind ? 'bg-primary text-black' : 'bg-white/5 text-gray-500'}`}>Université</button>
                           <button onClick={() => setIsSchoolKind(true)} className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${isSchoolKind ? 'bg-amber-400 text-black' : 'bg-white/5 text-gray-500'}`}>École / Institut</button>
                        </div>
                        
                        <form onSubmit={handleInstitutionSubmit} className="grid grid-cols-1 gap-6 text-left">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Nom Complet</label>
                              <input name="name" required defaultValue={currentUni?.name} className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Sigle</label>
                                 <input name="acronym" required defaultValue={currentUni?.acronym} className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Ville</label>
                                 <input name="location" required defaultValue={currentUni?.location} className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                              </div>
                           </div>
                           <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 mt-6">Continuer</button>
                        </form>
                     </div>
                   )}

                   {wizardStep === 'faculties' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4">
                        <div className="text-center space-y-2">
                           <h4 className="text-xl font-black text-white">Composantes internes</h4>
                           <p className="text-gray-500 text-sm">Ajoutez les facultés ou écoles de l'établissement.</p>
                        </div>
                        
                        <form onSubmit={async (e) => {
                           e.preventDefault();
                           setIsProcessing(true);
                           const fd = new FormData(e.currentTarget);
                           await addFaculty({
                             university_id: parseInt(currentInstId!),
                             name: fd.get('fName') as string,
                             type: 'Faculté',
                             description: 'Composante académique'
                           });
                           e.currentTarget.reset();
                           setIsProcessing(false);
                           await refreshData();
                        }} className="flex gap-2">
                           <input name="fName" required placeholder="Nom (ex: FASEG, EPAC...)" className="flex-1 p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           <button type="submit" className="px-6 bg-primary text-black font-black rounded-xl">+</button>
                        </form>

                        <div className="max-h-40 overflow-y-auto space-y-2 text-left">
                           {currentUni?.faculties.map(f => (
                              <div key={f.id} className="p-4 bg-white/5 rounded-xl flex justify-between items-center border border-white/5">
                                 <p className="font-black text-xs text-white">{f.name}</p>
                                 <button onClick={() => deleteFaculty(f.id)} className="material-symbols-outlined text-red-500 text-sm">delete</button>
                              </div>
                           ))}
                        </div>

                        <div className="flex gap-4 pt-6">
                           <button onClick={() => setWizardStep('institution')} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px]">Retour</button>
                           <button onClick={() => setWizardStep('majors')} className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] rounded-2xl">Suivant</button>
                        </div>
                     </div>
                   )}

                   {wizardStep === 'majors' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-left">
                        <div className="text-center space-y-2">
                           <h4 className="text-xl font-black text-white">Gestion des Filières</h4>
                           <p className="text-gray-500 text-sm">Ajoutez les formations proposées.</p>
                        </div>

                        <button 
                          onClick={() => { setEditingMajor(null); setShowMajorModal(true); }}
                          className="w-full py-4 border-2 border-dashed border-primary/20 rounded-2xl text-primary font-black uppercase text-[10px] flex items-center justify-center gap-3"
                        >
                           <span className="material-symbols-outlined">add</span>
                           Ajouter une formation
                        </button>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Filières déjà ajoutées</p>
                           {currentInstMajors.map(m => (
                              <div key={m.id} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5">
                                 <div>
                                    <p className="font-black text-xs text-white">{m.name}</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase">{m.level} • {m.domain}</p>
                                 </div>
                                 <div className="flex gap-2">
                                    <button onClick={() => { setEditingMajor(m); setShowMajorModal(true); }} className="material-symbols-outlined text-gray-500 hover:text-primary text-sm">edit</button>
                                    <button onClick={() => deleteMajor(m.id)} className="material-symbols-outlined text-red-500 text-sm">delete</button>
                                 </div>
                              </div>
                           ))}
                           {currentInstMajors.length === 0 && (
                              <div className="text-center py-10 opacity-30">
                                 <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                 <p className="text-[10px] font-black uppercase tracking-widest mt-2">Aucune filière configurée</p>
                              </div>
                           )}
                        </div>

                        <div className="flex gap-4 pt-6">
                           <button onClick={() => setWizardStep(!isSchoolKind ? 'faculties' : 'institution')} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px]">Retour</button>
                           <button onClick={() => { setShowWizard(false); refreshData(); }} className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] rounded-2xl">Terminer</button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* MODAL: MAJOR EDITOR (STANDALONE) */}
        {showMajorModal && (
          <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-xl rounded-[40px] shadow-2xl border border-white/5 animate-in zoom-in-95 my-auto">
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
                   <h3 className="text-xl font-black text-white">{editingMajor ? 'Modifier' : 'Ajouter'} une filière</h3>
                   <button onClick={() => setShowMajorModal(false)} className="text-gray-400"><span className="material-symbols-outlined">close</span></button>
                </div>
                <form onSubmit={handleMajorFormSubmit} className="p-8 space-y-6 text-left">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Établissement</label>
                     <select name="university_id" required defaultValue={editingMajor?.universityId || currentInstId || ''} className="w-full p-4 rounded-xl bg-[#0d1b13] text-white border-none font-bold">
                        {universities.map(u => <option key={u.id} value={u.id}>{u.acronym}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Nom de la formation</label>
                     <input name="name" required defaultValue={editingMajor?.name} className="w-full p-4 rounded-xl bg-white/5 text-white border-none font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Domaine</label>
                        <input name="domain" required defaultValue={editingMajor?.domain} className="w-full p-4 rounded-xl bg-white/5 text-white border-none font-bold" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Niveau</label>
                        <select name="level" defaultValue={editingMajor?.level} className="w-full p-4 rounded-xl bg-white/5 text-white border-none font-bold">
                           <option value="Licence">Licence</option>
                           <option value="Master">Master</option>
                        </select>
                     </div>
                  </div>
                  <button type="submit" disabled={isProcessing} className="w-full py-5 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[11px]">{isProcessing ? 'Traitement...' : 'Enregistrer'}</button>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
