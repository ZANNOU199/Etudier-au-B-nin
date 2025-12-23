
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MAJORS } from '../constants';
import { useCMS } from '../CMSContext';
import { Application } from '../types';

const ITEMS_PER_PAGE = 4;

type DashboardTab = 'home' | 'catalogue' | 'applications' | 'profile';

const Dashboard: React.FC = () => {
  const { user, logout, applications, removeApplication } = useCMS();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('Toutes les villes');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Sécurité: Si pas de user, retour login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
    { id: 'applications', label: 'Mes Dossiers', icon: 'description', badge: applications.length.toString() },
    { id: 'catalogue', label: 'Catalogue', icon: 'explore' },
    { id: 'profile', label: 'Mon Profil', icon: 'person' },
  ];

  if (!user) return null;

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
            {item.badge !== '0' && (
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
            <p className="text-[11px] font-medium text-gray-400">Besoin d'assistance ?</p>
            <Link to="/contact" className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">Support</Link>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background-dark flex font-display overflow-hidden relative">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-white/5 shrink-0 h-screen sticky top-0 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-dark z-[60] lg:hidden animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen flex flex-col">
        <header className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40 lg:px-12">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="space-y-0.5">
                 <h2 className="text-xl font-black dark:text-white tracking-tight">Bonjour, {user.firstName}</h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Session 2024 • Connecté</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-black dark:text-white leading-none">{user.firstName} {user.lastName}</p>
                 <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">ID #{user.id.split('-')[1]}</p>
              </div>
              <button onClick={logout} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                 <span className="material-symbols-outlined text-xl">logout</span>
              </button>
           </div>
        </header>

        <div className="p-6 lg:p-12 space-y-10">
          
          {/* HOME VIEW */}
          {activeTab === 'home' && (
            <div className="space-y-10 animate-fade-in">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Candidatures', val: applications.length.toString().padStart(2, '0'), icon: 'description', color: 'text-primary' },
                    { label: 'Formations', val: MAJORS.length.toString(), icon: 'school', color: 'text-blue-500' },
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

               <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2">Dossiers récents</h3>
                    {applications.length > 0 && (
                      <button onClick={() => setActiveTab('applications')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Voir tout</button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {applications.length > 0 ? (
                      applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/20 transition-all shadow-sm">
                          <div className="flex items-center gap-6 flex-1 w-full">
                             <div className={`size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0`}>
                                <span className="material-symbols-outlined text-2xl font-bold">description</span>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{app.id}</p>
                                <h4 className="text-lg font-black dark:text-white leading-tight">{app.majorName}</h4>
                                <p className="text-xs font-bold text-gray-500">{app.universityName}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 w-full md:w-auto">
                             <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 ${app.status === 'Validé' ? 'text-primary bg-primary/10' : 'text-amber-500 bg-amber-500/10'}`}>
                               {app.status}
                             </span>
                             <button onClick={() => setSelectedApp(app)} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all shrink-0">
                                <span className="material-symbols-outlined">visibility</span>
                             </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-white/5">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">folder_open</span>
                        <p className="text-gray-400 font-bold text-sm">Aucun dossier pour le moment.</p>
                        <button onClick={() => setActiveTab('catalogue')} className="mt-6 text-primary font-black uppercase tracking-widest text-[10px] hover:underline">Commencer une inscription</button>
                      </div>
                    )}
                  </div>
               </section>
            </div>
          )}

          {/* CATALOGUE VIEW */}
          {activeTab === 'catalogue' && (
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-black dark:text-white tracking-tighter">Catalogue Interactif</h1>
                <p className="text-gray-500 font-medium">Parcourez les offres académiques certifiées.</p>
              </div>
              <div className="bg-white dark:bg-surface-dark p-3 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-6 h-16">
                   <span className="material-symbols-outlined text-gray-400">search</span>
                   <input className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold dark:text-white px-4" placeholder="Ex: Informatique..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <button className="bg-primary text-black font-black px-8 rounded-2xl text-[10px] uppercase tracking-widest h-14 md:h-auto hover:bg-green-400 transition-all">Rechercher</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pagedData.map(major => (
                  <div key={major.id} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-[40px] overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                     <div className="p-8 space-y-6 flex-1">
                        <div className="flex justify-between items-start gap-4">
                           <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10">{major.level}</span>
                           <span className="text-[9px] font-black text-primary uppercase tracking-widest">{major.domain}</span>
                        </div>
                        <h4 className="text-xl font-black dark:text-white leading-tight">{major.name}</h4>
                        <p className="text-xs font-bold text-gray-500">{major.universityName}</p>
                     </div>
                     <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                        <p className="text-lg font-black dark:text-white">{major.fees}</p>
                        <button onClick={() => navigate(`/apply?id=${major.id}`)} className="bg-primary text-black px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20">S'inscrire</button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPLICATIONS VIEW */}
          {activeTab === 'applications' && (
             <div className="space-y-10 animate-fade-in">
                <div className="space-y-2">
                  <h1 className="text-3xl font-black dark:text-white tracking-tighter">Mes Candidatures</h1>
                  <p className="text-gray-500 font-medium">Suivez l'état d'avancement de vos dossiers en temps réel.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <div key={app.id} className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm group hover:border-primary/40 transition-all">
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                          <div className="flex gap-6">
                            <div className="size-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-primary border border-gray-100 dark:border-white/10">
                              <span className="material-symbols-outlined text-3xl font-bold">article</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-black dark:text-white tracking-tight">{app.majorName}</h3>
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'Validé' ? 'bg-primary/10 text-primary' : 'bg-amber-400/10 text-amber-500'}`}>{app.status}</span>
                              </div>
                              <p className="text-sm font-bold text-gray-500">{app.universityName} • {app.date}</p>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Dossier N° {app.id}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 lg:border-l lg:pl-8 border-gray-100 dark:border-white/5">
                             <button onClick={() => setSelectedApp(app)} className="px-6 py-3 bg-gray-50 dark:bg-white/5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all dark:text-white dark:hover:text-black border border-gray-100 dark:border-white/10">Détails</button>
                             <button onClick={() => removeApplication(app.id)} className="size-12 rounded-xl border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><span className="material-symbols-outlined">delete</span></button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-32 bg-white dark:bg-surface-dark rounded-[48px] border-2 border-dashed border-gray-100 dark:border-white/10">
                       <p className="text-gray-400 font-bold">Vous n'avez aucun dossier actif.</p>
                       <button onClick={() => setActiveTab('catalogue')} className="mt-8 bg-primary text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Explorer les filières</button>
                    </div>
                  )}
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Modal Détails Dossier */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
           <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-white/5">
              <div className="p-10 space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className="text-primary font-black uppercase text-[10px] tracking-widest">Détails du dossier</span>
                       <h2 className="text-3xl font-black dark:text-white tracking-tighter">{selectedApp.majorName}</h2>
                    </div>
                    <button onClick={() => setSelectedApp(null)} className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                       <span className="material-symbols-outlined">close</span>
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                       <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Statut</p>
                       <p className="font-black text-primary uppercase text-sm tracking-widest">{selectedApp.status}</p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                       <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Soumis le</p>
                       <p className="font-black dark:text-white text-sm uppercase tracking-widest">{selectedApp.date}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Documents joints</h4>
                    <div className="space-y-2">
                       {['BAC_Releve.pdf', 'Acte_Naissance.pdf', 'Photo_Passport.jpg'].map((doc, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 group">
                            <div className="flex items-center gap-3">
                               <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">description</span>
                               <span className="text-sm font-bold dark:text-white">{doc}</span>
                            </div>
                            <span className="material-symbols-outlined text-primary text-xl font-bold cursor-pointer">download</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="pt-6 border-t border-gray-100 dark:border-white/10">
                    <p className="text-[10px] text-gray-400 italic text-center">Votre dossier est en cours de vérification par le pôle académique de {selectedApp.universityName}.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
