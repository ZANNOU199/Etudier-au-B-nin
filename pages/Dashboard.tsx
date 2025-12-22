
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  const applications = [
    { 
      id: 'EAB-24-8932',
      majorId: 'uac-gl',
      uni: "UAC (EPAC)", 
      major: "Génie Logiciel", 
      status: "En cours", 
      progress: 65,
      date: "12 Oct 2023",
      color: "from-amber-400 to-orange-500",
      icon: "pending"
    },
    { 
      id: 'EAB-24-9102',
      majorId: 'hecm-mark',
      uni: "HECM Cotonou", 
      major: "Marketing MAC", 
      status: "Validé", 
      progress: 100,
      date: "15 Oct 2023",
      color: "from-primary to-primary-dark",
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

  const menuItems = [
    { id: 'home', label: 'Vue d\'ensemble', icon: 'grid_view' },
    { id: 'applications', label: 'Mes Dossiers', icon: 'description', badge: '2' },
    { id: 'catalogue', label: 'Catalogue', icon: 'explore' },
    { id: 'profile', label: 'Mon Profil', icon: 'person' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background-dark flex font-display overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-white/5 py-8 px-6 shrink-0 h-screen sticky top-0 shadow-sm">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined font-bold">school</span>
          </div>
          <span className="font-black text-lg dark:text-white tracking-tight">CandidatHub</span>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                activeTab === item.id 
                ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </div>
              {item.badge && (
                <span className={`size-5 rounded-full flex items-center justify-center text-[9px] ${activeTab === item.id ? 'bg-black text-white' : 'bg-gray-100 dark:bg-white/10'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
           <div className="bg-background-dark p-6 rounded-[32px] text-white space-y-4 relative overflow-hidden shadow-2xl border border-white/5">
              <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-4xl">support_agent</span></div>
              <h4 className="text-xs font-black leading-tight">Besoin d'aide ?</h4>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Support prioritaire actif</p>
              <Link to="/contact" className="block w-full py-3 bg-primary text-black text-center rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all">Contacter</Link>
           </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto h-screen flex flex-col relative">
        
        {/* Mobile Top Nav */}
        <header className="lg:hidden bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-2">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-black shadow-sm">
                <span className="material-symbols-outlined text-lg font-bold">school</span>
              </div>
              <span className="font-black text-sm uppercase tracking-tighter dark:text-white">CandidatHub</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
             <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
           </button>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-10 lg:p-14 space-y-12">
          
          {/* Header & Stats Desktop */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter">
                Hello, <span className="text-primary italic">Koffi</span>.
              </h1>
              <p className="text-gray-500 font-bold text-sm">Session 2024 • Statut : Certifié</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden sm:flex flex-col text-right">
                  <p className="text-xs font-black dark:text-white">Koffi Mensah</p>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest">Candidat #8932</p>
               </div>
               <div className="size-12 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 shadow-sm">
                  <span className="material-symbols-outlined">person</span>
               </div>
            </div>
          </div>

          {/* VIEW: HOME / OVERVIEW */}
          {activeTab === 'home' && (
            <div className="space-y-12 animate-fade-in">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Candidatures', val: '02', icon: 'description', color: 'text-primary' },
                    { label: 'Documents', val: '05', icon: 'folder_zip', color: 'text-blue-500' },
                    { label: 'Alertes', val: '00', icon: 'campaign', color: 'text-amber-500' }
                  ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-3xl font-black dark:text-white">{s.val}</p>
                      </div>
                      <div className={`size-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-2xl font-bold">{s.icon}</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="bg-[#0f1a13] rounded-[48px] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-[150px]">auto_awesome</span>
                  </div>
                  <div className="max-w-xl space-y-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter">Votre futur <br/><span className="text-primary italic">commence ici</span>.</h2>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed">
                      Trouvez la formation idéale parmi nos pôles d'excellence et lancez votre dossier en 5 minutes.
                    </p>
                    <button onClick={() => setActiveTab('catalogue')} className="bg-primary text-black font-black px-10 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[11px] uppercase tracking-widest">
                      Explorer le catalogue
                    </button>
                  </div>
               </div>

               <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-4">Suivi des candidatures</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/20 transition-all shadow-sm">
                        <div className="flex items-center gap-6 flex-1 w-full">
                           <div className={`size-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg`}>
                              <span className="material-symbols-outlined text-3xl font-bold">{app.icon}</span>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{app.id}</p>
                              <h4 className="text-xl font-black dark:text-white leading-none">{app.major}</h4>
                              <p className="text-xs font-bold text-gray-500">{app.uni}</p>
                           </div>
                        </div>
                        <div className="w-full md:w-64 space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                              <span>Progression</span>
                              <span className="text-primary">{app.progress}%</span>
                           </div>
                           <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div style={{ width: `${app.progress}%` }} className={`h-full bg-gradient-to-r ${app.color} transition-all duration-1000`}></div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 ${app.progress === 100 ? 'text-primary bg-primary/10' : 'text-amber-500 bg-amber-500/10'}`}>
                             {app.status}
                           </span>
                           <button onClick={() => navigate(`/apply?id=${app.majorId}`)} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-transparent hover:border-primary/20">
                              <span className="material-symbols-outlined">east</span>
                           </button>
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
              <header className="space-y-2">
                <h1 className="text-4xl font-black dark:text-white tracking-tighter">Catalogue de Formations</h1>
                <p className="text-gray-500 font-medium">Parcourez les offres académiques certifiées par l'État.</p>
              </header>

              <div className="bg-white dark:bg-surface-dark p-3 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-6 h-16">
                   <span className="material-symbols-outlined text-gray-400">search</span>
                   <input 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold dark:text-white px-4" 
                    placeholder="Rechercher une formation..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                <div className="md:w-64 flex items-center px-6 h-16 border-l border-gray-100 dark:border-white/5">
                   <span className="material-symbols-outlined text-gray-400 mr-2">location_on</span>
                   <select 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest cursor-pointer dark:text-white"
                   >
                     {cities.map(c => <option key={c} value={c} className="bg-white dark:bg-surface-dark">{c}</option>)}
                   </select>
                </div>
                <button className="bg-primary text-black font-black px-10 rounded-2xl text-[10px] uppercase tracking-widest h-16 md:h-auto">Appliquer</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pagedData.map(major => (
                  <div key={major.id} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-[40px] overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                     <div className="p-10 space-y-6 flex-1">
                        <div className="flex justify-between items-start">
                           <span className="px-4 py-1.5 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10">
                              {major.level}
                           </span>
                           <span className="text-[9px] font-black text-primary uppercase tracking-widest">{major.domain}</span>
                        </div>
                        <h4 className="text-2xl font-black dark:text-white leading-tight group-hover:text-primary transition-colors">{major.name}</h4>
                        <div className="flex items-center gap-3">
                           <div className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                              <span className="material-symbols-outlined text-xl">location_city</span>
                           </div>
                           <p className="text-xs font-bold text-gray-500">{major.universityName}</p>
                        </div>
                     </div>
                     <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex justify-between items-center group/btn">
                        <p className="text-lg font-black dark:text-white">{major.fees}</p>
                        <button onClick={() => navigate(`/apply?id=${major.id}`)} className="size-11 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined font-bold">add</span>
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: APPLICATIONS */}
          {activeTab === 'applications' && (
             <div className="space-y-10 animate-fade-in">
               <header className="space-y-2">
                  <h1 className="text-4xl font-black dark:text-white tracking-tighter">Mes Candidatures</h1>
                  <p className="text-gray-500 font-medium">Gérez vos dossiers et suivez les retours d'admission.</p>
               </header>
               
               <div className="grid grid-cols-1 gap-6">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white dark:bg-surface-dark p-10 rounded-[50px] border border-gray-100 dark:border-white/5 shadow-premium flex flex-col lg:flex-row gap-10">
                       <div className="flex-1 flex flex-col md:flex-row gap-8 items-center">
                          <div className={`size-20 rounded-[32px] flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${app.color} text-white shadow-xl`}>
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
                             <span className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border shadow-sm ${app.progress === 100 ? 'text-primary border-primary/20 bg-primary/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>
                                {app.status}
                             </span>
                             <p className="text-[10px] text-gray-400 font-black mt-3 uppercase tracking-widest leading-none">Soumis le {app.date}</p>
                          </div>
                          <button onClick={() => navigate(`/apply?id=${app.majorId}`)} className="flex items-center gap-2 px-8 py-3.5 bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group">
                             Détails du dossier
                             <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">east</span>
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
          )}

          {/* VIEW: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-fade-in max-w-4xl">
               <header className="space-y-2">
                  <h1 className="text-4xl font-black dark:text-white tracking-tighter">Mon Profil</h1>
                  <p className="text-gray-500 font-medium">Vos informations sécurisées et certifiées.</p>
               </header>

               <div className="bg-white dark:bg-surface-dark p-10 md:p-14 rounded-[50px] border border-gray-100 dark:border-white/5 shadow-sm space-y-12">
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-50 dark:border-white/5">
                     <div className="size-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined font-bold">person</span>
                     </div>
                     <h3 className="text-sm font-black uppercase tracking-[0.2em] dark:text-white">Identité Étudiante</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Prénom</label>
                        <input defaultValue="Koffi" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold dark:text-white outline-none transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Nom</label>
                        <input defaultValue="Mensah" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold dark:text-white outline-none transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Téléphone</label>
                        <input defaultValue="+229 97 00 11 22" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold dark:text-white outline-none transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Ville</label>
                        <input defaultValue="Cotonou" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold dark:text-white outline-none transition-all" />
                     </div>
                  </div>
                  <div className="pt-6">
                     <button className="px-10 py-5 bg-primary text-black font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20">Mettre à jour mon profil</button>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
             <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-dark p-8 flex flex-col gap-6 animate-in slide-in-from-right-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                   <span className="font-black text-lg dark:text-white">Menu</span>
                   <button onClick={() => setIsMobileMenuOpen(false)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                </div>
                {menuItems.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as DashboardTab); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-4 p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest ${activeTab === item.id ? 'bg-primary text-black' : 'text-gray-400 dark:text-gray-500'}`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                <div className="mt-auto pt-8 border-t border-gray-100 dark:border-white/5">
                   <button onClick={() => navigate('/login')} className="w-full flex items-center gap-4 p-5 text-red-500 font-black text-[10px] uppercase tracking-widest">
                     <span className="material-symbols-outlined text-xl">logout</span>
                     Déconnexion
                   </button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
