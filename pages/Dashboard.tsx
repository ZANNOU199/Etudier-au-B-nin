
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const Dashboard: React.FC = () => {
  const { user, applications, logout, refreshData, isLoading } = useCMS();
  const [activeTab, setActiveTab] = useState<'home' | 'applications' | 'profile'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const userApplications = useMemo(() => {
    if (!user) return [];
    return applications.filter(a => String(a.studentId) === String(user.id));
  }, [applications, user]);

  const menuItems = [
    { id: 'home', label: 'Vue d\'ensemble', icon: 'grid_view' },
    { id: 'applications', label: 'Candidatures', icon: 'description', badge: userApplications.length.toString() },
    { id: 'profile', label: 'Profil Étudiant', icon: 'person' },
  ];

  if (!user) return null;

  const displayId = user.id.includes('-') ? user.id.split('-')[1] : user.id;

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-10 px-8 text-left">
      <div className="flex items-center gap-4 px-2 mb-12">
        <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined font-black text-2xl">school</span>
        </div>
        <div>
          <h2 className="font-black text-xl dark:text-white tracking-tight leading-none">CandidatHub</h2>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1.5">Portail Officiel</p>
        </div>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
              activeTab === item.id 
              ? 'bg-primary text-black shadow-xl shadow-primary/20 scale-105' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </div>
            {item.badge !== '0' && (
              <span className={`size-5 rounded-lg flex items-center justify-center text-[9px] ${activeTab === item.id ? 'bg-black text-white' : 'bg-white/10'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
         <div className="bg-gradient-to-br from-[#0f1a13] to-surface-dark p-8 rounded-[32px] text-white space-y-5 relative overflow-hidden shadow-2xl border border-white/5">
            <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
               <span className="material-symbols-outlined">help</span>
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Assistance 24/7</h4>
            <p className="text-[11px] font-medium text-gray-400 leading-relaxed">Une question sur votre admission ? Contactez nos experts.</p>
            <Link to="/contact" className="block w-full py-3.5 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border border-white/10">Support Ticket</Link>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background-dark flex font-display overflow-hidden relative">
      <aside className="hidden lg:flex w-85 bg-[#0d1b13] flex-col shrink-0 h-screen sticky top-0 shadow-2xl border-r border-white/5">
        <SidebarContent />
      </aside>

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-80 bg-[#0d1b13] z-[60] lg:hidden animate-in slide-in-from-left duration-300 shadow-2xl">
            <SidebarContent />
          </aside>
        </>
      )}

      <main className="flex-1 overflow-y-auto h-screen flex flex-col bg-gray-50 dark:bg-background-dark/30">
        <header className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-8 lg:px-12 py-6 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden size-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="text-left">
                 <h2 className="text-2xl font-black dark:text-white tracking-tighter uppercase leading-none">Session 2024</h2>
                 <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1.5">Bienvenue, {user.firstName}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <button onClick={() => refreshData()} className={`size-12 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-all ${isLoading ? 'animate-spin' : ''}`}>
                <span className="material-symbols-outlined text-2xl">refresh</span>
              </button>
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-black dark:text-white leading-none uppercase">{user.firstName} {user.lastName}</p>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5">ID #{displayId}</p>
              </div>
              <button onClick={() => { logout(); navigate('/login'); }} className="size-12 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10">
                 <span className="material-symbols-outlined text-2xl">logout</span>
              </button>
           </div>
        </header>

        <div className="p-8 lg:p-16 space-y-12 max-w-[1600px] mx-auto w-full">
          {activeTab === 'home' && (
            <div className="space-y-12 animate-fade-in text-left">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { label: 'Candidatures actives', val: userApplications.length.toString().padStart(2, '0'), icon: 'description', color: 'text-primary' },
                    { label: 'Paiements validés', val: userApplications.filter(a => !!a.payment || a.status !== 'En attente').length.toString().padStart(2, '0'), icon: 'check_circle', color: 'text-blue-500' },
                    { label: 'Messages / Alertes', val: '00', icon: 'notifications', color: 'text-amber-500' }
                  ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-premium flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{s.label}</p>
                        <p className="text-5xl font-black dark:text-white tracking-tighter">{s.val}</p>
                      </div>
                      <div className={`size-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform shadow-inner`}>
                        <span className="material-symbols-outlined text-3xl font-bold">{s.icon}</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="bg-[#0f1a13] rounded-[56px] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-1000" />
                  <div className="max-w-2xl space-y-10 relative z-10">
                    <h2 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter">Votre futur <br/><span className="text-primary italic underline decoration-primary/20 underline-offset-8">académique</span>.</h2>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed">Déposez votre dossier dans les meilleurs établissements du Bénin et suivez votre admission en temps réel.</p>
                    <Link to="/majors" className="inline-flex items-center gap-4 bg-primary text-black font-black px-12 py-5 rounded-[24px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest group/btn">
                      Parcourir les filières
                      <span className="material-symbols-outlined font-black group-hover/btn:translate-x-2 transition-transform">east</span>
                    </Link>
                  </div>
               </div>

               <section className="space-y-8">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Suivi des candidatures</h3>
                    <button onClick={() => setActiveTab('applications')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all">Gérer tout</button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {userApplications.map((app) => (
                      <div key={app.id} className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-[48px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 group hover:shadow-hover transition-all duration-500 shadow-premium">
                        <div className="flex items-center gap-10 flex-1 w-full text-left">
                           <div className={`size-20 rounded-[32px] bg-primary/5 flex items-center justify-center text-primary shadow-inner border border-primary/10 shrink-0`}>
                              <span className="material-symbols-outlined text-4xl font-bold">description</span>
                           </div>
                           <div className="space-y-2">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full">Dossier #{app.id}</span>
                              <h4 className="text-3xl font-black dark:text-white tracking-tighter leading-none group-hover:text-primary transition-colors">{app.majorName}</h4>
                              <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">account_balance</span>
                                {app.universityName}
                              </p>
                           </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                           <div className="text-center sm:text-right">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Statut du Paiement</p>
                              <span className="flex items-center gap-2 px-6 py-2 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                                <span className="material-symbols-outlined text-sm font-black">payments</span>
                                Validé
                              </span>
                           </div>
                           <div className="h-12 w-px bg-gray-100 dark:bg-white/5 hidden sm:block" />
                           <div className="text-center sm:text-right">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Admission</p>
                              <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                app.status === 'Validé' ? 'text-primary bg-primary/10 border-primary/20' : 
                                app.status === 'Rejeté' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                              }`}>
                                {app.status}
                              </span>
                           </div>
                           <button onClick={() => navigate(`/major/${app.majorId}`)} className="size-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all shrink-0 hover:scale-110 shadow-sm">
                              <span className="material-symbols-outlined text-2xl">visibility</span>
                           </button>
                        </div>
                      </div>
                    ))}
                    {userApplications.length === 0 && (
                      <div className="text-center py-24 bg-white dark:bg-surface-dark rounded-[56px] border-2 border-dashed border-gray-100 dark:border-white/5 group hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined text-6xl text-gray-200 mb-6 block group-hover:scale-110 transition-transform">folder_open</span>
                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Aucun dossier en cours d'instruction.</p>
                        <Link to="/majors" className="inline-block mt-8 text-primary font-black uppercase text-[10px] tracking-widest hover:underline">Initier ma première candidature</Link>
                      </div>
                    )}
                  </div>
               </section>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-12 animate-fade-in text-left">
              <div className="space-y-2">
                <h2 className="text-4xl lg:text-5xl font-black dark:text-white tracking-tighter uppercase">Portefeuille Dossiers</h2>
                <p className="text-gray-500 font-medium italic">Archive complète de vos interactions académiques.</p>
              </div>
              <div className="grid grid-cols-1 gap-8">
                 {userApplications.map(app => (
                   <div key={app.id} className="bg-white dark:bg-surface-dark p-10 lg:p-16 rounded-[64px] border border-gray-100 dark:border-white/5 shadow-premium hover:border-primary/30 transition-all duration-700">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
                        <div className="space-y-8 flex-1">
                           <div className="space-y-3">
                              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-6 py-2 rounded-full border border-primary/20">Identifiant : {app.id}</span>
                              <h3 className="text-4xl lg:text-5xl font-black dark:text-white tracking-tighter leading-none">{app.majorName}</h3>
                              <p className="text-gray-500 font-bold text-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">location_city</span>
                                {app.universityName}
                              </p>
                           </div>
                           <div className="flex flex-wrap gap-3">
                              {app.documents && app.documents.length > 0 ? app.documents.map((doc: any, i: number) => (
                                <a key={i} href={doc.url ? `https://api.cipaph.com${doc.url}` : '#'} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black text-gray-500 border border-gray-100 dark:border-white/10 flex items-center gap-2 hover:bg-primary hover:text-black hover:border-primary transition-all">
                                   <span className="material-symbols-outlined text-sm">attach_file</span>
                                   Pièce #{i+1}
                                </a>
                              )) : null}
                              {app.primary_document_url && (
                                <a href={app.primary_document_url} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-blue-500/10 rounded-2xl text-[10px] font-black text-blue-500 border border-blue-500/20 flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                                  <span className="material-symbols-outlined text-sm">description</span>
                                  Dossier PDF
                                </a>
                              )}
                           </div>
                        </div>
                        <div className="text-left lg:text-right space-y-4 bg-gray-50 dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/10 min-w-[280px]">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date de dépôt</p>
                              <p className="text-lg font-black dark:text-white">{app.date}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">État du dossier</p>
                              <span className={`inline-block px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                                app.status === 'Validé' ? 'bg-primary text-black shadow-primary/20' : 
                                app.status === 'Rejeté' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-amber-400 text-black shadow-amber-400/20'
                              }`}>
                                {app.status}
                              </span>
                           </div>
                        </div>
                      </div>
                   </div>
                 ))}
                 {userApplications.length === 0 && (
                   <div className="text-center py-32 bg-white dark:bg-surface-dark rounded-[64px] border-2 border-dashed border-gray-100">
                     <p className="text-gray-500 font-black uppercase text-xs tracking-widest mb-4">Aucune interaction détectée.</p>
                     <Link to="/majors" className="inline-block text-primary font-black uppercase text-[10px] tracking-widest hover:underline">Lancer une candidature</Link>
                   </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-12 animate-fade-in max-w-5xl text-left">
              <div className="space-y-2">
                <h2 className="text-4xl lg:text-5xl font-black dark:text-white tracking-tighter uppercase">Profil Nexus</h2>
                <p className="text-gray-500 font-medium italic">Informations d'identité et de sécurité.</p>
              </div>

              <div className="bg-white dark:bg-surface-dark rounded-[56px] p-12 lg:p-20 border border-gray-100 dark:border-white/5 shadow-premium space-y-16">
                <div className="flex flex-col md:flex-row items-center gap-12 border-b border-gray-50 dark:border-white/5 pb-16">
                   <div className="size-32 lg:size-40 rounded-[48px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner group">
                      <span className="material-symbols-outlined text-7xl font-bold group-hover:scale-110 transition-transform">account_circle</span>
                   </div>
                   <div className="space-y-3 text-center md:text-left">
                      <h3 className="text-4xl lg:text-5xl font-black dark:text-white tracking-tighter leading-none">{user.firstName} {user.lastName}</h3>
                      <p className="text-gray-400 font-black uppercase text-[11px] tracking-[0.3em]">Candidat Autorisé • Session 2024</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                         <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-sm">
                           <span className="material-symbols-outlined text-sm font-black">verified</span>
                           Compte Nexus Certifié
                         </span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                   {[
                     { label: 'Nom & Prénom', val: `${user.firstName} ${user.lastName}`, icon: 'badge' },
                     { label: 'Identifiant Unique', val: `NXS-${displayId}`, icon: 'fingerprint' },
                     { label: 'Adresse de messagerie', val: user.email, icon: 'alternate_email' },
                     { label: 'Accréditation', val: user.role === 'student' ? 'Étudiant' : user.role, icon: 'security' }
                   ].map((info, idx) => (
                     <div key={idx} className="space-y-3 group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-xs">{info.icon}</span>
                          {info.label}
                        </label>
                        <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 font-black dark:text-white tracking-tight text-lg group-hover:border-primary/30 transition-all shadow-sm">
                           {info.val}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-10 flex flex-wrap gap-6 border-t border-gray-50 dark:border-white/5">
                   <button className="px-12 py-5 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                      Actualiser les données
                   </button>
                   <button className="px-12 py-5 bg-white/5 text-gray-500 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 hover:text-white transition-all">
                      Sécurité & Mot de passe
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
