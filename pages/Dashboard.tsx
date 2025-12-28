
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const Dashboard: React.FC = () => {
  const { user, applications, logout, refreshData, isLoading, resolveFileUrl } = useCMS();
  const [activeTab, setActiveTab] = useState<'home' | 'applications' | 'profile'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const userApplications = useMemo(() => {
    if (!user) return [];
    return applications.filter(a => String(a.studentId) === String(user.id));
  }, [applications, user]);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: 'grid_view' },
    { id: 'applications', label: 'Mes Dossiers', icon: 'description', badge: userApplications.length.toString() },
    { id: 'profile', label: 'Mon Profil', icon: 'person' },
  ];

  if (!user) return null;

  const displayId = user.id.includes('-') ? user.id.split('-')[1] : user.id;

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-8 px-6 text-left">
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
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-white/5 shrink-0 h-screen sticky top-0 shadow-sm text-left">
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
              <div className="space-y-0.5 text-left">
                 <h2 className="text-xl font-black dark:text-white tracking-tight">Bonjour, {user.firstName}</h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Session 2024 • Connecté</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={() => refreshData()}
                className={`size-11 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-all ${isLoading ? 'animate-spin' : ''}`}
                title="Actualiser"
              >
                <span className="material-symbols-outlined text-xl">refresh</span>
              </button>
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-black dark:text-white leading-none">{user.firstName} {user.lastName}</p>
                 <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">ID #{displayId}</p>
              </div>
              <button onClick={() => { logout(); navigate('/login'); }} className="size-11 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                 <span className="material-symbols-outlined text-xl">logout</span>
              </button>
           </div>
        </header>

        <div className="p-6 lg:p-12 space-y-10">
          {activeTab === 'home' && (
            <div className="space-y-10 animate-fade-in text-left">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Candidatures', val: userApplications.length.toString().padStart(2, '0'), icon: 'description', color: 'text-primary' },
                    { label: 'Documents', val: userApplications.reduce((acc, app) => acc + (app.documents?.length || 0), 0).toString().padStart(2, '0'), icon: 'folder_zip', color: 'text-blue-500' },
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

               <div className="bg-[#0f1a13] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="max-w-xl space-y-6">
                    <h2 className="text-4xl font-black leading-tight tracking-tighter">Complétez votre <br/><span className="text-primary italic">avenir académique</span>.</h2>
                    <p className="text-gray-400 font-medium">Parcourez les filières d'excellence et postulez en quelques clics.</p>
                    <Link to="/majors" className="inline-block bg-primary text-black font-black px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-widest">
                      Découvrir les formations
                    </Link>
                  </div>
               </div>

               <section className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Suivi de mes dossiers</h3>
                    <button onClick={() => setActiveTab('applications')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Voir tout</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userApplications.slice(0, 3).map((app) => (
                      <div key={app.id} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col justify-between gap-6 group hover:border-primary/20 transition-all shadow-sm">
                        <div className="space-y-4">
                           <div className="flex justify-between items-start">
                              <div className={`size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0`}>
                                 <span className="material-symbols-outlined text-xl font-bold">description</span>
                              </div>
                              <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 ${
                                app.status === 'Validé' ? 'text-primary bg-primary/10' : 
                                app.status === 'Rejeté' ? 'text-red-500 bg-red-500/10' : 'text-amber-500 bg-amber-500/10'
                              }`}>
                                {app.status}
                              </span>
                           </div>
                           <div className="space-y-1 text-left">
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Dossier #{app.id}</p>
                              <h4 className="text-lg font-black dark:text-white leading-tight line-clamp-1">{app.majorName}</h4>
                              <p className="text-[10px] font-bold text-gray-500">{app.universityName}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-50 dark:border-white/5">
                           <button onClick={() => navigate(`/major/${app.majorId}`)} className="flex-1 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-all flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              Détails
                           </button>
                           {app.primary_document_url && (
                             <a 
                               href={app.primary_document_url} 
                               target="_blank" 
                               rel="noreferrer" 
                               className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:scale-105 transition-all"
                             >
                               <span className="material-symbols-outlined text-lg">download</span>
                             </a>
                           )}
                        </div>
                      </div>
                    ))}
                    {userApplications.length === 0 && (
                      <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                        <p className="text-gray-400 text-sm font-bold">Aucun dossier actif pour le moment.</p>
                      </div>
                    )}
                  </div>
               </section>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-10 animate-fade-in text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter">Mes Candidatures</h2>
                  <p className="text-gray-500 font-medium">Visualisez et gérez l'ensemble de vos dossiers académiques.</p>
                </div>
                <Link to="/majors" className="flex items-center gap-2 px-8 py-4 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                  <span className="material-symbols-outlined text-lg">add</span>
                  Nouveau Dossier
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {userApplications.map(app => (
                   <div key={app.id} className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-premium flex flex-col gap-8 group hover:-translate-y-1 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 text-left">
                           <span className="text-[9px] font-black text-primary uppercase tracking-widest">Référence : {app.id}</span>
                           <h3 className="text-2xl font-black dark:text-white tracking-tight leading-tight">{app.majorName}</h3>
                           <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{app.universityName}</p>
                        </div>
                        <span className={`inline-block px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          app.status === 'Validé' ? 'bg-primary text-black' : 
                          app.status === 'Rejeté' ? 'bg-red-500 text-white' : 'bg-amber-400 text-black'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">folder</span>
                          Documents joints
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {app.primary_document_url && (
                             <a 
                               href={app.primary_document_url} 
                               target="_blank" 
                               rel="noreferrer" 
                               className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20 group/doc"
                             >
                                <div className="size-10 rounded-xl bg-primary text-black flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-xl">description</span>
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">Document Principal</p>
                                  <p className="text-[8px] font-bold text-gray-400 italic">Preuve académique</p>
                                </div>
                             </a>
                           )}
                           
                           {app.documents && app.documents.length > 0 ? app.documents.map((doc: any, i: number) => {
                             const docUrl = resolveFileUrl(doc.url);
                             return (
                               <a 
                                 key={i} 
                                 href={docUrl} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 group/doc hover:border-primary/30 transition-all"
                               >
                                  <div className="size-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-400 flex items-center justify-center shrink-0 group-hover/doc:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">attach_file</span>
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest truncate">Pièce #{i+1}</p>
                                    <p className="text-[8px] font-bold text-gray-400 italic">Document annexe</p>
                                  </div>
                               </a>
                             );
                           }) : null}
                        </div>
                        {(!app.primary_document_url && (!app.documents || app.documents.length === 0)) && (
                          <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-center gap-3 text-red-500">
                             <span className="material-symbols-outlined text-xl">warning</span>
                             <p className="text-[9px] font-bold uppercase tracking-widest leading-none">Attention : Aucun document n'est attaché à ce dossier.</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-gray-400">
                            <span className="material-symbols-outlined text-sm">event</span>
                            <p className="text-[10px] font-black uppercase tracking-widest">Soumis le {app.date}</p>
                         </div>
                         <button onClick={() => navigate(`/major/${app.majorId}`)} className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                           Revoir la filière
                           <span className="material-symbols-outlined text-sm">arrow_forward</span>
                         </button>
                      </div>
                   </div>
                 ))}
                 {userApplications.length === 0 && (
                   <div className="col-span-full text-center py-20 bg-white dark:bg-surface-dark rounded-[40px] border border-dashed border-gray-200">
                     <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">folder_off</span>
                     <p className="text-gray-500 font-bold">Vous n'avez aucune candidature enregistrée.</p>
                     <Link to="/majors" className="inline-block mt-4 text-primary font-black uppercase text-xs tracking-widest hover:underline">Déposer mon premier dossier</Link>
                   </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-10 animate-fade-in max-w-4xl text-left">
              <div className="space-y-2">
                <h2 className="text-3xl font-black dark:text-white tracking-tighter">Profil Étudiant</h2>
                <p className="text-gray-500 font-medium">Gérez vos informations personnelles et académiques.</p>
              </div>

              <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 border border-gray-100 dark:border-white/5 shadow-sm space-y-10 text-left">
                <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-gray-50 dark:border-white/5 pb-10 text-left">
                   <div className="size-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                      <span className="material-symbols-outlined text-5xl font-bold">person</span>
                   </div>
                   <div className="space-y-1 text-center sm:text-left">
                      <h3 className="text-3xl font-black dark:text-white tracking-tight">{user.firstName} {user.lastName}</h3>
                      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Candidat Session 2024 • ID #{displayId}</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase border border-primary/20">Compte Vérifié</span>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 text-[9px] font-black uppercase">Email: {user.email}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Identité complète</label>
                      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 font-bold dark:text-white flex items-center gap-4">
                         <span className="material-symbols-outlined text-gray-400">badge</span>
                         {user.firstName} {user.lastName}
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Adresse de contact</label>
                      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 font-bold dark:text-white flex items-center gap-4">
                         <span className="material-symbols-outlined text-gray-400">alternate_email</span>
                         {user.email}
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Identifiant National (INE)</label>
                      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 font-bold dark:text-white flex items-center gap-4">
                         <span className="material-symbols-outlined text-gray-400">fingerprint</span>
                         {user.ine || 'Non encore validé'}
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Statut du compte</label>
                      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 font-bold dark:text-white flex items-center gap-4">
                         <span className="material-symbols-outlined text-gray-400">verified_user</span>
                         Candidat Actif
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-gray-50 dark:border-white/5 flex flex-col sm:flex-row gap-4">
                   <button className="flex-1 px-10 py-5 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                      Mettre à jour mon profil
                   </button>
                   <button className="px-10 py-5 bg-white/5 text-gray-500 font-black rounded-2xl text-[10px] uppercase tracking-widest border border-gray-100 dark:border-white/10 hover:text-white transition-all">
                      Changer de mot de passe
                   </button>
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
