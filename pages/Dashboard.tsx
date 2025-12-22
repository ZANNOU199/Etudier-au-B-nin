
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  const pagedData = filteredMajors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const cities = useMemo(() => ['Toutes les villes', ...Array.from(new Set(MAJORS.map(m => m.location)))], []);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: 'grid_view' },
    { id: 'applications', label: 'Mes Dossiers', icon: 'description', badge: '2' },
    { id: 'catalogue', label: 'Catalogue', icon: 'explore' },
    { id: 'profile', label: 'Mon Profil', icon: 'person' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-8 px-6">
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
            onClick={() => {
              setActiveTab(item.id as DashboardTab);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
              activeTab === item.id 
              ? 'bg-primary text-black shadow-lg shadow-primary/20' 
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
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Aide en ligne</h4>
            <p className="text-[11px] font-medium text-gray-400">Des difficultés ? Nos conseillers vous répondent.</p>
            <Link to="/contact" className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">Support</Link>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background-dark flex font-display overflow-hidden relative">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-white/5 shrink-0 h-screen sticky top-0 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-dark z-[60] lg:hidden animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto h-screen flex flex-col">
        
        {/* Header Content */}
        <header className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40 lg:px-12">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="hidden lg:block space-y-0.5">
                 <h2 className="text-xl font-black dark:text-white tracking-tight">Espace Étudiant</h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Session 2024 • Certifié</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-black dark:text-white leading-none">Koffi Mensah</p>
                 <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">ID #8932</p>
              </div>
              <button onClick={() => navigate('/login')} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                 <span className="material-symbols-outlined text-xl">logout</span>
              </button>
           </div>
        </header>

        <div className="p-6 lg:p-12 space-y-10">
          
          {/* VIEW: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-10 animate-fade-in">
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

               <div className="bg-[#0f1a13] rounded-[40px] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
                    <span className="material-symbols-outlined text-[150px]">auto_awesome</span>
                  </div>
                  <div className="max-w-xl space-y-6 relative z-10 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter">Votre futur <br/><span className="text-primary italic">commence ici</span>.</h2>
                    <p className="text-gray-400 text-sm md:text-lg font-medium leading-relaxed">
                      Trouvez la formation idéale parmi nos pôles d'excellence et lancez votre dossier en 5 minutes.
                    </p>
                    <button onClick={() => setActiveTab('catalogue')} className="w-full md:w-auto bg-primary text-black font-black px-10 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[11px] uppercase tracking-widest">
                      Explorer le catalogue
                    </button>
                  </div>
               </div>

               <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2">Mes candidatures en cours</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/20 transition-all shadow-sm">
                        <div className="flex items-center gap-6 flex-1 w-full">
                           <div className={`size-14 md:size-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                              <span className="material-symbols-outlined text-2xl md:text-3xl font-bold">{app.icon}</span>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{app.id}</p>
                              <h4 className="text-lg md:text-xl font-black dark:text-white leading-tight">{app.major}</h4>
                              <p className="text-xs font-bold text-gray-500">{app.uni}</p>
                           </div>
                        </div>
                        <div className="w-full md:w-64 space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                              <span>Progression</span>
                              <span className="text-primary">{app.progress}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div style={{ width: `${app.progress}%` }} className={`h-full bg-gradient-to-r ${app.color} transition-all duration-1000`}></div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                           <span className={`flex-1 md:flex-none text-center px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 ${app.progress === 100 ? 'text-primary bg-primary/10' : 'text-amber-500 bg-amber-500/10'}`}>
                             {app.status}
                           </span>
                           <button onClick={() => navigate(`/apply?id=${app.majorId}`)} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all shrink-0">
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
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-black dark:text-white tracking-tighter">Catalogue Interactif</h1>
                <p className="text-gray-500 font-medium">Parcourez les offres académiques certifiées par l'État.</p>
              </div>

              <div className="bg-white dark:bg-surface-dark p-3 rounded-[28px] md:rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-6 h-14 md:h-16">
                   <span className="material-symbols-outlined text-gray-400">search</span>
                   <input 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold dark:text-white px-4" 
                    placeholder="Ex: Informatique, UAC..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                <div className="flex items-center px-6 h-14 md:h-16 border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/5">
                   <span className="material-symbols-outlined text-gray-400 mr-2">location_on</span>
                   <select 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest cursor-pointer dark:text-white min-w-[120px]"
                   >
                     {cities.map(c => <option key={c} value={c} className="bg-white dark:bg-surface-dark">{c}</option>)}
                   </select>
                </div>
                <button className="bg-primary text-black font-black px-8 rounded-2xl text-[10px] uppercase tracking-widest h-14 md:h-auto hover:bg-green-400 transition-all">Rechercher</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {pagedData.map(major => (
                  <div key={major.id} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                     <div className="p-8 md:p-10 space-y-6 flex-1">
                        <div className="flex justify-between items-start gap-4">
                           <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10">
                              {major.level}
                           </span>
                           <span className="text-[9px] font-black text-primary uppercase tracking-widest text-right">{major.domain}</span>
                        </div>
                        <h4 className="text-xl md:text-2xl font-black dark:text-white leading-tight group-hover:text-primary transition-colors">{major.name}</h4>
                        <div className="flex items-center gap-3">
                           <div className="size-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                              <span className="material-symbols-outlined text-lg">location_city</span>
                           </div>
                           <p className="text-xs font-bold text-gray-500">{major.universityName}</p>
                        </div>
                     </div>
                     <div className="p-6 md:p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                        <p className="text-base md:text-lg font-black dark:text-white">{major.fees}</p>
                        <button onClick={() => navigate(`/apply?id=${major.id}`)} className="size-10 md:size-11 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined font-bold text-xl">add</span>
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
