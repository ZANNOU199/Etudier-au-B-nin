
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const Dashboard: React.FC = () => {
  const { user, applications, logout, refreshData, isLoading, apiError } = useCMS();
  const [activeTab, setActiveTab] = useState<'home' | 'applications' | 'profile'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      refreshData();
    }
  }, [user]);

  const userApplications = useMemo(() => {
    return applications;
  }, [applications]);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: 'grid_view' },
    { id: 'applications', label: 'Mes Dossiers', icon: 'description', badge: userApplications.length.toString() },
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
              setActiveTab(item.id as any);
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
            <p className="text-[11px] font-medium text-gray-400">Besoin d'assistance ? Nos conseillers sont là.</p>
            <Link to="/contact" className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">Support</Link>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background-dark flex font-display overflow-hidden relative">
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-white/5 shrink-0 h-screen sticky top-0 shadow-sm">
        <SidebarContent />
      </aside>

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-dark z-[60] lg:hidden animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </aside>
        </>
      )}

      <main className="flex-1 overflow-y-auto h-screen flex flex-col">
        <header className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40 lg:px-12">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="space-y-0.5">
                 <h2 className="text-xl font-black dark:text-white tracking-tight">Bonjour, {user.firstName}</h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                   {isLoading ? 'Synchronisation...' : 'Session active'}
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button onClick={() => { logout(); navigate('/login'); }} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                 <span className="material-symbols-outlined text-xl">logout</span>
              </button>
           </div>
        </header>

        <div className="p-6 lg:p-12 space-y-10">
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 animate-fade-in">
              <span className="material-symbols-outlined">cloud_off</span>
              <p className="text-xs font-black uppercase tracking-widest">{apiError}</p>
              <button onClick={() => refreshData()} className="ml-auto bg-red-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase">Réessayer</button>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="space-y-10 animate-fade-in">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Candidatures', val: userApplications.length.toString().padStart(2, '0'), icon: 'description', color: 'text-primary' },
                    { label: 'Alertes', val: '00', icon: 'campaign', color: 'text-amber-500' }
                  ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-3xl font-black dark:text-white">{s.val}</p>
                      </div>
                      <div className={`size-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${s.color}`}>
                        <span className="material-symbols-outlined text-2xl font-bold">{s.icon}</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="bg-[#0f1a13] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="max-w-xl space-y-6">
                    <h2 className="text-4xl font-black leading-tight tracking-tighter">Votre futur <span className="text-primary italic">académique</span>.</h2>
                    <p className="text-gray-400 font-medium">Parcourez les filières et gérez vos préinscriptions.</p>
                    <Link to="/majors" className="inline-block bg-primary text-black font-black px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-widest">
                      Découvrir les formations
                    </Link>
                  </div>
               </div>

               <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2">Suivi récent</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {userApplications.map((app) => (
                      <div key={app.id} className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/20 transition-all shadow-sm">
                        <div className="flex items-center gap-6 flex-1 w-full">
                           <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                              <span className="material-symbols-outlined text-2xl font-bold">description</span>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">DOSSIER #{app.id}</p>
                              <h4 className="text-lg font-black dark:text-white leading-tight">{app.majorName || 'Filière'}</h4>
                              <p className="text-xs font-bold text-gray-500">{app.universityName}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                           <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 ${
                             app.status === 'Validé' ? 'text-primary bg-primary/10' : 
                             app.status === 'Rejeté' ? 'text-red-500 bg-red-500/10' : 'text-amber-500 bg-amber-500/10'
                           }`}>
                             {app.status}
                           </span>
                        </div>
                      </div>
                    ))}
                    {userApplications.length === 0 && !isLoading && (
                      <div className="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm font-black uppercase">AUCUN DOSSIER EN COURS</p>
                      </div>
                    )}
                  </div>
               </section>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-black dark:text-white tracking-tighter">Mes Candidatures</h2>
              <div className="grid grid-cols-1 gap-6">
                 {userApplications.map(app => (
                   <div key={app.id} className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <h3 className="text-2xl font-black dark:text-white tracking-tight">{app.majorName}</h3>
                              <p className="text-gray-500 font-bold">{app.universityName}</p>
                           </div>
                        </div>
                        <div className="text-right space-y-2">
                           <span className={`inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             app.status === 'Validé' ? 'bg-primary text-black' : 
                             app.status === 'Rejeté' ? 'bg-red-500 text-white' : 'bg-amber-400 text-black'
                           }`}>
                             {app.status}
                           </span>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-10 animate-fade-in max-w-4xl">
              <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 border border-gray-100 dark:border-white/5 shadow-sm space-y-10">
                <div className="flex items-center gap-8 border-b border-gray-50 dark:border-white/5 pb-10">
                   <div className="size-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <span className="material-symbols-outlined text-5xl font-bold">person</span>
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-3xl font-black dark:text-white tracking-tight">{user.firstName} {user.lastName}</h3>
                      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">ID #{user.id}</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 font-bold dark:text-white">{user.email}</div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle</label>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 font-bold dark:text-white uppercase text-[10px]">{user.role}</div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
