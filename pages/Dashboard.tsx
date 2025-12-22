
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

  const applications = [
    { 
      id: 'EAB-24-8932',
      majorId: 'uac-gl',
      uni: "UAC (EPAC)", 
      major: "Génie Logiciel", 
      status: "En cours", 
      date: "12 Oct 2023",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      icon: "hourglass_empty"
    },
    { 
      id: 'EAB-24-9102',
      majorId: 'hecm-mark',
      uni: "HECM Cotonou", 
      major: "Marketing MAC", 
      status: "Validé", 
      date: "15 Oct 2023",
      color: "text-primary bg-primary/10 border-primary/20",
      icon: "check_circle"
    }
  ];

  const filteredMajors = useMemo(() => {
    return MAJORS.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.domain.toLowerCase().includes(q) || m.universityName.toLowerCase().includes(q);
      const matchesCity = cityFilter === 'Toutes les villes' || m.location === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [searchQuery, cityFilter]);

  const totalPages = Math.ceil(filteredMajors.length / ITEMS_PER_PAGE);
  const pagedData = filteredMajors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const cities = useMemo(() => ['Toutes les villes', ...Array.from(new Set(MAJORS.map(m => m.location)))], []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display">
      
      {/* Premium Dashboard Header */}
      <nav className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
           <Link to="/" className="flex items-center gap-3">
             <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
               <span className="material-symbols-outlined font-bold text-2xl">school</span>
             </div>
             <div className="hidden sm:block">
                <h2 className="font-black dark:text-white tracking-tighter text-sm uppercase leading-none">Espace Candidat</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Session Académique 2024</p>
             </div>
           </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 mr-6">
            <div className="text-right">
              <p className="text-xs font-black dark:text-white">Koffi Mensah</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Candidat Certifié</p>
            </div>
            <div className="size-11 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-200 dark:border-white/10">
               <span className="material-symbols-outlined">person</span>
            </div>
          </div>
          <button onClick={() => navigate('/login')} className="size-11 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
             <span className="material-symbols-outlined font-bold">logout</span>
          </button>
        </div>
      </nav>

      {/* Modern Sidebar Layout */}
      <div className="flex-grow flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-4 md:p-10 gap-10">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-80 space-y-3 shrink-0">
           {[
             { id: 'home', label: 'Dashboard', icon: 'grid_view' },
             { id: 'applications', label: 'Préinscriptions', icon: 'description' },
             { id: 'profile', label: 'Mon Profil', icon: 'manage_accounts' },
             { id: 'catalogue', label: 'Filières', icon: 'explore' },
           ].map((item) => (
             <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id as DashboardTab); setCurrentPage(1); }}
                className={`w-full flex items-center gap-4 px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all relative ${activeTab === item.id ? 'bg-primary text-black shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-white dark:bg-surface-dark text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5'}`}
             >
               <span className="material-symbols-outlined text-2xl">{item.icon}</span>
               {item.label}
               {activeTab === item.id && <div className="absolute right-6 size-2 bg-black rounded-full"></div>}
             </button>
           ))}

           <div className="pt-10 px-6">
              <div className="p-8 bg-[#0f1a13] rounded-[40px] text-white space-y-4 relative overflow-hidden shadow-2xl">
                 <div className="absolute -bottom-10 -right-10 size-32 bg-primary/20 rounded-full blur-2xl"></div>
                 <h4 className="text-xl font-black leading-tight relative z-10">Besoin <br />d'aide ?</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Assistance prioritaire 24/7</p>
                 <Link to="/contact" className="block w-full py-4 bg-primary text-black text-center rounded-2xl font-black text-[10px] uppercase tracking-widest relative z-10 hover:scale-105 transition-all">Support</Link>
              </div>
           </div>
        </aside>

        {/* Content View */}
        <div className="flex-1 min-w-0">
          
          {/* VIEW: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-12 animate-fade-in">
              <div className="bg-white dark:bg-surface-dark rounded-[50px] p-10 md:p-16 relative overflow-hidden shadow-premium border border-gray-100 dark:border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 space-y-8 max-w-2xl">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Candidat officiel • Koffi Mensah</span>
                    <h1 className="text-4xl md:text-6xl font-black text-text-main dark:text-white tracking-tighter leading-none">
                      Suivez votre <br/><span className="text-primary italic">succès</span> académique.
                    </h1>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                    Vous avez actuellement <span className="text-primary font-black">2 dossiers</span> en cours de traitement. Votre admission est notre priorité.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setActiveTab('catalogue')}
                      className="bg-primary hover:bg-green-400 text-black font-black px-12 py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-[10px]"
                    >
                      NOUVELLE PRÉINSCRIPTION
                      <span className="material-symbols-outlined font-bold">add_circle</span>
                    </button>
                    <button className="px-12 py-5 bg-gray-100 dark:bg-white/5 dark:text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-white/10 transition-all">Télécharger ma fiche</button>
                  </div>
                </div>
              </div>

              <section className="space-y-8">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-2xl font-black dark:text-white tracking-tight flex items-center gap-3 uppercase text-sm tracking-[0.2em]">
                    <span className="size-2 bg-primary rounded-full animate-ping"></span>
                    Activités récentes
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/30 transition-all hover:shadow-lg">
                      <div className="flex items-center gap-8 flex-1">
                        <div className={`size-16 rounded-[24px] flex items-center justify-center border ${app.color}`}>
                          <span className="material-symbols-outlined text-3xl font-bold">{app.icon}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{app.id}</p>
                          <h4 className="text-2xl font-black dark:text-white tracking-tight leading-none group-hover:text-primary transition-colors">{app.major}</h4>
                          <p className="text-sm font-bold text-gray-500 mt-1">{app.uni}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-right hidden md:block">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dernière mise à jour</p>
                           <p className="text-sm font-bold dark:text-white">{app.date}</p>
                        </div>
                        <span className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${app.color} shadow-sm`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* VIEW: CATALOGUE */}
          {activeTab === 'catalogue' && (
            <div className="space-y-10 animate-fade-in">
              <header className="space-y-2 px-2">
                <h1 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter">Parcourir les filières</h1>
                <p className="text-gray-500 font-medium text-lg">Choisissez votre futur parcours académique parmi nos offres certifiées.</p>
              </header>

              <div className="bg-background-dark p-4 rounded-[40px] shadow-2xl">
                 <div className="flex flex-col md:flex-row gap-4">
                   <div className="flex-1 flex items-center h-20 bg-white/10 rounded-3xl px-8 focus-within:bg-white/15 transition-all">
                     <span className="material-symbols-outlined text-primary font-bold text-2xl">search</span>
                     <input 
                      className="flex-1 bg-transparent border-none text-white px-5 focus:ring-0 font-bold placeholder:text-gray-500 text-lg" 
                      placeholder="Domaine, métier ou école..." 
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                     />
                   </div>
                   <div className="md:w-72 flex items-center h-20 bg-white/10 rounded-3xl px-8">
                     <span className="material-symbols-outlined text-gray-400 text-2xl">location_on</span>
                     <select 
                      value={cityFilter}
                      onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
                      className="flex-1 bg-transparent border-none text-white focus:ring-0 font-black text-xs uppercase cursor-pointer"
                     >
                       {cities.map(c => <option key={c} value={c} className="bg-background-dark">{c}</option>)}
                     </select>
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {pagedData.map(major => (
                   <div key={major.id} className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-[50px] overflow-hidden hover:shadow-premium transition-all duration-700 flex flex-col hover:-translate-y-2">
                      <div className="p-10 space-y-8 flex flex-col h-full">
                         <div className="flex justify-between items-start">
                            <span className="px-5 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                              {major.level}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                              {major.location}
                            </div>
                         </div>

                         <div className="space-y-3 flex-1">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{major.domain}</p>
                            <h4 className="text-3xl font-black dark:text-white tracking-tighter leading-none group-hover:text-primary transition-colors">{major.name}</h4>
                            <p className="text-sm font-bold text-gray-500">{major.universityName}</p>
                         </div>

                         <button 
                            onClick={() => navigate(`/apply?id=${major.id}`)}
                            className="w-full flex items-center justify-center gap-4 py-5 bg-background-dark dark:bg-primary text-white dark:text-black rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] hover:shadow-xl transition-all"
                          >
                            Postuler maintenant
                            <span className="material-symbols-outlined text-xl">east</span>
                          </button>
                      </div>
                   </div>
                 ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-10">
                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="size-14 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all text-gray-400"><span className="material-symbols-outlined font-black">west</span></button>
                  <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                     <span className="text-sm font-black dark:text-white">Page {currentPage}</span>
                     <span className="text-gray-400 font-bold">sur {totalPages}</span>
                  </div>
                  <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="size-14 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all text-gray-400"><span className="material-symbols-outlined font-black">east</span></button>
                </div>
              )}
            </div>
          )}

          {/* VIEW: APPLICATIONS (Simplified and polished) */}
          {activeTab === 'applications' && (
             <div className="space-y-10 animate-fade-in">
               <header className="space-y-2 px-2">
                  <h1 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter">Mes Candidatures</h1>
                  <p className="text-gray-500 font-medium text-lg">Gérez vos dossiers d'admission et suivez les retours des universités.</p>
               </header>
               
               <div className="grid grid-cols-1 gap-8">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white dark:bg-surface-dark p-10 rounded-[50px] border border-gray-100 dark:border-white/5 shadow-premium flex flex-col lg:flex-row gap-10">
                       <div className="flex-1 flex flex-col md:flex-row gap-8 items-center">
                          <div className={`size-20 rounded-[32px] flex items-center justify-center flex-shrink-0 border ${app.color} shadow-lg shadow-black/5`}>
                             <span className="material-symbols-outlined text-4xl font-bold">{app.icon}</span>
                          </div>
                          <div className="text-center md:text-left space-y-2">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{app.id}</p>
                             <h4 className="text-3xl font-black dark:text-white tracking-tighter leading-none">{app.major}</h4>
                             <p className="text-lg font-bold text-gray-500">{app.uni}</p>
                          </div>
                       </div>
                       
                       <div className="lg:w-px bg-gray-100 dark:bg-white/5"></div>
                       
                       <div className="flex flex-col justify-center items-center lg:items-end gap-6">
                          <div className="text-center lg:text-right">
                             <span className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border shadow-sm ${app.color}`}>
                                {app.status}
                             </span>
                             <p className="text-[10px] text-gray-400 font-black mt-3 uppercase tracking-widest leading-none">Soumis le {app.date}</p>
                          </div>
                          <button onClick={() => navigate(`/apply?id=${app.majorId}`)} className="flex items-center gap-2 px-8 py-3.5 bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group">
                             Consulter le dossier
                             <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">east</span>
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
          )}

          {/* VIEW: PROFILE (Modernized forms) */}
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-fade-in max-w-5xl">
               <header className="space-y-2 px-2">
                  <h1 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter">Mon Profil</h1>
                  <p className="text-gray-500 font-medium text-lg">Vos informations sécurisées et certifiées par la plateforme.</p>
               </header>

               <div className="grid grid-cols-1 gap-10">
                  <div className="bg-white dark:bg-surface-dark p-10 md:p-16 rounded-[50px] border border-gray-100 dark:border-white/5 shadow-premium space-y-12">
                     <div className="flex items-center gap-5 pb-8 border-b border-gray-100 dark:border-white/5">
                        <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                           <span className="material-symbols-outlined font-bold">person</span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-[0.2em] dark:text-white">Informations Générales</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Prénom</label>
                           <input defaultValue="Koffi" className="w-full p-5 rounded-[24px] bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold dark:text-white outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Nom de famille</label>
                           <input defaultValue="Mensah" className="w-full p-5 rounded-[24px] bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold dark:text-white outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Adresse Email</label>
                           <input defaultValue="koffi.mensah@etudiant.bj" readOnly className="w-full p-5 rounded-[24px] bg-gray-200 dark:bg-white/10 border border-transparent opacity-60 font-bold dark:text-white cursor-not-allowed outline-none" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Téléphone</label>
                           <input defaultValue="+229 97 00 11 22" className="w-full p-5 rounded-[24px] bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold dark:text-white outline-none transition-all" />
                        </div>
                     </div>
                     <div className="pt-6">
                        <button className="px-12 py-5 bg-primary text-black font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all">Enregistrer les modifications</button>
                     </div>
                  </div>

                  <div className="bg-white dark:bg-surface-dark p-10 md:p-16 rounded-[50px] border border-gray-100 dark:border-white/5 shadow-premium space-y-12">
                     <div className="flex items-center gap-5 pb-8 border-b border-gray-100 dark:border-white/5">
                        <div className="size-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                           <span className="material-symbols-outlined font-bold">security</span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-[0.2em] dark:text-white">Sécurité du compte</h3>
                     </div>
                     <div className="space-y-8">
                        <p className="text-gray-500 font-medium">Pour modifier votre mot de passe, un code de validation sera envoyé à votre adresse email.</p>
                        <button className="px-12 py-5 border-2 border-red-500/30 text-red-500 font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-red-500 hover:text-white transition-all">Lancer la procédure de changement</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
      
      <footer className="py-12 px-6 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">
          Système National de Gestion des Admissions • Propulsé par EDEN Communication
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
