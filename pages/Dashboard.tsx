
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MAJORS } from '../constants';

const ITEMS_PER_PAGE = 4;

type DashboardTab = 'home' | 'catalogue' | 'applications' | 'profile';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('Toutes les villes');
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();

  // Données factices pour l'exemple
  const applications = [
    { 
      id: 'EAB-24-8932',
      majorId: 'uac-gl',
      uni: "UAC (EPAC)", 
      major: "Génie Logiciel", 
      status: "En cours", 
      date: "12 Oct 2023",
      color: "text-amber-500 bg-amber-500/10",
      icon: "hourglass_empty"
    },
    { 
      id: 'EAB-24-9102',
      majorId: 'hecm-mark',
      uni: "HECM Cotonou", 
      major: "Marketing MAC", 
      status: "Validé", 
      date: "15 Oct 2023",
      color: "text-primary bg-primary/10",
      icon: "check_circle"
    }
  ];

  const filteredMajors = useMemo(() => {
    return MAJORS.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
                           m.name.toLowerCase().includes(q) || 
                           m.domain.toLowerCase().includes(q) ||
                           m.universityName.toLowerCase().includes(q);
      const matchesCity = cityFilter === 'Toutes les villes' || m.location === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [searchQuery, cityFilter]);

  const totalPages = Math.ceil(filteredMajors.length / ITEMS_PER_PAGE);
  const pagedData = filteredMajors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const cities = useMemo(() => {
    return ['Toutes les villes', ...Array.from(new Set(MAJORS.map(m => m.location)))];
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-background-dark flex flex-col font-display">
      
      {/* Dynamic Header */}
      <nav className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
             <span className="material-symbols-outlined font-bold text-2xl">account_circle</span>
           </div>
           <div>
             <h2 className="font-black dark:text-white tracking-tighter text-sm uppercase leading-tight">Espace Candidat</h2>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">ID: 2024-KM-892</p>
           </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
             <div className="size-2 bg-primary rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Session active</p>
          </div>
          <button onClick={() => navigate('/login')} className="size-10 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
             <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area with Sidebar Layout */}
      <div className="flex-grow flex flex-col lg:flex-row max-w-[1400px] w-full mx-auto p-4 md:p-8 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-72 space-y-2">
           {[
             { id: 'home', label: 'Dashboard', icon: 'grid_view' },
             { id: 'applications', label: 'Préinscriptions', icon: 'description' },
             { id: 'profile', label: 'Mon Profil', icon: 'person_edit' },
             { id: 'catalogue', label: 'Filières', icon: 'explore' },
           ].map((item) => (
             <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id as DashboardTab); setCurrentPage(1); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-white dark:bg-surface-dark text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
             >
               <span className="material-symbols-outlined text-xl">{item.icon}</span>
               {item.label}
             </button>
           ))}
        </aside>

        {/* Content View */}
        <div className="flex-1 min-w-0">
          
          {/* VIEW: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#0f1a13] rounded-[48px] p-8 md:p-16 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 space-y-6 max-w-xl">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                    Bienvenue, <br/><span className="text-primary underline decoration-primary/30 decoration-4 underline-offset-8">Koffi Mensah</span>.
                  </h1>
                  <p className="text-gray-400 text-lg font-medium leading-relaxed">
                    Vous avez 2 préinscriptions en cours. Consultez vos notifications ou lancez un nouveau dossier.
                  </p>
                  <button 
                    onClick={() => setActiveTab('catalogue')}
                    className="bg-primary hover:bg-green-400 text-black font-black px-10 py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs"
                  >
                    FAIRE MA PREINSCRIPTION
                    <span className="material-symbols-outlined font-bold">add_circle</span>
                  </button>
                </div>
              </div>

              <section className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-[0.1em]">Dernières activités</h2>
                  <button onClick={() => setActiveTab('applications')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Voir tout</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {applications.slice(0, 1).map((app) => (
                    <div key={app.id} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`size-14 rounded-2xl flex items-center justify-center ${app.color}`}>
                          <span className="material-symbols-outlined text-2xl font-bold">{app.icon}</span>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{app.id}</p>
                          <h4 className="text-lg font-black dark:text-white leading-none mb-1">{app.major}</h4>
                          <p className="text-xs font-bold text-gray-500">{app.uni}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.color}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* VIEW: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-2 px-2">
                  <h2 className="text-3xl font-black dark:text-white tracking-tight">Mes Préinscriptions</h2>
                  <p className="text-gray-500 font-medium">Historique et statut de vos demandes d'admission.</p>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                       <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="flex items-center gap-4">
                             <div className={`size-16 rounded-3xl flex items-center justify-center ${app.color}`}>
                                <span className="material-symbols-outlined text-3xl">{app.icon}</span>
                             </div>
                             <div>
                                <h4 className="text-2xl font-black dark:text-white">{app.major}</h4>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{app.uni}</p>
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                             <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${app.color}`}>
                               {app.status}
                             </span>
                             <p className="text-[10px] text-gray-400 font-bold mt-2">Soumis le {app.date}</p>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase">ID Dossier</p>
                             <p className="text-xs font-black dark:text-white">{app.id}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase">Filière</p>
                             <p className="text-xs font-black dark:text-white">Licence Professionnelle</p>
                          </div>
                          <div className="flex-1"></div>
                          <button onClick={() => navigate(`/apply?id=${app.majorId}`)} className="bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                             Détails & Docs
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* VIEW: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-2 px-2">
                  <h2 className="text-3xl font-black dark:text-white tracking-tight">Mon Profil & Sécurité</h2>
                  <p className="text-gray-500 font-medium">Gérez vos informations personnelles et protégez votre compte.</p>
               </div>

               <div className="grid grid-cols-1 gap-8">
                  {/* Personal Info */}
                  <div className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                     <div className="flex items-center gap-4 pb-6 border-b border-gray-50 dark:border-gray-800">
                        <span className="material-symbols-outlined text-primary font-bold">badge</span>
                        <h3 className="text-lg font-black uppercase tracking-widest dark:text-white">Informations Générales</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prénom</label>
                           <input defaultValue="Koffi" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-0 font-bold dark:text-white outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom</label>
                           <input defaultValue="Mensah" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-0 font-bold dark:text-white outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                           <input defaultValue="koffi.mensah@etudiant.bj" readOnly className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-white/10 border border-transparent opacity-60 font-bold dark:text-white outline-none cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                           <input defaultValue="+229 97 00 11 22" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-0 font-bold dark:text-white outline-none transition-all" />
                        </div>
                     </div>
                     <div className="pt-4">
                        <button className="px-10 py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-all">Mettre à jour le profil</button>
                     </div>
                  </div>

                  {/* Password Change */}
                  <div className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                     <div className="flex items-center gap-4 pb-6 border-b border-gray-50 dark:border-gray-800">
                        <span className="material-symbols-outlined text-primary font-bold">lock_reset</span>
                        <h3 className="text-lg font-black uppercase tracking-widest dark:text-white">Changer le mot de passe</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mot de passe actuel</label>
                           <input type="password" placeholder="••••••••" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-0 font-bold dark:text-white outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nouveau mot de passe</label>
                           <input type="password" placeholder="8+ caractères" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-0 font-bold dark:text-white outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confirmation</label>
                           <input type="password" placeholder="Répéter" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-0 font-bold dark:text-white outline-none transition-all" />
                        </div>
                     </div>
                     <div className="pt-4">
                        <button className="px-10 py-4 border-2 border-primary text-primary font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-primary hover:text-black transition-all">Modifier le mot de passe</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* VIEW: CATALOGUE */}
          {activeTab === 'catalogue' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
              <header className="space-y-2">
                <h1 className="text-4xl font-black dark:text-white tracking-tighter">Catalogue des Filières</h1>
                <p className="text-gray-500 font-medium">Parcourez les offres académiques pour lancer votre préinscription.</p>
              </header>

              {/* Filter UI */}
              <div className="bg-[#0f1a13] p-3 rounded-[32px] shadow-2xl">
                 <div className="flex flex-col md:flex-row gap-3">
                   <div className="flex-1 flex items-center h-16 bg-white/10 rounded-2xl px-6 focus-within:bg-white/20 transition-all">
                     <span className="material-symbols-outlined text-primary font-bold">search</span>
                     <input 
                      className="flex-1 bg-transparent border-none text-white px-4 focus:ring-0 font-bold placeholder:text-gray-500" 
                      placeholder="École ou domaine..." 
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                     />
                   </div>
                   <div className="md:w-64 flex items-center h-16 bg-white/10 rounded-2xl px-6">
                     <span className="material-symbols-outlined text-gray-400">location_on</span>
                     <select 
                      value={cityFilter}
                      onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
                      className="flex-1 bg-transparent border-none text-white focus:ring-0 font-black text-xs uppercase cursor-pointer"
                     >
                       {cities.map(c => <option key={c} value={c} className="bg-[#0f1a13]">{c}</option>)}
                     </select>
                   </div>
                 </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {pagedData.map(major => (
                   <div key={major.id} className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                      <div className="p-8 space-y-6">
                         <div className="flex justify-between items-start">
                            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">
                              {major.level}
                            </span>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                              {major.location}
                            </div>
                         </div>

                         <div className="space-y-2">
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{major.domain}</p>
                            <h4 className="text-2xl font-black dark:text-white tracking-tight group-hover:text-primary transition-colors">{major.name}</h4>
                            <p className="text-xs font-bold text-gray-500">{major.universityName}</p>
                         </div>

                         <button 
                            onClick={() => navigate(`/apply?id=${major.id}`)}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-[#0f1a13] dark:bg-primary text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] transition-all"
                          >
                            Sélectionner & Postuler
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                          </button>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-8">
                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="size-10 rounded-xl border dark:border-gray-800 flex items-center justify-center"><span className="material-symbols-outlined">chevron_left</span></button>
                  <span className="text-xs font-black dark:text-white px-4">{currentPage} / {totalPages}</span>
                  <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="size-10 rounded-xl border dark:border-gray-800 flex items-center justify-center"><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
      <footer className="py-8 px-6 text-center border-t border-gray-50 dark:border-gray-800">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">
          Système National de Gestion des Admissions • © 2024
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
