
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';
import { University, Major, Application, Faculty } from '../types';

type AdminView = 'overview' | 'applications' | 'catalog' | 'recommandations' | 'cms' | 'settings';
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
  
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [activeCatalogSection, setActiveCatalogSection] = useState<CatalogSection>('universities');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [establishmentFilter, setEstablishmentFilter] = useState<EstablishmentFilter>('all');
  const [uniPage, setUniPage] = useState(1);
  const [appsPage, setAppsPage] = useState(1);
  const [majorsPage, setMajorsPage] = useState(1);
  const [appSearch, setAppSearch] = useState('');
  const [majorSearch, setMajorSearch] = useState('');
  const [recoSearch, setRecoSearch] = useState('');
  
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<CreationStep>('institution');
  const [currentInstId, setCurrentInstId] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [isSchoolKind, setIsSchoolKind] = useState(false);
  const [establishmentStatus, setEstablishmentStatus] = useState<'Public' | 'Privé'>('Public');
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [prospects, setProspects] = useState<string[]>([]);
  const [diplomas, setDiplomas] = useState<string[]>([]);
  const [newProspect, setNewProspect] = useState('');
  const [newDiploma, setNewDiploma] = useState('');

  const filteredApps = useMemo(() => {
    return applications.filter(a => 
      a.majorName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.studentName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.id.includes(appSearch)
    );
  }, [applications, appSearch]);

  const pagedApps = filteredApps.slice((appsPage - 1) * APPS_PER_PAGE, appsPage * APPS_PER_PAGE);
  const totalAppsPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);

  const filteredMajorsList = useMemo(() => {
    return majors.filter(m => 
      m.name.toLowerCase().includes(majorSearch.toLowerCase()) ||
      m.universityName.toLowerCase().includes(majorSearch.toLowerCase()) ||
      m.domain.toLowerCase().includes(majorSearch.toLowerCase())
    );
  }, [majors, majorSearch]);

  const pagedMajors = filteredMajorsList.slice((majorsPage - 1) * MAJORS_PER_PAGE, majorsPage * MAJORS_PER_PAGE);
  const totalMajorsPages = Math.ceil(filteredMajorsList.length / MAJORS_PER_PAGE);

  const filteredUnis = useMemo(() => {
    return universities.filter(u => {
      if (establishmentFilter === 'university') return !u.isStandaloneSchool;
      if (establishmentFilter === 'school') return u.isStandaloneSchool;
      return true;
    });
  }, [universities, establishmentFilter]);

  const pagedUnis = filteredUnis.slice((uniPage - 1) * UNI_PER_PAGE, uniPage * UNI_PER_PAGE);

  const filteredRecos = useMemo(() => {
    return universities.filter(u => 
      u.name.toLowerCase().includes(recoSearch.toLowerCase()) || 
      u.acronym.toLowerCase().includes(recoSearch.toLowerCase())
    ).sort((a, b) => (b.recommended || 0) - (a.recommended || 0));
  }, [universities, recoSearch]);

  const currentUni = useMemo(() => 
    universities.find(u => String(u.id) === String(currentInstId)), 
    [universities, currentInstId]
  );
  
  useEffect(() => {
    if (selectedMajor) {
      setProspects(selectedMajor.careerProspects?.map(p => p.title) || []);
      setDiplomas(selectedMajor.requiredDiplomas?.map(d => d.name) || []);
    } else {
      setProspects([]);
      setDiplomas([]);
    }
  }, [selectedMajor]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try { await updateApplicationStatus(id, status); } catch (e) { alert("Erreur mise à jour statut."); }
  };

  const handleToggleRecommended = async (uni: University) => {
    try { await updateUniversity(uni.id, { recommended: uni.recommended === 1 ? 0 : 1 }); } catch (e) { alert("Erreur reco."); }
  };

  const openWizardForEdit = (uni: University) => {
    setCurrentInstId(uni.id); setIsSchoolKind(!!uni.isStandaloneSchool); setEstablishmentStatus(uni.type);
    setIsEditing(true); setWizardStep('institution'); setShowWizard(true);
  };

  const openWizardForEditMajor = (major: Major) => {
    setSelectedMajor(major); setCurrentInstId(major.universityId || null);
    const parent = universities.find(u => u.id === major.universityId);
    if (parent) { setIsSchoolKind(!!parent.isStandaloneSchool); setEstablishmentStatus(parent.type); }
    setIsEditing(true); setWizardStep('majors'); setShowWizard(true);
  };

  const handleInstitutionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setIsProcessing(true);
    const fd = new FormData(e.currentTarget);
    const apiPayload = new FormData();
    apiPayload.append('name', fd.get('name') as string);
    apiPayload.append('acronym', fd.get('acronym') as string);
    apiPayload.append('city', fd.get('location') as string);
    apiPayload.append('type', establishmentStatus.toLowerCase());
    apiPayload.append('is_standalone', isSchoolKind ? '1' : '0');

    try {
      if (isEditing && currentInstId) {
        await updateUniversity(currentInstId, { name: fd.get('name'), acronym: fd.get('acronym'), city: fd.get('location'), type: establishmentStatus.toLowerCase() });
      } else {
        const result = await addUniversity(apiPayload);
        const newId = result?.id || result?.data?.id || result?.university?.id || result?.institution?.id;
        if (newId) setCurrentInstId(newId.toString()); else throw new Error("ID non récupéré.");
      }
      setWizardStep('faculties');
    } catch (err: any) { alert("Erreur : " + err.message); } finally { setIsProcessing(false); }
  };

  const addProspect = () => { if (newProspect.trim()) { setProspects([...prospects, newProspect.trim()]); setNewProspect(''); } };
  const removeProspect = (index: number) => setProspects(prospects.filter((_, i) => i !== index));

  const addDiploma = () => { if (newDiploma.trim()) { setDiplomas([...diplomas, newDiploma.trim()]); setNewDiploma(''); } };
  const removeDiploma = (index: number) => setDiplomas(diplomas.filter((_, i) => i !== index));

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
          { id: 'recommandations', label: 'Recommandations', icon: 'grade' },
        ].map((item) => (
          <button key={item.id} onClick={() => { setActiveView(item.id as AdminView); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeView === item.id ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-xl">{item.icon}</span>{item.label}</div>
            {item.badge && item.badge !== '0' && <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeView === item.id ? 'bg-black text-white' : 'bg-white/10 text-gray-400'}`}>{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="pt-10 border-t border-white/5">
        <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
          <span className="material-symbols-outlined text-xl">logout</span>Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#f4f7f6] dark:bg-background-dark font-display overflow-hidden relative">
      <aside className="hidden lg:flex w-80 bg-[#0d1b13] flex-col shrink-0 z-30 shadow-2xl border-r border-white/5"><SidebarNav /></aside>
      {isSidebarOpen && <><div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} /><aside className="fixed left-0 top-0 bottom-0 w-80 bg-[#0d1b13] z-[60] lg:hidden animate-in slide-in-from-left duration-300 shadow-2xl"><SidebarNav /></aside></>}

      <main className="flex-1 overflow-y-auto h-screen bg-gray-50 dark:bg-background-dark/50 flex flex-col">
        <header className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 lg:px-12 py-6 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-4"><button onClick={() => setIsSidebarOpen(true)} className="lg:hidden size-11 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500"><span className="material-symbols-outlined">menu</span></button><h1 className="text-xl lg:text-2xl font-black dark:text-white tracking-tighter uppercase">Admin Console</h1></div>
           <div className="flex items-center gap-4"><button onClick={() => refreshData()} className={`size-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all ${isLoading ? 'animate-spin' : ''}`}><span className="material-symbols-outlined">refresh</span></button><div className="size-10 rounded-xl bg-primary flex items-center justify-center text-black font-black text-xs shadow-lg">AD</div></div>
        </header>

        <div className="p-4 lg:p-12 space-y-10">
          {activeView === 'overview' && (
            <div className="space-y-10 animate-fade-in text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: 'Candidatures', val: applications.length.toString(), icon: 'description', color: 'bg-primary/10 text-primary' },
                  { label: 'Établissements', val: universities.length.toString(), icon: 'account_balance', color: 'bg-blue-500/10 text-blue-500' },
                  { label: 'Filières', val: majors.length.toString(), icon: 'library_books', color: 'bg-purple-500/10 text-purple-500' },
                  { label: 'En attente', val: applications.filter(a => a.status === 'En attente').length.toString(), icon: 'hourglass_top', color: 'bg-amber-500/10 text-amber-500' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className={`size-12 rounded-xl flex items-center justify-center ${kpi.color} mb-6`}><span className="material-symbols-outlined font-bold text-2xl">{kpi.icon}</span></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                    <p className="text-3xl font-black dark:text-white tracking-tighter">{kpi.val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0f1a13] rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-4 max-w-xl"><h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Gestion des <span className="text-primary italic">Inscriptions</span></h2><p className="text-gray-400 font-medium leading-relaxed">Validez les dossiers des candidats et gérez l'offre académique en temps réel.</p></div>
                <button onClick={() => setActiveView('applications')} className="px-10 py-5 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-105 transition-all">Traiter les dossiers</button>
              </div>
            </div>
          )}

          {activeView === 'applications' && (
            <div className="space-y-8 animate-fade-in text-left">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1"><h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Candidatures Étudiantes</h2><p className="text-gray-500 font-medium italic">Liste complète des dossiers soumis.</p></div>
                  <div className="w-full md:w-80 relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span><input type="text" placeholder="Rechercher..." value={appSearch} onChange={(e) => { setAppSearch(e.target.value); setAppsPage(1); }} className="w-full pl-12 pr-4 py-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/10 outline-none text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary/20"/></div>
               </div>
               <div className="bg-white dark:bg-surface-dark rounded-[40px] border border-gray-100 dark:border-white/5 overflow-hidden shadow-premium">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                        <tr>
                          <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidat</th>
                          <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Filière</th>
                          <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Docs</th>
                          <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                          <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {pagedApps.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                            <td className="px-8 py-6"><div className="flex items-center gap-4 text-left"><div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase">{app.studentName.slice(0, 2)}</div><div className="space-y-0.5"><p className="text-sm font-black dark:text-white leading-none">{app.studentName}</p><p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">#{app.id} • {app.date}</p></div></div></td>
                            <td className="px-8 py-6"><div className="space-y-1"><p className="text-sm font-black dark:text-white">{app.majorName}</p><p className="text-[10px] font-bold text-primary uppercase tracking-widest">{app.universityName}</p></div></td>
                            <td className="px-8 py-6">{app.primary_document_url ? (<a href={app.primary_document_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline"><span className="material-symbols-outlined text-sm">description</span>Voir</a>) : (<span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aucun</span>)}</td>
                            <td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${app.status === 'Validé' ? 'bg-primary/10 text-primary border-primary/20' : app.status === 'Rejeté' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-400/10 text-amber-500 border-amber-400/20'}`}>{app.status}</span></td>
                            <td className="px-8 py-6 text-right"><div className="flex items-center justify-end gap-2">{app.status === 'En attente' && (<><button onClick={() => handleStatusUpdate(app.id, 'accepted')} className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-black transition-all" title="Valider"><span className="material-symbols-outlined text-lg font-bold">check</span></button><button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="size-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all" title="Rejeter"><span className="material-symbols-outlined text-lg">close</span></button></>)}<button onClick={() => deleteApplication(app.id)} className="size-9 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">delete</span></button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalAppsPages > 1 && (<div className="p-6 bg-gray-50/50 dark:bg-white/2 border-t border-gray-100 dark:border-white/5 flex justify-center gap-2">{Array.from({ length: totalAppsPages }).map((_, i) => (<button key={i} onClick={() => setAppsPage(i + 1)} className={`size-10 rounded-xl font-black text-xs transition-all ${appsPage === i + 1 ? 'bg-primary text-black' : 'bg-white dark:bg-white/5 dark:text-white border border-gray-100 dark:border-white/10'}`}>{i + 1}</button>))}</div>)}
               </div>
            </div>
          )}

          {activeView === 'catalog' && (
            <div className="space-y-8 animate-fade-in text-left">
               <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  <div className="flex gap-2 p-1 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/10">
                    <button onClick={() => setActiveCatalogSection('universities')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'universities' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Universités & Écoles</button>
                    <button onClick={() => setActiveCatalogSection('majors')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'majors' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Filières</button>
                  </div>
                  {activeCatalogSection === 'universities' && (<div className="flex gap-2 bg-white dark:bg-surface-dark p-1 rounded-xl border border-gray-100 dark:border-white/10">{['all', 'university', 'school'].map(f => (<button key={f} onClick={() => { setEstablishmentFilter(f as EstablishmentFilter); setUniPage(1); }} className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${establishmentFilter === f ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm' : 'text-gray-400 hover:text-primary'}`}>{f === 'all' ? 'Tout' : f === 'university' ? 'Universités' : 'Écoles'}</button>))}</div>)}
                  {activeCatalogSection === 'majors' && (<div className="w-full lg:w-80 relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span><input type="text" placeholder="Chercher une filière..." value={majorSearch} onChange={(e) => { setMajorSearch(e.target.value); setMajorsPage(1); }} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/10 outline-none text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary/20"/></div>)}
               </div>

               {activeCatalogSection === 'universities' && (
                  <div className="bg-[#0d1b13] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pagedUnis.map(uni => (
                        <div key={uni.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/10 transition-all h-full">
                           <div className="flex items-center gap-6 flex-1 w-full text-left"><div className="size-20 rounded-2xl bg-white/10 flex items-center justify-center p-3 border border-white/10 relative shadow-inner"><img src={uni.logo} className="max-w-full max-h-full object-contain" alt="" /><span className={`absolute -top-3 -right-3 size-8 rounded-full flex items-center justify-center text-[12px] font-black shadow-lg ${uni.isStandaloneSchool ? 'bg-amber-400 text-black' : 'bg-primary text-black'}`}>{uni.isStandaloneSchool ? 'E' : 'U'}</span></div><div className="space-y-1 flex-1 text-left"><h3 className="text-2xl font-black text-white tracking-tighter leading-none">{uni.acronym}</h3><p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{uni.location}</p><p className="text-sm font-black text-gray-300 line-clamp-1">{uni.name}</p></div></div>
                           <div className="flex gap-3"><button onClick={() => openWizardForEdit(uni)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center transition-all border border-white/5"><span className="material-symbols-outlined">edit</span></button><button onClick={() => deleteUniversity(uni.id)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all border border-white/5"><span className="material-symbols-outlined">delete</span></button></div>
                        </div>
                      ))}
                      <button onClick={() => { setShowWizard(true); setWizardStep('institution'); setCurrentInstId(null); setIsEditing(false); setEstablishmentStatus('Public'); setSelectedMajor(null); setProspects([]); setDiplomas([]); }} className="min-h-[140px] flex items-center justify-center gap-6 rounded-[32px] border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all group"><div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-3xl font-bold">add</span></div><span className="font-black uppercase text-[10px] tracking-[0.2em] text-primary">Nouvel établissement</span></button>
                    </div>
                    {Math.ceil(filteredUnis.length / UNI_PER_PAGE) > 1 && (<div className="flex justify-center gap-2 mt-10">{Array.from({ length: Math.ceil(filteredUnis.length / UNI_PER_PAGE) }).map((_, i) => (<button key={i} onClick={() => setUniPage(i+1)} className={`size-10 rounded-xl font-black text-xs transition-all ${uniPage === i+1 ? 'bg-primary text-black' : 'bg-white/5 text-gray-500'}`}>{i+1}</button>))}</div>)}
                  </div>
               )}

               {activeCatalogSection === 'majors' && (
                  <div className="bg-[#0d1b13] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                    <div className="overflow-x-auto rounded-[32px] border border-white/5 bg-white/2">
                       <table className="w-full text-left border-collapse min-w-[1000px]">
                          <thead className="border-b border-white/5 bg-white/2"><tr><th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Formation</th><th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Établissement</th><th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Domaine</th><th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Scolarité</th><th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em] text-right">Actions</th></tr></thead>
                          <tbody className="divide-y divide-white/5">{pagedMajors.map(major => (<tr key={major.id} className="hover:bg-white/2 transition-colors"><td className="px-8 py-5 text-left"><div className="space-y-1"><p className="text-white font-black text-sm">{major.name}</p><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest"><span className="text-amber-400">{major.level}</span> • {major.duration}</p></div></td><td className="px-8 py-5 text-left"><div className="space-y-1"><p className="text-sm font-black text-gray-300 leading-none">{major.universityName}</p><p className="text-[9px] text-gray-500 font-bold italic truncate max-w-[200px]">{major.facultyName}</p></div></td><td className="px-8 py-5 text-left"><span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-primary uppercase tracking-widest">{major.domain}</span></td><td className="px-8 py-5 text-left"><p className="text-sm font-black text-gray-400">{major.fees}</p></td><td className="px-8 py-5 text-right"><div className="flex justify-end gap-3"><button onClick={() => openWizardForEditMajor(major)} className="size-9 rounded-xl bg-white/5 text-gray-500 hover:text-primary transition-all flex items-center justify-center border border-white/5" title="Modifier"><span className="material-symbols-outlined text-lg">edit</span></button><button onClick={() => { if(window.confirm('Supprimer ?')) deleteMajor(major.id); }} className="size-9 rounded-xl bg-white/5 text-gray-500 hover:text-red-500 transition-all flex items-center justify-center border border-white/5" title="Supprimer"><span className="material-symbols-outlined text-lg">delete</span></button></div></td></tr>))}</tbody>
                       </table>
                    </div>
                    {totalMajorsPages > 1 && (<div className="flex justify-center gap-2">{Array.from({ length: totalMajorsPages }).map((_, i) => (<button key={i} onClick={() => setMajorsPage(i + 1)} className={`size-10 rounded-xl font-black text-xs transition-all ${majorsPage === i + 1 ? 'bg-primary text-black' : 'bg-white/5 text-gray-500 border border-white/5'}`}>{i + 1}</button>))}</div>)}
                  </div>
               )}
            </div>
          )}

          {activeView === 'recommandations' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"><div className="space-y-1"><h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Gestion des Recommandations</h2><p className="text-gray-500 font-medium italic">Ordre d'affichage sur l'accueil.</p></div><div className="w-full md:w-80 relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span><input type="text" placeholder="Filtrer par nom..." value={recoSearch} onChange={(e) => setRecoSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/10 outline-none text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary/20"/></div></div>
              <div className="bg-[#0d1b13] p-10 rounded-[40px] border border-white/5 shadow-2xl">
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRecos.map(uni => (<div key={uni.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex items-center justify-between gap-4 group hover:bg-white/10 transition-all"><div className="flex items-center gap-4 flex-1 overflow-hidden"><div className="size-12 rounded-xl bg-white/10 flex items-center justify-center p-2 shrink-0"><img src={uni.logo} className="max-w-full max-h-full object-contain" alt="" /></div><div className="truncate text-left"><h3 className="text-sm font-black text-white truncate">{uni.acronym}</h3><p className="text-[10px] text-gray-500 font-bold uppercase truncate">{uni.location}</p></div></div><button onClick={() => handleToggleRecommended(uni)} className={`size-11 rounded-xl flex items-center justify-center transition-all border shrink-0 ${uni.recommended === 1 ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20' : 'bg-white/5 text-gray-500 border-white/5 hover:text-amber-400'}`}><span className="material-symbols-outlined font-black">{uni.recommended === 1 ? 'grade' : 'star_outline'}</span></button></div>))}
                 </div>
              </div>
            </div>
          )}
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
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest">{wizardStep === 'institution' ? 'Étape 1 : Identité' : wizardStep === 'faculties' ? 'Étape 2 : Composantes' : 'Étape 3 : Filières'}</p>
                      </div>
                   </div>
                   <button onClick={() => { setShowWizard(false); setSelectedMajor(null); }} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                   {wizardStep === 'institution' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white text-left">
                        <div className="space-y-6"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Type d'établissement</label><div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10"><button type="button" onClick={() => setIsSchoolKind(false)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isSchoolKind ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-500'}`}>Université</button><button type="button" onClick={() => setIsSchoolKind(true)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSchoolKind ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'text-gray-500'}`}>École / Institut</button></div></div>
                        <div className="space-y-6"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Statut</label><div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10"><button type="button" onClick={() => setEstablishmentStatus('Public')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${establishmentStatus === 'Public' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500'}`}>Public</button><button type="button" onClick={() => setEstablishmentStatus('Privé')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${establishmentStatus === 'Privé' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500'}`}>Privé</button></div></div>
                        <form onSubmit={handleInstitutionSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="md:col-span-2 space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Nom Complet</label><input name="name" defaultValue={currentUni?.name} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" /></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Sigle</label><input name="acronym" defaultValue={currentUni?.acronym} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" /></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Ville</label><input name="location" defaultValue={currentUni?.location} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" /></div><div className="md:col-span-2 pt-6"><button type="submit" disabled={isProcessing} className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all disabled:opacity-50">{isProcessing ? "Traitement..." : "Enregistrer & Continuer"}</button></div></form>
                     </div>
                   )}

                   {wizardStep === 'faculties' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white text-left">
                        <div className="text-center space-y-2"><h4 className="text-2xl font-black text-white tracking-tight leading-none">{isSchoolKind ? 'Départements' : 'Composantes'}</h4><p className="text-gray-500 font-medium text-sm">Ajoutez les entités rattachées.</p></div>
                        <form onSubmit={async (e) => { e.preventDefault(); setIsProcessing(true); const formRef = e.currentTarget; const fd = new FormData(formRef); try { if (!currentInstId) throw new Error("ID manquant."); await addFaculty({ university_id: parseInt(currentInstId), name: fd.get('fName') as string, description: 'Composante académique', type: isSchoolKind ? 'Ecole' : 'Faculté' }); formRef.reset(); await refreshData(); } catch (err: any) { alert("Erreur : " + err.message); } finally { setIsProcessing(false); } }} className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4"><input name="fName" required placeholder={isSchoolKind ? "Nom du département (ex: Génie Civil)" : "Nom de la composante (ex: EPAC, FASEG)"} className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" /><button type="submit" disabled={isProcessing} className="w-full py-3 border border-primary/20 text-primary font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all disabled:opacity-50">{isProcessing ? "Enregistrement..." : "+ Ajouter"}</button></form>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">{Array.isArray(currentUni?.faculties) && currentUni.faculties.map(f => (<div key={f.id} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5"><p className="font-black text-xs text-white uppercase tracking-wider">{f.name}</p><button onClick={() => deleteFaculty(f.id)} className="material-symbols-outlined text-red-400 text-sm hover:scale-110 transition-transform">delete</button></div>))}{(!currentUni?.faculties || currentUni.faculties.length === 0) && (<p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-widest py-4">Aucun élément ajouté</p>)}</div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5"><button onClick={() => setWizardStep('institution')} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Retour</button><button onClick={() => setWizardStep('majors')} className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">Suivant : Filières</button></div>
                     </div>
                   )}

                   {wizardStep === 'majors' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white text-left">
                        <div className="text-center space-y-2"><h4 className="text-2xl font-black text-white tracking-tight leading-none">{isEditing && selectedMajor ? 'Édition Filière' : 'Filières & Formations'}</h4><p className="text-gray-500 font-medium text-sm">Établissement : <span className="text-primary font-black">{currentUni?.name}</span></p></div>
                        <form onSubmit={async (e) => {
                           e.preventDefault(); setIsProcessing(true); const formRef = e.currentTarget; const fd = new FormData(formRef);
                           try {
                             if (!currentInstId) throw new Error("ID institution manquant.");
                             // On utilise des clés camelCase pour correspondre à l'interface frontend attendue par CMSContext
                             const majorPayload: any = {
                               universityId: currentInstId,
                               facultyId: fd.get('faculty_id') ? (fd.get('faculty_id') as string) : null,
                               name: fd.get('name') as string,
                               domain: fd.get('domain') as string,
                               level: fd.get('level') as string,
                               duration: fd.get('duration') as string,
                               fees: fd.get('fees') as string,
                               location: currentUni?.location || 'Bénin',
                               careerProspects: prospects.map(p => ({ title: p, icon: 'work' })),
                               requiredDiplomas: diplomas.map(d => ({ name: d, icon: 'school' })),
                             };
                             if (isEditing && selectedMajor) { await updateMajor({ ...selectedMajor, ...majorPayload }); } 
                             else { await addMajor(majorPayload); }
                             formRef.reset(); setSelectedMajor(null); setProspects([]); setDiplomas([]); if (isEditing) setShowWizard(false); await refreshData();
                           } catch (err: any) { alert("Erreur : " + err.message); } finally { setIsProcessing(false); }
                        }} className="p-8 bg-white/5 rounded-[32px] border border-white/5 space-y-6">
                           <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Rattachement</label><select name="faculty_id" required defaultValue={selectedMajor?.facultyId || ""} className="w-full p-4 rounded-xl bg-[#162a1f] border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20"><option value="" disabled>Sélectionnez...</option>{Array.isArray(currentUni?.faculties) && currentUni.faculties.map(f => (<option key={f.id} value={f.id}>{f.name}</option>))}</select></div>
                           <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Nom de la filière</label><input name="name" required defaultValue={selectedMajor?.name} placeholder="ex: Génie Logiciel" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" /></div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Domaine</label><input name="domain" required defaultValue={selectedMajor?.domain} placeholder="Informatique" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" /></div>
                              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Niveau</label><select name="level" defaultValue={selectedMajor?.level || "Licence"} className="w-full p-4 rounded-xl bg-[#162a1f] border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20"><option value="Licence">Licence</option><option value="Master">Master</option><option value="Doctorat">Doctorat</option></select></div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Durée</label><input name="duration" required defaultValue={selectedMajor?.duration} className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" /></div>
                              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">Scolarité</label><input name="fees" required defaultValue={selectedMajor?.fees} className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" /></div>
                           </div>

                           <div className="space-y-4 pt-4 border-t border-white/5">
                             <label className="text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2"><span className="material-symbols-outlined text-sm">work</span> Débouchés (Métiers)</label>
                             <div className="flex gap-2">
                               <input value={newProspect} onChange={(e) => setNewProspect(e.target.value)} placeholder="ex: Développeur Web" className="flex-1 p-3 rounded-xl bg-white/5 border-none text-xs font-bold text-white outline-none focus:ring-1 focus:ring-primary/20" />
                               <button type="button" onClick={addProspect} className="px-4 bg-primary text-black rounded-xl font-black text-[10px] uppercase">Ajouter</button>
                             </div>
                             <div className="flex flex-wrap gap-2">
                               {prospects.map((p, i) => (
                                 <div key={i} className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-2">
                                   {p} <button type="button" onClick={() => removeProspect(i)} className="material-symbols-outlined text-xs hover:text-red-500">close</button>
                                 </div>
                               ))}
                             </div>
                           </div>

                           <div className="space-y-4 pt-4 border-t border-white/5">
                             <label className="text-[10px] font-black uppercase text-amber-400 tracking-[0.2em] flex items-center gap-2"><span className="material-symbols-outlined text-sm">school</span> Diplômes Requis</label>
                             <div className="flex gap-2">
                               <input value={newDiploma} onChange={(e) => setNewDiploma(e.target.value)} placeholder="ex: BAC C ou D" className="flex-1 p-3 rounded-xl bg-white/5 border-none text-xs font-bold text-white outline-none focus:ring-1 focus:ring-amber-400/20" />
                               <button type="button" onClick={addDiploma} className="px-4 bg-amber-400 text-black rounded-xl font-black text-[10px] uppercase">Ajouter</button>
                             </div>
                             <div className="flex flex-wrap gap-2">
                               {diplomas.map((d, i) => (
                                 <div key={i} className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-2">
                                   {d} <button type="button" onClick={() => removeDiploma(i)} className="material-symbols-outlined text-xs hover:text-red-500">close</button>
                                 </div>
                               ))}
                             </div>
                           </div>

                           <button type="submit" disabled={isProcessing} className="w-full py-4 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50">{isProcessing ? "Enregistrement..." : isEditing ? "Mettre à jour la filière" : "+ Créer la filière"}</button>
                        </form>
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">{!isEditing && (<button onClick={() => setWizardStep('faculties')} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Retour</button>)}<button onClick={() => { setShowWizard(false); setSelectedMajor(null); refreshData(); }} className="flex-1 py-4 bg-white/5 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-white/5">{isEditing ? "Annuler" : "Terminer"}</button></div>
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
