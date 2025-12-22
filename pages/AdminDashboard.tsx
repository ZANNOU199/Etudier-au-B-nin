
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AdminView = 'overview' | 'applications' | 'analytics' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const kpis = [
    { label: 'Candidatures 2024', val: '12 450', change: '+12%', icon: 'school', color: 'bg-primary/10 text-primary' },
    { label: 'Revenus Collectés', val: '24.5M', change: '+18%', icon: 'payments', color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'Taux de Validation', val: '92%', change: '+2%', icon: 'verified', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Utilisateurs Actifs', val: '3,840', change: '+5%', icon: 'groups', color: 'bg-purple-500/10 text-purple-500' }
  ];

  const recentApps = [
    { id: 'APP-9021', name: 'Aïcha Dossou', uni: 'UAC', major: 'Génie Logiciel', status: 'Pending', date: '12 Oct 2024', avatar: 'https://i.pravatar.cc/150?u=aicha', phone: '+229 90 00 11 22', doc: 'Diplôme_BAC.pdf' },
    { id: 'APP-8842', name: 'Jean Kocou', uni: 'HECM', major: 'Marketing Digital', status: 'Approved', date: '10 Oct 2024', avatar: 'https://i.pravatar.cc/150?u=jean', phone: '+229 97 44 55 66', doc: 'Acte_Naissance.pdf' },
    { id: 'APP-7731', name: 'Aminata Maiga', uni: 'UP', major: 'Médecine Générale', status: 'Rejected', date: '08 Oct 2024', avatar: 'https://i.pravatar.cc/150?u=ami', phone: '+229 66 11 22 33', doc: 'Releve_Notes.pdf' },
    { id: 'APP-6650', name: 'Koffi Mensah', uni: 'UAC', major: 'Génie Civil', status: 'Pending', date: '07 Oct 2024', avatar: 'https://i.pravatar.cc/150?u=koffi', phone: '+229 95 88 99 00', doc: 'Dossier_Complet.pdf' }
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-primary/10 text-primary-dark border-primary/20';
      case 'Rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  const SidebarNav = () => (
    <div className="flex flex-col h-full py-10 px-6">
      <div className="flex items-center gap-4 px-4 mb-12">
        <div className="size-11 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/30 shrink-0">
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
          { id: 'applications', label: 'Candidatures', icon: 'description', badge: '12' },
          { id: 'analytics', label: 'Rapports', icon: 'leaderboard' },
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
            {item.badge && (
              <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeView === item.id ? 'bg-black text-white' : 'bg-white/10 text-gray-400'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="pt-10">
        <button onClick={() => navigate('/login')} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white hover:bg-red-500/20 transition-all border border-red-500/20">
          <span className="material-symbols-outlined text-xl">logout</span>
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#f4f7f6] dark:bg-background-dark font-display overflow-hidden relative">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-80 bg-[#0d1b13] flex-col shrink-0 z-30 shadow-2xl border-r border-white/5">
        <SidebarNav />
      </aside>

      {/* Sidebar Mobile (Drawer) */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-80 bg-[#0d1b13] z-[60] lg:hidden animate-in slide-in-from-left duration-300">
            <SidebarNav />
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen bg-gray-50 dark:bg-background-dark/50 flex flex-col">
        
        {/* Header Responsif */}
        <header className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 lg:px-12 py-6 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden size-11 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="hidden sm:block space-y-0.5">
                 <h1 className="text-xl lg:text-2xl font-black dark:text-white tracking-tighter uppercase">
                    {activeView === 'overview' ? 'Administration' : 
                     activeView === 'applications' ? 'Candidatures' :
                     activeView === 'analytics' ? 'Rapports & Stats' : 'Paramètres'}
                 </h1>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pilotage Central Session 2024</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden md:relative group md:block">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary text-xl">search</span>
                 <input 
                  className="w-64 pl-12 pr-4 py-3 bg-gray-100 dark:bg-white/5 rounded-xl border-none text-sm font-bold dark:text-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="size-11 rounded-xl bg-primary text-black flex items-center justify-center font-black shadow-lg shadow-primary/20">
                AD
              </div>
           </div>
        </header>

        <div className="p-4 lg:p-12 space-y-10">
          
          {/* VIEW: OVERVIEW */}
          {activeView === 'overview' && (
            <div className="space-y-12 animate-fade-in">
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  {kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`size-12 rounded-xl flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                          <span className="material-symbols-outlined font-bold text-2xl">{kpi.icon}</span>
                        </div>
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{kpi.change}</span>
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                      <p className="text-3xl font-black dark:text-white tracking-tighter">{kpi.val}</p>
                    </div>
                  ))}
               </div>

               <section className="bg-white dark:bg-surface-dark rounded-[40px] border border-gray-100 dark:border-white/5 shadow-premium overflow-hidden">
                  <div className="p-8 md:p-10 border-b border-gray-50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                     <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-xs">Dossiers Récents</h3>
                     <button onClick={() => setActiveView('applications')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline bg-primary/5 px-6 py-2 rounded-xl">Voir tout</button>
                  </div>
                  
                  <div className="overflow-x-auto w-full">
                     <table className="w-full min-w-[800px]">
                        <thead>
                          <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 dark:border-white/5">
                             <th className="px-10 py-6 text-left">Candidat</th>
                             <th className="px-10 py-6 text-left">Formation / Institution</th>
                             <th className="px-10 py-6 text-left">Date</th>
                             <th className="px-10 py-6 text-left">Statut</th>
                             <th className="px-10 py-6 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                          {recentApps.map((app, i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <img src={app.avatar} className="size-11 rounded-xl object-cover border border-gray-200 dark:border-white/10 shadow-sm" alt={app.name} />
                                    <div>
                                       <p className="text-sm font-black dark:text-white leading-none mb-1">{app.name}</p>
                                       <p className="text-[10px] font-bold text-gray-400 uppercase">{app.id}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <p className="text-xs font-black dark:text-gray-200 leading-none mb-1">{app.major}</p>
                                 <p className="text-[9px] font-black text-primary uppercase tracking-widest">{app.uni}</p>
                              </td>
                              <td className="px-10 py-6">
                                 <p className="text-xs font-bold dark:text-gray-400">{app.date}</p>
                              </td>
                              <td className="px-10 py-6">
                                 <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                    {app.status === 'Approved' ? 'Validé' : app.status === 'Rejected' ? 'Rejeté' : 'En attente'}
                                 </span>
                              </td>
                              <td className="px-10 py-6">
                                 <div className="flex justify-center gap-2">
                                    <button onClick={() => setSelectedApp(app)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition-all flex items-center justify-center border border-transparent hover:border-primary/20">
                                       <span className="material-symbols-outlined text-xl">visibility</span>
                                    </button>
                                    <button className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition-all flex items-center justify-center border border-transparent hover:border-primary/20">
                                       <span className="material-symbols-outlined text-xl">check</span>
                                    </button>
                                 </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                     </table>
                  </div>
               </section>
            </div>
          )}

          {/* VIEW: APPLICATIONS (FULL LIST) */}
          {activeView === 'applications' && (
            <div className="space-y-8 animate-fade-in">
               <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                     <h3 className="text-2xl font-black dark:text-white tracking-tighter uppercase tracking-widest text-xs">Gestion Complète des Candidats</h3>
                     <div className="flex gap-2 w-full md:w-auto">
                        <input 
                           className="flex-1 md:w-64 pl-4 pr-4 py-3 bg-gray-100 dark:bg-white/5 rounded-xl border-none text-sm font-bold dark:text-white outline-none" 
                           placeholder="Filtrer par INE, ID..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="bg-primary text-black px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">Filtrer</button>
                     </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                     <table className="w-full min-w-[900px]">
                        <thead>
                          <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 dark:border-white/5">
                             <th className="px-8 py-4 text-left">ID</th>
                             <th className="px-8 py-4 text-left">Candidat</th>
                             <th className="px-8 py-4 text-left">Filière / Université</th>
                             <th className="px-8 py-4 text-left">Date</th>
                             <th className="px-8 py-4 text-left">Statut</th>
                             <th className="px-8 py-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                           {recentApps.concat(recentApps).map((app, i) => (
                              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                 <td className="px-8 py-5 text-[11px] font-black text-gray-400">{app.id}-{i}</td>
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                       <img src={app.avatar} className="size-9 rounded-lg" alt="" />
                                       <p className="text-sm font-bold dark:text-white">{app.name}</p>
                                    </div>
                                 </td>
                                 <td className="px-8 py-5">
                                    <p className="text-xs font-black dark:text-gray-300">{app.major}</p>
                                    <p className="text-[10px] text-primary uppercase font-black">{app.uni}</p>
                                 </td>
                                 <td className="px-8 py-5 text-xs font-bold text-gray-400">{app.date}</td>
                                 <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                       {app.status}
                                    </span>
                                 </td>
                                 <td className="px-8 py-5 text-center">
                                    <button onClick={() => setSelectedApp(app)} className="text-primary hover:scale-110 transition-transform"><span className="material-symbols-outlined">visibility</span></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {/* VIEW: ANALYTICS (REPORTS) */}
          {activeView === 'analytics' && (
            <div className="space-y-10 animate-fade-in">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                     <h3 className="text-lg font-black dark:text-white uppercase tracking-widest text-xs">Candidatures par Statut</h3>
                     <div className="space-y-6">
                        {[
                           { label: 'Validées', count: 4500, total: 12450, color: 'bg-primary' },
                           { label: 'En attente', count: 6800, total: 12450, color: 'bg-amber-400' },
                           { label: 'Rejetées', count: 1150, total: 12450, color: 'bg-red-500' }
                        ].map((item, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
                                 <span>{item.label}</span>
                                 <span className="dark:text-white">{Math.round((item.count/item.total)*100)}% ({item.count})</span>
                              </div>
                              <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                 <div className={`h-full ${item.color}`} style={{ width: `${(item.count/item.total)*100}%` }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                     <h3 className="text-lg font-black dark:text-white uppercase tracking-widest text-xs">Top Universités (Candidatures)</h3>
                     <div className="space-y-4">
                        {[
                           { name: 'UAC', apps: 5200, growth: '+15%' },
                           { name: 'UP', apps: 3100, growth: '+8%' },
                           { name: 'HECM', apps: 2400, growth: '+22%' },
                           { name: 'UNSTIM', apps: 1750, growth: '+5%' }
                        ].map((uni, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                              <div className="flex items-center gap-4">
                                 <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">{uni.name[0]}</div>
                                 <div>
                                    <p className="text-sm font-black dark:text-white">{uni.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{uni.apps} dossiers</p>
                                 </div>
                              </div>
                              <span className="text-[10px] font-black text-primary">{uni.growth}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeView === 'settings' && (
            <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
               <div className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm space-y-12">
                  <div className="space-y-8">
                     <h3 className="text-lg font-black dark:text-white uppercase tracking-widest text-xs border-b border-gray-100 dark:border-white/5 pb-4">Configuration Globale</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Frais Dossier Local (CFA)</label>
                           <input defaultValue="2500" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none font-bold dark:text-white" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Frais Dossier Étranger (CFA)</label>
                           <input defaultValue="100000" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none font-bold dark:text-white" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Date Limite Session 1</label>
                           <input type="date" defaultValue="2024-12-31" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none font-bold dark:text-white" />
                        </div>
                        <div className="space-y-4 pt-4">
                           <label className="flex items-center gap-4 cursor-pointer">
                              <div className="relative w-12 h-6 bg-primary/20 rounded-full transition-all">
                                 <div className="absolute top-1 left-1 size-4 bg-primary rounded-full translate-x-6"></div>
                              </div>
                              <span className="text-xs font-black dark:text-white uppercase tracking-widest">Inscriptions Ouvertes</span>
                           </label>
                        </div>
                     </div>
                  </div>
                  <div className="pt-6">
                     <button className="w-full md:w-auto px-10 py-5 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-all">Enregistrer les paramètres</button>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* DETAILS MODAL */}
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white dark:bg-surface-dark w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                <div className="p-8 md:p-12 space-y-10">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-6">
                         <img src={selectedApp.avatar} className="size-20 rounded-[32px] object-cover border-4 border-white dark:border-gray-800 shadow-xl" alt={selectedApp.name} />
                         <div>
                            <h2 className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter">{selectedApp.name}</h2>
                            <p className="text-xs font-black text-primary uppercase tracking-widest">Candidat ID: {selectedApp.id}</p>
                         </div>
                      </div>
                      <button onClick={() => setSelectedApp(null)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-all">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-[32px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Université</p>
                         <p className="text-lg font-black dark:text-white leading-tight">{selectedApp.uni}</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Filière</p>
                         <p className="text-lg font-black dark:text-white leading-tight">{selectedApp.major}</p>
                      </div>
                      <div className="sm:col-span-2">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Pièces jointes certifiées</p>
                         <div className="flex items-center gap-3 p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 text-primary">
                            <span className="material-symbols-outlined text-2xl">description</span>
                            <span className="text-sm font-black flex-1 truncate">{selectedApp.doc}</span>
                            <span className="material-symbols-outlined text-sm cursor-pointer hover:scale-125 transition-transform">download</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <button className="py-4 bg-red-500/10 text-red-500 font-black rounded-2xl uppercase tracking-widest text-[10px] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Rejeter</button>
                      <button className="py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Valider</button>
                   </div>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
