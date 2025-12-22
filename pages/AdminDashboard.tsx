
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AdminView = 'overview' | 'applications' | 'analytics' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const kpis = [
    { label: 'Candidatures 2024', val: '12 450', change: '+12%', icon: 'school', color: 'bg-primary/10 text-primary', trend: 'up' },
    { label: 'Revenus Collectés', val: '24.5M', change: '+18%', icon: 'payments', color: 'bg-emerald-500/10 text-emerald-500', trend: 'up' },
    { label: 'Taux de Validation', val: '92%', change: '+2%', icon: 'verified', color: 'bg-blue-500/10 text-blue-500', trend: 'up' },
    { label: 'Utilisateurs Actifs', val: '3,840', change: '+5%', icon: 'groups', color: 'bg-purple-500/10 text-purple-500', trend: 'up' }
  ];

  const recentApps = [
    { id: 'APP-9021', name: 'Aïcha Dossou', uni: 'UAC', major: 'Génie Logiciel', status: 'Pending', date: 'Aujourd\'hui', avatar: 'https://i.pravatar.cc/150?u=aicha', phone: '+229 90 00 11 22', doc: 'Diplôme_BAC.pdf' },
    { id: 'APP-8842', name: 'Jean Kocou', uni: 'HECM', major: 'Marketing Digital', status: 'Approved', date: 'Il y a 2h', avatar: 'https://i.pravatar.cc/150?u=jean', phone: '+229 97 44 55 66', doc: 'Acte_Naissance.pdf' },
    { id: 'APP-7731', name: 'Aminata Maiga', uni: 'UP', major: 'Médecine Générale', status: 'Rejected', date: 'Il y a 5h', avatar: 'https://i.pravatar.cc/150?u=ami', phone: '+229 66 11 22 33', doc: 'Releve_Notes.pdf' },
    { id: 'APP-6650', name: 'Koffi Mensah', uni: 'UAC', major: 'Génie Civil', status: 'Pending', date: 'Hier', avatar: 'https://i.pravatar.cc/150?u=koffi', phone: '+229 95 88 99 00', doc: 'Dossier_Complet.pdf' }
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-primary/10 text-primary-dark border-primary/20';
      case 'Rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'Approved': return 'Validé';
      case 'Rejected': return 'Rejeté';
      default: return 'En attente';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f7f6] dark:bg-background-dark font-display overflow-hidden">
      
      {/* SaaS Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-24' : 'w-80'} bg-[#0d1b13] flex flex-col py-10 px-6 shrink-0 z-30 shadow-2xl transition-all duration-300 relative`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-4 px-4'} mb-12`}>
          <div className="size-11 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/30 shrink-0">
            <span className="material-symbols-outlined text-2xl font-black">shield_person</span>
          </div>
          {!isSidebarCollapsed && (
            <div className="animate-fade-in">
              <h2 className="font-black text-lg text-white tracking-tight leading-none">AdminHub</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Console Master</p>
            </div>
          )}
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: 'grid_view' },
            { id: 'applications', label: 'Candidatures', icon: 'description', badge: '12' },
            { id: 'analytics', label: 'Statistiques', icon: 'leaderboard' },
            { id: 'settings', label: 'Système', icon: 'settings' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-4 px-6'} py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all relative group ${
                activeView === item.id 
                ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {!isSidebarCollapsed && (
                <div className="flex-grow text-left animate-fade-in">{item.label}</div>
              )}
              {!isSidebarCollapsed && item.badge && (
                <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeView === item.id ? 'bg-black text-white' : 'bg-white/10 text-gray-400'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center size-12 rounded-2xl bg-white/5 text-gray-500 hover:text-white transition-colors border border-white/5"
          >
            <span className="material-symbols-outlined">{isSidebarCollapsed ? 'last_page' : 'first_page'}</span>
          </button>
          <button onClick={() => navigate('/login')} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-center gap-3 px-6'} py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20`}>
            <span className="material-symbols-outlined text-xl">logout</span>
            {!isSidebarCollapsed && <span className="animate-fade-in">Quitter</span>}
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 space-y-12 bg-gray-50 dark:bg-background-dark/50">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
           <div className="space-y-1">
              <h1 className="text-3xl font-black dark:text-white tracking-tighter uppercase flex items-center gap-3">
                 <span className="size-3 bg-primary rounded-full animate-pulse"></span>
                 {activeView === 'overview' ? 'Pilotage Central' : activeView}
              </h1>
              <p className="text-gray-500 font-bold text-sm">Gestion des admissions nationales • Session 2024</p>
           </div>
           
           <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="flex-1 lg:w-80 relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                <input 
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 text-sm font-bold dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm" 
                  placeholder="Rechercher INE ou Nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="size-14 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center text-gray-400 relative shadow-sm border border-gray-100 dark:border-white/5">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-4 right-4 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
              </div>
           </div>
        </header>

        {/* VIEW: OVERVIEW */}
        {activeView === 'overview' && (
          <div className="space-y-12 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                  <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-44">
                    <div className="flex justify-between items-start">
                      <div className={`size-12 rounded-xl flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined font-bold text-2xl">{kpi.icon}</span>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{kpi.change}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                      <p className="text-3xl font-black dark:text-white tracking-tighter leading-none">{kpi.val}</p>
                    </div>
                  </div>
                ))}
             </div>

             <section className="bg-white dark:bg-surface-dark rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                <div className="p-10 border-b border-gray-50 dark:border-white/5 flex justify-between items-center">
                   <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-xs">Dossiers Prioritaires</h3>
                   <div className="flex gap-2">
                     <button className="px-6 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest dark:text-white hover:bg-gray-100">Filtres</button>
                     <button className="px-6 py-2.5 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Exporter</button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full">
                      <thead>
                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 dark:border-white/5">
                           <th className="px-10 py-6 text-left">Candidat</th>
                           <th className="px-10 py-6 text-left">Filière / Institution</th>
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
                               <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                  {getStatusLabel(app.status)}
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
                <div className="p-8 border-t border-gray-50 dark:border-white/5 text-center">
                   <button className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors">Afficher plus de résultats</button>
                </div>
             </section>
          </div>
        )}

        {/* DETAILS MODAL */}
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white dark:bg-surface-dark w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 space-y-10">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-6">
                         <img src={selectedApp.avatar} className="size-20 rounded-[32px] object-cover border-4 border-white dark:border-gray-800 shadow-xl" alt={selectedApp.name} />
                         <div>
                            <h2 className="text-3xl font-black dark:text-white tracking-tighter">{selectedApp.name}</h2>
                            <p className="text-xs font-black text-primary uppercase tracking-widest">ID: {selectedApp.id}</p>
                         </div>
                      </div>
                      <button onClick={() => setSelectedApp(null)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-all">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-8 p-8 rounded-[32px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Université</p>
                         <p className="text-lg font-black dark:text-white">{selectedApp.uni}</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Filière</p>
                         <p className="text-lg font-black dark:text-white">{selectedApp.major}</p>
                      </div>
                      <div className="col-span-2">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Pièce Jointe</p>
                         <div className="flex items-center gap-3 p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 text-primary">
                            <span className="material-symbols-outlined text-2xl">description</span>
                            <span className="text-sm font-black">{selectedApp.doc}</span>
                            <span className="material-symbols-outlined text-sm ml-auto cursor-pointer">download</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <button className="py-4 bg-red-500/10 text-red-500 font-black rounded-2xl uppercase tracking-widest text-[10px] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Rejeter</button>
                      <button className="py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Approuver</button>
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
