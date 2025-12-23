
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

  // CSV Parsing Logic - Advanced with delimiter detection
  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('parsing');
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/);
      if (lines.length < 2) return;

      const firstLine = lines[0];
      const delimiter = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';
      const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
      const result: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const currentLine = line.split(delimiter);
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
    const currentUnis = [...universities];

    bulkData.forEach(row => {
      let uni = currentUnis.find(u => u.acronym.toLowerCase() === row.sigle_inst?.toLowerCase());
      let uniId = uni?.id;

      if (!uni && row.sigle_inst) {
        uniId = 'uni-' + Math.random().toString(36).substr(2, 9);
        const newUni: University = {
          id: uniId,
          name: row.nom_inst || row.sigle_inst,
          acronym: row.sigle_inst,
          location: row.ville || 'Bénin',
          type: (row.statut_inst?.toLowerCase().includes('priv') ? 'Privé' : 'Public'),
          isStandaloneSchool: row.type_inst?.toUpperCase() === 'E',
          logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100',
          cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
          description: "Établissement importé massivement.",
          stats: { students: 'N/A', majors: 1, founded: '2024', ranking: 'N/A' },
          faculties: row.nom_faculte ? [{
            id: 'fac-' + Math.random().toString(36).substr(2, 5),
            name: row.nom_faculte,
            description: 'Faculté importée',
            levels: [row.cycle || 'Licence']
          }] : []
        };
        addUniversity(newUni);
        currentUnis.push(newUni);
        uniCount++;
        uni = newUni;
      } else if (uni && row.nom_faculte) {
        const facExists = uni.faculties.find(f => f.name.toLowerCase() === row.nom_faculte.toLowerCase());
        if (!facExists) {
          const updatedUni = {
            ...uni,
            faculties: [...uni.faculties, {
              id: 'fac-' + Math.random().toString(36).substr(2, 5),
              name: row.nom_faculte,
              description: 'Ajoutée par import',
              levels: [row.cycle || 'Licence']
            }]
          };
          updateUniversity(updatedUni);
          const idx = currentUnis.findIndex(u => u.id === uni?.id);
          if (idx !== -1) currentUnis[idx] = updatedUni;
        }
      }

      if (row.nom_filiere && (uniId || uni?.id)) {
        const major: Major = {
          id: 'maj-' + Math.random().toString(36).substr(2, 9),
          name: row.nom_filiere,
          universityId: uniId || uni?.id || '',
          universityName: row.sigle_inst || uni?.acronym || '',
          facultyName: row.nom_faculte || 'Général',
          domain: row.domaine || 'Académique',
          level: (['Licence', 'Master', 'Doctorat'].includes(row.cycle) ? row.cycle : 'Licence') as any,
          duration: row.duree || '3 Ans',
          fees: row.frais || 'N/A',
          location: row.ville || uni?.location || 'Bénin',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
          careerProspects: row.debouche ? row.debouche.split(',').map((d: string) => ({ title: d.trim(), icon: 'work' })) : [{ title: 'Formation Pro', icon: 'work' }],
          requiredDiplomas: row.diplome ? row.diplome.split(',').map((d: string) => ({ name: d.trim(), icon: 'school' })) : [{ name: 'BAC', icon: 'school' }]
        };
        addMajor(major);
        majorCount++;
      }
    });

    alert(`Importation réussie : ${uniCount} établissements et ${majorCount} filières créés.`);
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
                    <p className="text-gray-400 font-medium max-w-lg">Interface de gestion unifiée.</p>
                 </div>
                 <span className="material-symbols-outlined text-[120px] opacity-10 absolute -right-10 top-0">security</span>
              </div>
            </div>
          )}

          {activeView === 'applications' && (
            <div className="space-y-8 animate-fade-in">
               <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Gestion des Candidatures ({applications.length})</h2>
               <div className="grid grid-cols-1 gap-4">
                  {applications.map(app => (
                    <div key={app.id} onClick={() => setSelectedApp(app)} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="size-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                             <span className="material-symbols-outlined">description</span>
                          </div>
                          <div>
                             <h4 className="font-black dark:text-white">{app.studentName}</h4>
                             <p className="text-xs text-gray-500 font-bold">{app.majorName} • {app.universityName}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            app.status === 'Validé' ? 'bg-primary/10 text-primary' : app.status === 'Rejeté' ? 'bg-red-500/10 text-red-500' : 'bg-amber-400/10 text-amber-500'
                          }`}>{app.status}</span>
                          <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeView === 'catalog' && (
            <div className="space-y-8 animate-fade-in">
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
                              <div className="space-y-1 flex-1 text-left">
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
                      <button onClick={() => { setShowWizard(true); setWizardStep('institution'); setCurrentInstId(null); setIsEditing(false); }} className="min-h-[140px] flex items-center justify-center gap-6 rounded-[32px] border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all group">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl font-bold">add</span>
                        </div>
                        <span className="font-black uppercase text-[10px] tracking-widest text-primary">Nouvel établissement</span>
                      </button>
                    </div>
                  </div>
               )}

               {activeCatalogSection === 'majors' && (
                  <div className="bg-[#0d1b13] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pagedMajors.map(major => (
                           <div key={major.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex flex-col justify-between group hover:bg-white/10 transition-all h-full text-left">
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
                  </div>
               )}
            </div>
          )}

          {activeView === 'cms' && (
            <div className="space-y-8 animate-fade-in">
               <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Gestion CMS</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 space-y-6">
                     <h3 className="text-xl font-black dark:text-white">Langues actives</h3>
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
               <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Paramètres</h2>
               <div className="bg-white dark:bg-surface-dark p-10 rounded-[48px] border border-gray-100 dark:border-white/5">
                  <p className="text-gray-400 font-bold italic">Aucune configuration supplémentaire requise pour le moment.</p>
               </div>
            </div>
          )}
        </div>

        {/* MODALS SECTION */}

        {/* BULK IMPORT MODAL */}
        {showBulkImport && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-[#162a1f] w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/5 flex flex-col max-h-[90vh]">
                <div className="bg-white/5 px-10 py-8 flex items-center justify-between border-b border-white/5 shrink-0">
                   <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Importation Massive Globale</h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Établissements, Facultés et Filières en une seule étape</p>
                   </div>
                   <button onClick={() => { setShowBulkImport(false); setBulkData([]); setImportStatus('idle'); }} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar text-center">
                   {importStatus === 'idle' && (
                      <div className="space-y-10 py-6">
                         <div className="max-w-xl mx-auto p-12 rounded-[40px] border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer bg-white/5" onClick={() => fileInputRef.current?.click()}>
                            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6"><span className="material-symbols-outlined text-5xl">upload_file</span></div>
                            <p className="text-white font-black uppercase text-xs tracking-widest">Cliquez pour charger le CSV</p>
                            <p className="text-gray-500 text-[10px] mt-2 font-bold italic">Le format doit être : type_inst;statut_inst;nom_inst;sigle_inst;ville...</p>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleBulkFileChange} />
                         </div>
                      </div>
                   )}
                   {importStatus === 'ready' && (
                      <div className="space-y-8 animate-in fade-in">
                         <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                            <h4 className="text-white font-black uppercase text-xs tracking-widest">Données prêtes : {bulkData.length} lignes</h4>
                            <button onClick={processBulkImport} className="px-10 py-4 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Lancer l'importation</button>
                         </div>
                         <div className="overflow-x-auto rounded-[32px] border border-white/5 shadow-2xl">
                            <table className="w-full text-left text-[11px] text-gray-400 font-bold border-collapse">
                               <thead className="bg-[#0d1b13] text-primary uppercase tracking-widest">
                                  <tr><th className="p-5">Établissement</th><th className="p-5">Filière</th><th className="p-5">Ville</th></tr>
                               </thead>
                               <tbody className="divide-y divide-white/5 bg-white/5">
                                  {bulkData.slice(0, 8).map((row, i) => (
                                     <tr key={i} className="hover:bg-white/10 transition-colors">
                                        <td className="p-5 text-white font-black">{row.sigle_inst}</td>
                                        <td className="p-5 text-gray-300">{row.nom_filiere}</td>
                                        <td className="p-5">{row.ville}</td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* APPLICATION DOSSIER MODAL */}
        {selectedApp && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedApp(null)}>
             <div className="bg-white dark:bg-[#162a1f] w-full max-w-4xl rounded-[48px] overflow-hidden shadow-2xl my-auto animate-in zoom-in-95 duration-300 border border-white/5" onClick={(e) => e.stopPropagation()}>
                <div className="px-10 py-10 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div className="space-y-2 text-left">
                      <h3 className="text-3xl font-black dark:text-white tracking-tighter">Dossier de {selectedApp.studentName}</h3>
                      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Session 2024 • Soumis le {selectedApp.date}</p>
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

                <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
                   <div className="space-y-8">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/20 pb-2">Formation Demandée</h4>
                        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-3">
                           <p className="text-lg font-black dark:text-white leading-tight">{selectedApp.majorName}</p>
                           <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{selectedApp.universityName}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/20 pb-2">Pièces Jointes</h4>
                        <div className="grid grid-cols-1 gap-2">
                           {selectedApp.documents.map((doc, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                <p className="text-xs font-black dark:text-white truncate">{doc}</p>
                                <button onClick={() => setPreviewDoc(doc)} className="px-4 py-2 bg-primary/10 text-primary text-[9px] font-black rounded-lg">VOIR</button>
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>
                   <div className="space-y-10 pt-10 border-t lg:border-t-0 lg:border-l lg:pl-12 border-gray-100 dark:border-white/5 flex flex-col justify-end">
                      <button onClick={() => { deleteApplication(selectedApp.id); setSelectedApp(null); }} className="w-full py-5 text-red-500 font-black uppercase text-[10px] tracking-widest border border-red-500/20 rounded-2xl hover:bg-red-500/10 transition-all">Supprimer le Dossier</button>
                      <button onClick={() => setSelectedApp(null)} className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-2xl">Fermer la vue</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* MANUAL WIZARD MODAL */}
        {showWizard && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
             <div className="bg-[#162a1f] w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-300 border border-white/5">
                <div className="bg-white/5 px-10 py-8 flex items-center justify-between border-b border-white/5">
                   <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">{isEditing ? 'Modifier' : 'Nouvel'} Établissement</h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{wizardStep === 'institution' ? 'Identité' : wizardStep === 'faculties' ? 'Composantes' : 'Filières'}</p>
                   </div>
                   <button onClick={() => setShowWizard(false)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                <div className="p-12 text-white">
                   {wizardStep === 'institution' && (
                     <form onSubmit={(e) => {
                       e.preventDefault();
                       const fd = new FormData(e.currentTarget);
                       const id = isEditing && currentInstId ? currentInstId : 'uni-' + Date.now();
                       const data: University = {
                          id,
                          name: fd.get('name') as string,
                          acronym: fd.get('acronym') as string,
                          location: fd.get('location') as string,
                          type: establishmentStatus,
                          description: currentUni?.description || 'Formation académique.',
                          isStandaloneSchool: isSchoolKind,
                          logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100',
                          cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
                          stats: { students: '0', majors: 0, founded: '2024', ranking: 'N/A' },
                          faculties: currentUni?.faculties || []
                       };
                       if (isEditing) updateUniversity(data); else addUniversity(data);
                       setCurrentInstId(id);
                       setWizardStep('faculties');
                     }} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <button type="button" onClick={() => setIsSchoolKind(false)} className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${!isSchoolKind ? 'bg-primary text-black' : 'bg-white/5 text-gray-400'}`}>Université</button>
                           <button type="button" onClick={() => setIsSchoolKind(true)} className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${isSchoolKind ? 'bg-amber-400 text-black' : 'bg-white/5 text-gray-400'}`}>École / Institut</button>
                        </div>
                        <input name="name" placeholder="Nom Complet" defaultValue={currentUni?.name} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                        <div className="grid grid-cols-2 gap-4">
                           <input name="acronym" placeholder="Sigle" defaultValue={currentUni?.acronym} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold outline-none" />
                           <input name="location" placeholder="Ville" defaultValue={currentUni?.location} required className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold outline-none" />
                        </div>
                        <button type="submit" className="w-full py-5 bg-primary text-black font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl">Suivant</button>
                     </form>
                   )}
                   {wizardStep === 'faculties' && (
                     <div className="space-y-10 text-center">
                        <p className="text-gray-400 font-bold">Ajoutez les composantes rattachées à cet établissement.</p>
                        <form onSubmit={(e) => {
                           e.preventDefault();
                           const fd = new FormData(e.currentTarget);
                           if (currentUni) {
                              updateUniversity({...currentUni, faculties: [...currentUni.faculties, {
                                id: 'fac-'+Date.now(), name: fd.get('fn') as string, description: 'Formation', levels: ['Licence']
                              }]});
                              e.currentTarget.reset();
                           }
                        }} className="space-y-4">
                           <input name="fn" placeholder="Nom de l'entité (ex: FASEG, IFRI...)" className="w-full p-4 rounded-2xl bg-white/5 border-none font-bold outline-none" />
                           <button type="submit" className="w-full py-3 border border-primary/20 text-primary font-black rounded-xl text-[10px] uppercase">+ Ajouter</button>
                        </form>
                        <div className="flex gap-4 pt-10 border-t border-white/5">
                           <button onClick={() => setWizardStep('institution')} className="flex-1 text-gray-500 font-black text-[10px] uppercase">Retour</button>
                           <button onClick={() => setShowWizard(false)} className="flex-1 py-4 bg-primary text-black font-black rounded-2xl text-[10px] uppercase">Terminer</button>
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
