
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
  
  const [activeView, setActiveView] = useState<AdminView>('catalog'); // Default to catalog for easier testing
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

  // CSV Parsing Logic - IMPROVED with Semicolon support
  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('parsing');
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/); // Handle both \n and \r\n
      if (lines.length === 0) return;

      // Auto-detect delimiter: check first line for ; or ,
      const firstLine = lines[0];
      const delimiter = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';

      const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
      const result: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const currentLine = lines[i].split(delimiter);
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

      if (!uni && row.sigle_inst) {
        uniId = 'uni-' + Math.random().toString(36).substr(2, 9);
        const newUni: University = {
          id: uniId,
          name: row.nom_inst || row.sigle_inst,
          acronym: row.sigle_inst,
          location: row.ville || 'Bénin',
          type: (row.statut_inst?.toLowerCase().includes('priv') ? 'Privé' : 'Public'),
          isStandaloneSchool: row.type_inst === 'E',
          logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100',
          cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
          description: "Établissement importé via console.",
          stats: { students: 'N/A', majors: 0, founded: '2024', ranking: 'N/A' },
          faculties: row.nom_faculte ? [{
            id: 'fac-' + Math.random().toString(36).substr(2, 5),
            name: row.nom_faculte,
            description: 'Faculté importée',
            levels: [row.cycle || 'Licence']
          }] : []
        };
        addUniversity(newUni);
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
        }
      }

      // 2. Create Major
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
          careerProspects: [{ title: row.debouche || 'Formation Pro', icon: 'work' }],
          requiredDiplomas: [{ name: row.diplome || 'BAC', icon: 'school' }]
        };
        addMajor(major);
        majorCount++;
      }
    });

    alert(`Importation terminée : ${uniCount} nouveaux établissements et ${majorCount} filières synchronisées.`);
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
                  </div>
               )}
            </div>
          )}

          {activeView === 'applications' && (
             <div className="space-y-8 animate-fade-in">
                <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase">Flux de Candidatures</h2>
                <div className="grid grid-cols-1 gap-4">
                   {applications.map(app => (
                      <div key={app.id} onClick={() => setSelectedApp(app)} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all">
                         <div className="flex items-center gap-6">
                            <div className="size-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                               <span className="material-symbols-outlined">description</span>
                            </div>
                            <div>
                               <h4 className="font-black dark:text-white">{app.studentName}</h4>
                               <p className="text-xs text-gray-500">{app.majorName}</p>
                            </div>
                         </div>
                         <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">{app.status}</span>
                      </div>
                   ))}
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
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Soutient CSV (;) et (,) • Auto-détection active</p>
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
                            <p className="text-gray-500 text-[10px] mt-2 font-bold italic">Format supporté : type_inst;statut_inst;nom_inst;sigle_inst;ville...</p>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleBulkFileChange} />
                         </div>
                         
                         <div className="bg-black/40 p-8 rounded-[32px] text-left border border-white/5 space-y-6">
                            <div className="flex items-center gap-3">
                               <span className="material-symbols-outlined text-primary">list_alt</span>
                               <h4 className="text-primary font-black uppercase text-[11px] tracking-widest">Aide Colonnes :</h4>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                               {[
                                 'type_inst (U/E)', 'statut_inst', 'nom_inst', 'sigle_inst', 
                                 'ville', 'nom_faculte', 'nom_filiere', 'cycle', 
                                 'duree', 'frais', 'domaine', 'debouche', 'diplome'
                               ].map(c => (
                                  <div key={c} className="p-2.5 bg-white/5 rounded-xl text-[9px] font-bold text-gray-400 border border-white/5 flex items-center gap-2">
                                     <span className="size-1.5 rounded-full bg-primary/40"></span>
                                     {c}
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   )}

                   {importStatus === 'parsing' && (
                      <div className="py-24 flex flex-col items-center gap-6">
                         <div className="size-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                         <p className="text-white font-black uppercase text-xs tracking-[0.3em] animate-pulse">Détection du format...</p>
                      </div>
                   )}

                   {importStatus === 'ready' && (
                      <div className="space-y-8 animate-in fade-in">
                         <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                               <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
                               <h4 className="text-white font-black uppercase text-xs tracking-widest">Prêt pour import : {bulkData.length} lignes identifiées</h4>
                            </div>
                            <button onClick={() => { setBulkData([]); setImportStatus('idle'); }} className="px-6 py-2 bg-red-500/10 text-[10px] font-black text-red-400 uppercase tracking-widest rounded-lg border border-red-500/20">Changer fichier</button>
                         </div>
                         
                         <div className="overflow-x-auto rounded-[32px] border border-white/5 shadow-2xl">
                            <table className="w-full text-left text-[11px] text-gray-400 font-bold border-collapse">
                               <thead className="bg-[#0d1b13] text-primary uppercase tracking-widest">
                                  <tr>
                                     <th className="p-5">Établissement</th>
                                     <th className="p-5">Sigle</th>
                                     <th className="p-5">Filière</th>
                                     <th className="p-5">Cycle</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-white/5 bg-white/5">
                                  {bulkData.slice(0, 10).map((row, i) => (
                                     <tr key={i} className="hover:bg-white/10 transition-colors">
                                        <td className="p-5 text-white font-black">{row.nom_inst || '---'}</td>
                                        <td className="p-5">{row.sigle_inst || '---'}</td>
                                        <td className="p-5 text-gray-300">{row.nom_filiere || '---'}</td>
                                        <td className="p-5 text-primary">{row.cycle || '---'}</td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                         
                         <div className="flex gap-4 pt-4">
                            <button onClick={() => { setBulkData([]); setImportStatus('idle'); }} className="flex-1 py-5 bg-white/5 text-white font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Annuler</button>
                            <button onClick={processBulkImport} className="flex-1 py-5 bg-primary text-black font-black rounded-3xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all">Lancer l'Importation</button>
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
                   </div>
                   <button onClick={() => setShowWizard(false)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                <div className="p-12 text-white">Formulaire manuel non modifié ici...</div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
