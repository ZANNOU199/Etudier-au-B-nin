
import React, { useState, useMemo, useRef } from 'react';
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
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  
  const [establishmentFilter, setEstablishmentFilter] = useState<EstablishmentFilter>('all');
  const [uniPage, setUniPage] = useState(1);
  const [majorPage, setMajorPage] = useState(1);
  
  // States for Creation/Edit Wizard
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<CreationStep>('institution');
  const [currentInstId, setCurrentInstId] = useState<string | null>(null);
  const [isSchoolKind, setIsSchoolKind] = useState(false);
  const [establishmentStatus, setEstablishmentStatus] = useState<'Public' | 'Privé'>('Public');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWizardLevel, setSelectedWizardLevel] = useState<'Licence' | 'Master' | 'Doctorat'>('Licence');
  
  // Bulk Import State
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'parsing' | 'ready'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for single Major editing
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);

  const navigate = useNavigate();

  const filteredUnis = useMemo(() => {
    return universities.filter(u => {
      if (establishmentFilter === 'university') return !u.isStandaloneSchool;
      if (establishmentFilter === 'school') return u.isStandaloneSchool;
      return true;
    });
  }, [universities, establishmentFilter]);

  const totalUniPages = Math.ceil(filteredUnis.length / UNI_PER_PAGE);
  const pagedUnis = filteredUnis.slice((uniPage - 1) * UNI_PER_PAGE, uniPage * UNI_PER_PAGE);

  const totalMajorPages = Math.ceil(majors.length / MAJOR_PER_PAGE);
  const pagedMajors = majors.slice((majorPage - 1) * MAJOR_PER_PAGE, majorPage * MAJOR_PER_PAGE);

  const currentUni = useMemo(() => universities.find(u => u.id === currentInstId), [universities, currentInstId]);
  const currentInstMajors = useMemo(() => majors.filter(m => m.universityId === currentInstId), [majors, currentInstId]);

  const openWizardForEdit = (uni: University) => {
    setCurrentInstId(uni.id);
    setIsSchoolKind(!!uni.isStandaloneSchool);
    setEstablishmentStatus(uni.type);
    setIsEditing(true);
    setWizardStep('institution');
    setShowWizard(true);
  };

  // CSV Parsing Logic - Advanced Global Import
  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('parsing');
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const result: any[] = [];
      const headers = lines[0].split(',').map(h => h.trim());

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const currentLine = lines[i].split(',');
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = currentLine[index]?.trim();
        });
        result.push(obj);
      }
      setBulkData(result);
      setImportStatus('ready');
    };
    reader.readAsText(file);
  };

  const processBulkImport = () => {
    let uniCount = 0;
    let majorCount = 0;

    bulkData.forEach(row => {
      // 1. Identify or Create University
      let uni = universities.find(u => u.acronym.toLowerCase() === row.sigle_inst?.toLowerCase());
      let uniId = uni?.id;

      if (!uni) {
        uniId = 'uni-' + Math.random().toString(36).substr(2, 9);
        const newUni: University = {
          id: uniId,
          name: row.nom_inst || 'Nouvel Établissement',
          acronym: row.sigle_inst || 'SIGLE',
          location: row.ville || 'Bénin',
          type: (row.statut_inst === 'Privé' ? 'Privé' : 'Public'),
          isStandaloneSchool: row.type_inst === 'E',
          logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100',
          cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
          description: "Établissement importé via console.",
          stats: { students: '0', majors: 0, founded: '2024', ranking: 'N/A' },
          faculties: row.nom_faculte ? [{
            id: 'fac-' + Math.random().toString(36).substr(2, 5),
            name: row.nom_faculte,
            description: 'Faculté importée',
            levels: ['Licence']
          }] : []
        };
        addUniversity(newUni);
        uniCount++;
        uni = newUni; // Reference for major creation
      } else if (row.nom_faculte) {
        // Ensure faculty exists in existing uni
        const facExists = uni.faculties.find(f => f.name === row.nom_faculte);
        if (!facExists) {
          const updatedUni = {
            ...uni,
            faculties: [...uni.faculties, {
              id: 'fac-' + Math.random().toString(36).substr(2, 5),
              name: row.nom_faculte,
              description: 'Faculté ajoutée par import',
              levels: ['Licence']
            }]
          };
          updateUniversity(updatedUni);
        }
      }

      // 2. Create Major
      if (row.nom_filiere) {
        const major: Major = {
          id: 'maj-' + Math.random().toString(36).substr(2, 9),
          name: row.nom_filiere,
          universityId: uniId || '',
          universityName: row.sigle_inst || uni.acronym,
          facultyName: row.nom_faculte || 'Principal',
          domain: row.domaine || 'Général',
          level: (['Licence', 'Master', 'Doctorat'].includes(row.cycle) ? row.cycle : 'Licence') as any,
          duration: row.duree || '3 Ans',
          fees: row.frais || 'N/A',
          location: row.ville || uni.location,
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400',
          careerProspects: [{ title: row.debouche || 'Divers', icon: 'work' }],
          requiredDiplomas: [{ name: row.diplome || 'BAC', icon: 'school' }]
        };
        addMajor(major);
        majorCount++;
      }
    });

    alert(`Importation réussie : ${uniCount} établissements créés et ${majorCount} filières ajoutées.`);
    setShowBulkImport(false);
    setBulkData([]);
    setImportStatus('idle');
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
               <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Flux de Candidatures ({applications.length})</h2>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <div key={app.id} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedApp(app)}>
                         <div className="flex items-center gap-6 flex-1 w-full">
                            <div className="size-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                               <span className="material-symbols-outlined text-2xl">description</span>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-primary uppercase tracking-widest">{app.id}</p>
                               <h4 className="text-lg font-black dark:text-white leading-tight">{app.studentName}</h4>
                               <p className="text-xs font-bold text-gray-500">{app.majorName} • {app.universityName}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="text-right hidden sm:block">
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date de soumission</p>
                               <p className="text-xs font-bold dark:text-white">{app.date}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 ${
                               app.status === 'Validé' ? 'text-primary bg-primary/10' : 
                               app.status === 'Rejeté' ? 'text-red-500 bg-red-500/10' : 
                               'text-amber-500 bg-amber-500/10'
                            }`}>
                               {app.status}
                            </span>
                            <button className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-all">
                               <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-[40px] border border-dashed border-gray-100 dark:border-white/5">
                       <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">folder_open</span>
                       <p className="text-gray-400 font-bold">Aucune candidature n'a été soumise pour le moment.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeView === 'catalog' && (
            <div className="space-y-8 animate-fade-in">
               {/* Main Catalog Header - Import Button always visible here */}
               <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-black dark:text-white tracking-tighter uppercase">Catalogue Académique</h2>
                    <div className="flex gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 w-fit">
                      <button onClick={() => setActiveCatalogSection('universities')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'universities' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Universités & Écoles</button>
                      <button onClick={() => setActiveCatalogSection('majors')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCatalogSection === 'majors' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}>Filières</button>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full lg:w-auto">
                    <button 
                      onClick={() => setShowBulkImport(true)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-[#0d1b13] text-primary border border-primary/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all shadow-xl shadow-primary/10"
                    >
                      <span className="material-symbols-outlined text-xl">table_chart</span>
                      Import Massive (CSV)
                    </button>
                    
                    {activeCatalogSection === 'universities' && (
                      <div className="hidden sm:flex gap-2 bg-gray-50 dark:bg-white/5 p-1 rounded-xl border border-gray-100 dark:border-white/10 h-fit self-center">
                        {['all', 'university', 'school'].map(f => (
                          <button key={f} onClick={() => { setEstablishmentFilter(f as EstablishmentFilter); setUniPage(1); }} className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${establishmentFilter === f ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm' : 'text-gray-400 hover:text-primary'}`}>
                            {f === 'all' ? 'Tout' : f === 'university' ? 'Universités' : 'Écoles'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
               </div>

               {activeCatalogSection === 'universities' && (
                  <div className="bg-[#0d1b13] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pagedUnis.map(uni => (
                        <div key={uni.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/10 transition-all h-full">
                           <div className="flex items-center gap-6 flex-1 w-full">
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
                              <button onClick={() => openWizardForEdit(uni)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-primary flex items-center justify-center transition-all border border-white/5">
                                 <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button onClick={() => deleteUniversity(uni.id)} className="size-11 rounded-xl bg-white/5 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all border border-white/5">
                                 <span className="material-symbols-outlined">delete</span>
                              </button>
                           </div>
                        </div>
                      ))}
                      
                      <button onClick={() => { setShowWizard(true); setWizardStep('institution'); setCurrentInstId(null); setIsEditing(false); setEstablishmentStatus('Public'); }} className="min-h-[140px] flex items-center justify-center gap-6 rounded-[32px] border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all group">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl font-bold">add</span>
                        </div>
                        <span className="font-black uppercase text-[10px] tracking-[0.2em] text-primary">Nouvel établissement</span>
                      </button>
                    </div>

                    {totalUniPages > 1 && (
                      <div className="flex justify-center items-center gap-3 pt-6 border-t border-white/5">
                         {Array.from({ length: totalUniPages }).map((_, i) => (
                           <button key={i} onClick={() => setUniPage(i + 1)} className={`size-12 rounded-2xl font-black text-xs transition-all border ${uniPage === i + 1 ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-white hover:border-primary'}`}>{i + 1}</button>
                         ))}
                      </div>
                    )}
                  </div>
               )}

               {activeCatalogSection === 'majors' && (
                  <div className="bg-[#0d1b13] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pagedMajors.map(major => (
                           <div key={major.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex flex-col justify-between group hover:bg-white/10 transition-all h-full">
                              <div className="flex items-center gap-4 mb-6">
                                 <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase">{major.level[0]}</div>
                                 <div className="space-y-1">
                                    <h3 className="text-lg font-black text-white tracking-tight leading-none">{major.name}</h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{major.universityName}</p>
                                 </div>
                              </div>
                              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                 <span className="text-primary font-black text-xs">{major.fees}</span>
                                 <div className="flex gap-4">
                                   <button onClick={() => setEditingMajor(major)} className="text-gray-500 hover:text-primary transition-colors">
                                      <span className="material-symbols-outlined text-lg">edit</span>
                                   </button>
                                   <button onClick={() => deleteMajor(major.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                      <span className="material-symbols-outlined text-lg">delete</span>
                                   </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                     {totalMajorPages > 1 && (
                        <div className="flex justify-center items-center gap-3 pt-6 border-t border-white/5">
                           {Array.from({ length: totalMajorPages }).map((_, i) => (
                              <button key={i} onClick={() => setMajorPage(i + 1)} className={`size-12 rounded-2xl font-black text-xs transition-all border ${majorPage === i + 1 ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white'}`}>{i + 1}</button>
                           ))}
                        </div>
                     )}
                  </div>
               )}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-400">
                     <p>Aucun paramètre à configurer pour le moment.</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* MODAL: BULK IMPORT (GLOBAL) */}
        {showBulkImport && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-[#162a1f] w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/5 flex flex-col max-h-[90vh]">
                <div className="bg-white/5 px-10 py-8 flex items-center justify-between border-b border-white/5 shrink-0">
                   <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Importation Globale Académique</h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Établissements, Facultés et Filières en une seule étape</p>
                   </div>
                   <button onClick={() => { setShowBulkImport(false); setBulkData([]); setImportStatus('idle'); }} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                   {importStatus === 'idle' && (
                      <div className="space-y-10 text-center py-6">
                         <div className="max-w-xl mx-auto p-12 rounded-[40px] border-2 border-dashed border-white/10 hover:border-primary/50 transition-all group cursor-pointer bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined text-5xl font-bold">upload_file</span>
                            </div>
                            <p className="text-white font-black uppercase text-xs tracking-widest">Glissez votre fichier CSV Global</p>
                            <p className="text-gray-500 text-[10px] mt-2 font-bold italic">Le système créera automatiquement les établissements s'ils n'existent pas.</p>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleBulkFileChange} />
                         </div>
                         
                         <div className="bg-black/40 p-8 rounded-[32px] text-left border border-white/5 space-y-6">
                            <div className="flex items-center gap-3">
                               <span className="material-symbols-outlined text-primary">list_alt</span>
                               <h4 className="text-primary font-black uppercase text-[11px] tracking-widest">Structure attendue des colonnes (13 colonnes) :</h4>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                               {[
                                 'type_inst (U/E)', 'statut_inst (P/Pr)', 'nom_inst', 'sigle_inst', 
                                 'ville', 'nom_faculte', 'nom_filiere', 'cycle', 
                                 'duree', 'frais', 'domaine', 'debouche', 'diplome'
                               ].map(c => (
                                  <div key={c} className="p-2.5 bg-white/5 rounded-xl text-[9px] font-bold text-gray-400 border border-white/5 flex items-center gap-2">
                                     <span className="size-1.5 rounded-full bg-primary/40"></span>
                                     {c}
                                  </div>
                               ))}
                            </div>
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                               <p className="text-[10px] text-primary font-black uppercase leading-relaxed">
                                 CONSEIL : Utilisez le sigle (ex: UAC, HECM) pour relier plusieurs filières au même établissement.
                               </p>
                            </div>
                         </div>
                      </div>
                   )}

                   {importStatus === 'parsing' && (
                      <div className="py-24 flex flex-col items-center gap-6">
                         <div className="size-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                         <p className="text-white font-black uppercase text-xs tracking-[0.3em] animate-pulse">Analyse structurelle des données...</p>
                      </div>
                   )}

                   {importStatus === 'ready' && (
                      <div className="space-y-8 animate-in fade-in">
                         <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                               <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
                               <h4 className="text-white font-black uppercase text-xs tracking-widest">Fichier validé : {bulkData.length} lignes identifiées</h4>
                            </div>
                            <button onClick={() => { setBulkData([]); setImportStatus('idle'); }} className="px-6 py-2 bg-red-500/10 text-[10px] font-black text-red-400 uppercase tracking-widest rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Recommencer</button>
                         </div>
                         
                         <div className="overflow-x-auto rounded-[32px] border border-white/5 shadow-2xl">
                            <table className="w-full text-left text-[11px] text-gray-400 font-bold border-collapse">
                               <thead className="bg-[#0d1b13] text-primary uppercase tracking-widest">
                                  <tr>
                                     <th className="p-5">Établissement</th>
                                     <th className="p-5">Faculté / École</th>
                                     <th className="p-5">Filière</th>
                                     <th className="p-5">Localisation</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-white/5 bg-white/5">
                                  {bulkData.slice(0, 10).map((row, i) => (
                                     <tr key={i} className="hover:bg-white/10 transition-colors">
                                        <td className="p-5">
                                          <div className="flex items-center gap-2">
                                            <span className="size-6 bg-primary/20 text-primary rounded-md flex items-center justify-center text-[9px]">{row.type_inst}</span>
                                            <span className="text-white font-black">{row.sigle_inst}</span>
                                          </div>
                                        </td>
                                        <td className="p-5 italic">{row.nom_faculte || 'Principal'}</td>
                                        <td className="p-5 text-gray-200">{row.nom_filiere}</td>
                                        <td className="p-5 text-[10px] uppercase">{row.ville}</td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                         {bulkData.length > 10 && <p className="text-center text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">... + {bulkData.length - 10} entrées supplémentaires</p>}
                         
                         <div className="flex gap-4 pt-4">
                            <button onClick={() => { setBulkData([]); setImportStatus('idle'); }} className="flex-1 py-5 bg-white/5 text-white font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Annuler l'opération</button>
                            <button onClick={processBulkImport} className="flex-1 py-5 bg-primary text-black font-black rounded-3xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all">Démarrer l'importation global</button>
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* MODAL: INSTITUTION WIZARD */}
        {showWizard && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-300 border border-white/5">
                <div className="bg-white/5 px-10 py-8 flex items-center justify-between border-b border-white/5">
                   <div>
                      <h3 className="text-2xl font-black text-white tracking-tight leading-none">{isEditing ? 'Modifier' : 'Nouvel'} Établissement</h3>
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
                   {wizardStep === 'institution' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white">
                        <div className="space-y-6">
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Type d'établissement</label>
                           <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                              <button type="button" onClick={() => setIsSchoolKind(false)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isSchoolKind ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-500'}`}>Université</button>
                              <button type="button" onClick={() => setIsSchoolKind(true)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSchoolKind ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'text-gray-500'}`}>École / Institut</button>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Statut de l'établissement</label>
                           <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                              <button type="button" onClick={() => setEstablishmentStatus('Public')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${establishmentStatus === 'Public' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500'}`}>Public</button>
                              <button type="button" onClick={() => setEstablishmentStatus('Privé')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${establishmentStatus === 'Privé' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500'}`}>Privé</button>
                           </div>
                        </div>

                        <form onSubmit={(e) => {
                           e.preventDefault();
                           const fd = new FormData(e.currentTarget);
                           const id = isEditing && currentInstId ? currentInstId : ((isSchoolKind ? 'sch-' : 'uni-') + Date.now());
                           
                           const data: University = {
                              id,
                              name: fd.get('name') as string,
                              acronym: fd.get('acronym') as string,
                              location: fd.get('location') as string,
                              type: establishmentStatus,
                              description: currentUni?.description || 'Établissement académique.',
                              isStandaloneSchool: isSchoolKind,
                              logo: currentUni?.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100',
                              cover: currentUni?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
                              stats: currentUni?.stats || { students: '0', majors: 0, founded: '2024', ranking: 'N/A' },
                              faculties: currentUni?.faculties || []
                           };

                           if (isEditing) {
                              updateUniversity(data);
                           } else {
                              addUniversity(data);
                           }
                           
                           setCurrentInstId(id);
                           setWizardStep(!isSchoolKind ? 'faculties' : 'majors');
                        }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">Continuer</button>
                           </div>
                        </form>
                     </div>
                   )}
                   {wizardStep === 'faculties' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 text-white">
                        <div className="text-center space-y-2">
                           <h4 className="text-2xl font-black text-white tracking-tight leading-none">Composantes internes</h4>
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
                        <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                           {currentUni?.faculties.map(f => (
                              <div key={f.id} className="p-3 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5">
                                 <p className="font-black text-xs text-white">{f.name}</p>
                                 <button onClick={() => {
                                   if (currentUni) {
                                      updateUniversity({...currentUni, faculties: currentUni.faculties.filter(fac => fac.id !== f.id)});
                                   }
                                 }} className="material-symbols-outlined text-red-400 text-sm">delete</button>
                              </div>
                           ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                           <button onClick={() => setWizardStep('institution')} className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest">Retour</button>
                           <button onClick={() => setWizardStep('majors')} disabled={!currentUni?.faculties.length} className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20">Configurer les filières</button>
                        </div>
                     </div>
                   )}
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
                              facultyName: fd.get('facultySelect') as string || 'Principal',
                              domain: fd.get('domain') as string || 'Général',
                              level: selectedWizardLevel,
                              duration: fd.get('duration') as string || '3 Ans',
                              fees: fd.get('fees') as string || '0 FCFA',
                              location: currentUni?.location || 'Bénin',
                              image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
                              careerProspects: [{ title: fd.get('career') as string, icon: 'work' }],
                              requiredDiplomas: [{ name: fd.get('diploma') as string, icon: 'school' }]
                           };
                           addMajor(majorData);
                           e.currentTarget.reset();
                        }} className="space-y-6 p-6 bg-white/5 rounded-[32px] border border-white/5">
                           
                           {currentUni && currentUni.faculties.length > 0 && (
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Choix de l'école / faculté</label>
                                 <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-lg">domain</span>
                                    <select 
                                       name="facultySelect" 
                                       required 
                                       className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                    >
                                       {currentUni.faculties.map(f => (
                                          <option key={f.id} value={f.name} className="bg-[#162a1f] text-white">
                                             {f.name}
                                          </option>
                                       ))}
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 pointer-events-none">expand_more</span>
                                 </div>
                              </div>
                           )}

                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Nom de la filière</label>
                              <input name="mName" required placeholder="Ex: Informatique de Gestion" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white outline-none focus:ring-2 focus:ring-primary/20" />
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Cycle d'étude</label>
                              <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                                 {(['Licence', 'Master', 'Doctorat'] as const).map(l => (
                                    <button 
                                       type="button"
                                       key={l}
                                       onClick={() => setSelectedWizardLevel(l)}
                                       className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedWizardLevel === l ? 'bg-primary text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                       {l}
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Débouché principal</label>
                                 <input name="career" required placeholder="Ex: Développeur" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Diplôme requis</label>
                                 <input name="diploma" required placeholder="Ex: BAC C / D" className="w-full p-4 rounded-xl bg-white/5 border-none font-bold text-white" />
                              </div>
                           </div>
                           
                           <button type="submit" className="w-full py-4 bg-white/10 text-primary border border-primary/20 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all">Enregistrer la filière</button>
                        </form>

                        <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                           {currentInstMajors.map(m => (
                              <div key={m.id} className="p-3 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5">
                                 <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                       <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded text-primary uppercase">{m.level[0]}</span>
                                       <p className="font-black text-xs text-white">{m.name}</p>
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Établi: {m.facultyName}</p>
                                 </div>
                                 <button onClick={() => deleteMajor(m.id)} className="material-symbols-outlined text-red-400 text-sm">delete</button>
                              </div>
                           ))}
                        </div>
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

        {/* MODAL: SINGLE MAJOR EDIT */}
        {editingMajor && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-300 border border-white/5">
                <div className="bg-white/5 px-10 py-8 border-b border-white/5 flex justify-between items-center">
                   <h3 className="text-2xl font-black text-white tracking-tight">Modifier la filière</h3>
                   <button onClick={() => setEditingMajor(null)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                <div className="p-10 space-y-6">
                   <form onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      if (editingMajor) {
                        updateMajor({
                          ...editingMajor,
                          name: fd.get('name') as string,
                          fees: fd.get('fees') as string,
                          level: fd.get('level') as any,
                          duration: fd.get('duration') as string
                        });
                        setEditingMajor(null);
                      }
                   }} className="space-y-6 text-white">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Nom de la filière</label>
                        <input name="name" defaultValue={editingMajor.name} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Frais scolarité</label>
                          <input name="fees" defaultValue={editingMajor.fees} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Durée</label>
                          <input name="duration" defaultValue={editingMajor.duration} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Niveau</label>
                        <select name="level" defaultValue={editingMajor.level} className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold outline-none">
                          <option value="Licence">Licence</option>
                          <option value="Master">Master</option>
                          <option value="Doctorat">Doctorat</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl">Enregistrer les modifications</button>
                   </form>
                </div>
             </div>
          </div>
        )}

        {/* MODAL: APPLICATION DOSSIER */}
        {selectedApp && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedApp(null)}>
             <div className="bg-white dark:bg-[#162a1f] w-full max-w-4xl rounded-[48px] overflow-hidden shadow-2xl my-auto animate-in zoom-in-95 duration-300 border border-white/5" onClick={(e) => e.stopPropagation()}>
                <div className="px-10 py-10 bg-white dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">{selectedApp.id}</span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full">Session 2024</span>
                      </div>
                      <h3 className="text-3xl font-black dark:text-white tracking-tighter">Dossier de {selectedApp.studentName}</h3>
                      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Soumis le {selectedApp.date}</p>
                   </div>
                   <div className="flex flex-col items-end gap-3">
                      <select 
                        value={selectedApp.status}
                        onChange={(e) => {
                          updateApplicationStatus(selectedApp.id, e.target.value as any);
                          setSelectedApp({...selectedApp, status: e.target.value as any});
                        }}
                        className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-none focus:ring-4 outline-none transition-all ${
                          selectedApp.status === 'Validé' ? 'bg-primary text-black focus:ring-primary/20' : 
                          selectedApp.status === 'Rejeté' ? 'bg-red-500 text-white focus:ring-red-500/20' : 
                          'bg-amber-400 text-black focus:ring-amber-400/20'
                        }`}
                      >
                         <option value="En attente">En attente</option>
                         <option value="Validé">Approuvé (Validé)</option>
                         <option value="Rejeté">Refusé (Rejeté)</option>
                         <option value="En cours">En cours d'examen</option>
                      </select>
                   </div>
                </div>

                <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/20 pb-2">Formation Demandée</h4>
                        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-3">
                           <div className="flex items-center gap-4">
                              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined font-bold">school</span></div>
                              <div>
                                 <p className="text-lg font-black dark:text-white leading-tight">{selectedApp.majorName}</p>
                                 <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{selectedApp.universityName}</p>
                              </div>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/20 pb-2">Informations Candidat</h4>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">ID Étudiant</p>
                              <p className="text-xs font-black dark:text-white">{selectedApp.studentId}</p>
                           </div>
                           <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Cursus</p>
                              <p className="text-xs font-black dark:text-white">Nouveau Candidat</p>
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/20 pb-2">Pièces Justificatives ({selectedApp.documents.length})</h4>
                      <div className="grid grid-cols-1 gap-3">
                         {selectedApp.documents.map((doc, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 group hover:border-primary/40 transition-all">
                              <div className="flex items-center gap-4 overflow-hidden">
                                 <span className="material-symbols-outlined text-primary">description</span>
                                 <p className="text-xs font-black dark:text-white truncate">{doc}</p>
                              </div>
                              <button 
                                onClick={() => setPreviewDoc(doc)}
                                className="px-4 py-2 bg-white/10 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-black transition-all"
                              >
                                Voir
                              </button>
                           </div>
                         ))}
                      </div>
                      
                      <div className="pt-10 border-t border-gray-100 dark:border-white/5 flex gap-4">
                         <button onClick={() => { deleteApplication(selectedApp.id); setSelectedApp(null); }} className="flex-1 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/10 rounded-2xl transition-all border border-red-500/20">Supprimer Dossier</button>
                         <button onClick={() => setSelectedApp(null)} className="flex-1 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all">Fermer</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* MODAL: DOCUMENT PREVIEW */}
        {previewDoc && (
          <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setPreviewDoc(null)}>
             <div className="w-full max-w-5xl h-[85vh] bg-white dark:bg-[#0d1b13] rounded-[48px] overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-300 border border-white/10" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                   <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                         <span className="material-symbols-outlined font-bold">visibility</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black dark:text-white tracking-tight leading-none">{previewDoc}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Prévisualisation sécurisée</p>
                      </div>
                   </div>
                   <button onClick={() => setPreviewDoc(null)} className="size-11 rounded-xl bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-red-500 hover:text-white transition-all">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-12 bg-[#f0f2f1] dark:bg-black/20 flex justify-center">
                   <div className="w-full max-w-4xl bg-white dark:bg-surface-dark shadow-2xl p-12 md:p-20 min-h-[1000px] border border-gray-200 dark:border-white/5 flex flex-col gap-10">
                      <div className="flex justify-between items-start border-b-2 border-gray-100 dark:border-white/10 pb-10">
                         <div className="size-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-300">
                            <span className="material-symbols-outlined text-4xl">domain</span>
                         </div>
                         <div className="text-right space-y-1">
                            <p className="text-xs font-black dark:text-white uppercase tracking-widest">RÉPUBLIQUE DU BÉNIN</p>
                            <p className="text-[10px] font-bold text-gray-400">Ministère de l'Enseignement Supérieur</p>
                         </div>
                      </div>
                      <div className="py-20 flex flex-col items-center gap-10 text-center">
                         <span className="material-symbols-outlined text-[100px] text-primary/40">description</span>
                         <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">DOCUMENT NUMÉRISÉ</h2>
                         <p className="text-gray-400 font-medium max-w-md">Prévisualisation administrative du fichier {previewDoc}.</p>
                      </div>
                      <div className="mt-auto pt-10 border-t border-gray-100 dark:border-white/10 flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                         <p>EtudierAuBenin.com</p>
                         <p>Session 2024</p>
                      </div>
                   </div>
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex justify-center gap-4">
                   <button className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest dark:text-white hover:border-primary transition-all">
                      <span className="material-symbols-outlined text-sm">download</span>
                      Télécharger
                   </button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
