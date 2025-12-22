
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AdminView = 'overview' | 'applications' | 'analytics' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null); // For details modal
  const navigate = useNavigate();

  const kpis = [
    { label: 'Total Pré-inscriptions', val: '12 450', change: '+12%', color: 'bg-primary/10 text-primary', icon: 'school', trend: 'up' },
    { label: 'En attente', val: '450', change: '-5%', color: 'bg-amber-400/10 text-amber-500', icon: 'hourglass_empty', trend: 'down' },
    { label: 'Dossiers validés', val: '11 200', change: '+18%', color: 'bg-blue-500/10 text-blue-500', icon: 'verified', trend: 'up' },
    { label: 'Revenus (CFA)', val: '24.5M', change: '+10%', color: 'bg-purple-500/10 text-purple-500', icon: 'payments', trend: 'up' }
  ];

  const recentApps = [
    { id: 'APP-9021', name: 'Aïcha Dossou', uni: 'UAC', major: 'Génie Logiciel', status: 'Pending', date: 'Il y a 2h', avatar: 'https://i.pravatar.cc/150?u=aicha', phone: '+229 90 00 11 22', doc: 'Diplôme_BAC.pdf' },
    { id: 'APP-8842', name: 'Jean Kocou', uni: 'HECM', major: 'Marketing Digital', status: 'Approved', date: 'Il y a 5h', avatar: 'https://i.pravatar.cc/150?u=jean', phone: '+229 97 44 55 66', doc: 'Acte_Naissance.pdf' },
    { id: 'APP-7731', name: 'Aminata Maiga', uni: 'UP', major: 'Médecine Générale', status: 'Rejected', date: 'Il y a 1j', avatar: 'https://i.pravatar.cc/150?u=ami', phone: '+229 66 11 22 33', doc: 'Releve_Notes.pdf' },
    { id: 'APP-6650', name: 'Koffi Mensah', uni: 'UAC', major: 'Génie Civil', status: 'Pending', date: 'Il y a 2j', avatar: 'https://i.pravatar.cc/150?u=koffi', phone: '+229 95 88 99 00', doc: 'Dossier_Complet.pdf' }
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
    <div className="flex h-screen w-full bg-[#f4f7f5] dark:bg-background-dark font-display overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark flex flex-col py-10 px-6 shrink-0 z-20">
        <div className="flex items-center gap-4 px-4 mb-12">
          <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-3xl font-bold">shield_person</span>
          </div>
          <div>
            <h2 className="font-black text-xl dark:text-white tracking-tighter leading-none">ADMIN HUB</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gestion Académique</p>
          </div>
        </div>

        <nav className="flex flex-col gap-3 flex-grow">
          {[
            { id: 'overview', label: 'Tableau de bord', icon: 'dashboard' },
            { id: 'applications', label: 'Candidatures', icon: 'description' },
            { id: 'analytics', label: 'Statistiques', icon: 'leaderboard' },
            { id: 'settings', label: 'Paramètres', icon: 'settings' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${activeView === item.id ? 'bg-primary text-black shadow-xl shadow-primary/10' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
              {activeView === item.id && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-black/10"></div>}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Administrateur</p>
            <div className="flex items-center gap-3">
               <div className="size-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-black">AD</div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-black dark:text-white truncate">Gervais Dossou</p>
                  <p className="text-[9px] text-gray-400 font-bold truncate">Superviseur National</p>
               </div>
            </div>
          </div>
          <button onClick={() => navigate('/login')} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-transparent hover:border-red-100">
            <span className="material-symbols-outlined text-xl">logout</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
           <div className="space-y-1">
              <h1 className="text-4xl font-black dark:text-white tracking-tighter uppercase">
                {activeView === 'overview' && 'Console de Pilotage'}
                {activeView === 'applications' && 'Gestion des Dossiers'}
                {activeView === 'analytics' && 'Rapports de Session'}
                {activeView === 'settings' && 'Configuration Système'}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 font-bold">
                 <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                 <p className="text-sm">Session 2024-2025 • Mise à jour instantanée</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                <input 
                  type="text" 
                  placeholder="Rechercher INE ou Nom..." 
                  className="w-full lg:w-72 pl-12 pr-4 py-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 text-sm font-bold dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="size-14 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-primary transition-all relative">
                 <span className="material-symbols-outlined">notifications</span>
                 <span className="absolute top-4 right-4 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
              </button>
           </div>
        </header>

        {/* OVERVIEW VIEW */}
        {activeView === 'overview' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               {kpis.map((kpi, idx) => (
                 <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all group flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                      <div className={`size-14 rounded-2xl flex items-center justify-center ${kpi.color}`}>
                        <span className="material-symbols-outlined text-2xl font-bold">{kpi.icon}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${kpi.trend === 'up' ? 'bg-primary/10 text-primary-dark' : 'bg-red-500/10 text-red-600'}`}>
                        {kpi.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-4xl font-black dark:text-white tracking-tighter leading-none mb-1">{kpi.val}</p>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                    </div>
                 </div>
               ))}
            </div>

            <section className="bg-white dark:bg-surface-dark rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-50 dark:border-gray-800">
                 <h3 className="text-2xl font-black dark:text-white tracking-tight">Dossiers Prioritaires</h3>
                 <div className="flex gap-3">
                    <button className="px-8 py-3 bg-black dark:bg-primary text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10">Exporter le flux</button>
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] font-black uppercase text-gray-400 border-b border-gray-50 dark:border-gray-800">
                      <th className="px-10 py-6 text-left">Candidat</th>
                      <th className="px-10 py-6 text-left">Filière / Université</th>
                      <th className="px-10 py-6 text-left">Statut</th>
                      <th className="px-10 py-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {recentApps.map((app, i) => (
                      <tr key={i} className="group hover:bg-gray-50/80 dark:hover:bg-white/5 transition-all">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <img src={app.avatar} className="size-12 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-sm" alt={app.name} />
                            <div>
                              <p className="text-sm font-black dark:text-white leading-tight">{app.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase">{app.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-xs font-black dark:text-gray-200">{app.major}</p>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{app.uni}</p>
                        </td>
                        <td className="px-10 py-8">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                            {getStatusLabel(app.status)}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => setSelectedApp(app)} className="size-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                               <span className="material-symbols-outlined text-xl">visibility</span>
                             </button>
                             <button className="size-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                               <span className="material-symbols-outlined text-xl">check_circle</span>
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

        {/* ANALYTICS VIEW */}
        {activeView === 'analytics' && (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-700">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stats Chart 1 */}
                <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                   <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-xs mb-2">Inscriptions par mois</h3>
                        <p className="text-4xl font-black dark:text-white tracking-tighter">12.4K <span className="text-xs text-primary">+14%</span></p>
                      </div>
                      <div className="flex gap-1 h-20 items-end">
                         {[30, 50, 45, 80, 65, 90, 100].map((h, i) => (
                           <div key={i} style={{ height: `${h}%` }} className="w-3 bg-primary/20 hover:bg-primary rounded-t-lg transition-all cursor-help" title={`Mois ${i+1}`}></div>
                         ))}
                      </div>
                   </div>
                   <div className="h-px bg-gray-100 dark:bg-gray-800"></div>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                         <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Public</p>
                         <p className="text-lg font-black dark:text-white">65%</p>
                      </div>
                      <div className="text-center border-x border-gray-100 dark:border-gray-800">
                         <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Privé</p>
                         <p className="text-lg font-black dark:text-white">25%</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Étranger</p>
                         <p className="text-lg font-black dark:text-white">10%</p>
                      </div>
                   </div>
                </div>

                {/* Popular Domains */}
                <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                   <h3 className="text-xl font-black dark:text-white tracking-tight">Top Filières Demandées</h3>
                   <div className="space-y-4">
                      {[
                        { name: 'Informatique (GL)', val: '4,200', p: 85 },
                        { name: 'Médecine Générale', val: '2,100', p: 65 },
                        { name: 'Génie Civil', val: '1,850', p: 45 },
                        { name: 'Marketing Digital', val: '980', p: 30 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-500">
                             <span>{item.name}</span>
                             <span className="dark:text-white">{item.val}</span>
                           </div>
                           <div className="h-2 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
                              <div style={{ width: `${item.p}%` }} className="h-full bg-primary rounded-full"></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="bg-[#0f1a13] p-12 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
                <div className="absolute -bottom-20 -left-20 size-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 space-y-4 text-center md:text-left">
                   <h3 className="text-3xl font-black tracking-tight leading-none">Rapport de Performance Annuel</h3>
                   <p className="text-gray-400 font-medium max-w-md">Analysez l'évolution des candidatures sur les 5 dernières années pour ajuster les quotas.</p>
                </div>
                <button className="relative z-10 px-10 py-5 bg-primary text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">Télécharger l'audit complet</button>
             </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeView === 'settings' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                 <div className="flex items-center gap-4 pb-6 border-b border-gray-50 dark:border-gray-800">
                    <span className="material-symbols-outlined text-primary font-bold">tune</span>
                    <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-xs">Paramètres de la Plateforme</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                       <div className="space-y-1">
                          <p className="font-black dark:text-white text-sm">Ouverture des inscriptions</p>
                          <p className="text-xs text-gray-500 font-medium">Activer ou désactiver le dépôt de dossier public.</p>
                       </div>
                       <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                          <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date limite session principale</label>
                          <input type="date" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-transparent dark:text-white font-bold focus:border-primary focus:ring-0 outline-none transition-all" defaultValue="2025-10-30" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quota par filière (Général)</label>
                          <input type="number" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-transparent dark:text-white font-bold focus:border-primary focus:ring-0 outline-none transition-all" defaultValue="150" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                 <div className="flex items-center gap-4 pb-6 border-b border-gray-50 dark:border-gray-800">
                    <span className="material-symbols-outlined text-primary font-bold">admin_panel_settings</span>
                    <h3 className="text-xl font-black dark:text-white tracking-tight uppercase tracking-widest text-xs">Équipe d'Administration</h3>
                 </div>
                 <div className="space-y-4">
                    {[
                      { name: 'Gervais Dossou', role: 'Directeur National', access: 'Total' },
                      { name: 'Berthe Lawson', role: 'Gestionnaire Cotonou', access: 'Limité' },
                    ].map((admin, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">{admin.name[0]}</div>
                            <div>
                               <p className="text-sm font-black dark:text-white">{admin.name}</p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{admin.role}</p>
                            </div>
                         </div>
                         <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">{admin.access}</span>
                      </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-[10px] font-black text-gray-400 hover:text-primary hover:border-primary transition-all uppercase tracking-widest">Ajouter un administrateur</button>
                 </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                 <button className="px-8 py-4 bg-gray-50 dark:bg-white/5 dark:text-white font-black rounded-2xl uppercase tracking-widest text-[10px] border border-gray-100 dark:border-gray-800">Annuler</button>
                 <button className="px-10 py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Sauvegarder les modifications</button>
              </div>
           </div>
        )}

        {/* DETAILS MODAL */}
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 space-y-8">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-6">
                        <img src={selectedApp.avatar} className="size-20 rounded-[32px] object-cover border-4 border-white dark:border-gray-800 shadow-xl" alt={selectedApp.name} />
                        <div>
                           <h2 className="text-3xl font-black dark:text-white tracking-tighter">{selectedApp.name}</h2>
                           <p className="text-sm font-bold text-primary uppercase tracking-widest">{selectedApp.id}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedApp(null)} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-all">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filière Demandée</p>
                        <p className="text-lg font-black dark:text-white">{selectedApp.major}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Université</p>
                        <p className="text-lg font-black dark:text-white">{selectedApp.uni}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</p>
                        <p className="text-lg font-black dark:text-white">{selectedApp.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Reçu</p>
                        <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
                           <span className="material-symbols-outlined">description</span>
                           <span className="text-sm font-black">{selectedApp.doc}</span>
                        </div>
                      </div>
                   </div>

                   <div className="pt-6 flex gap-4">
                      <button className="flex-1 py-4 bg-red-50 dark:bg-red-500/10 text-red-600 font-black rounded-2xl uppercase tracking-widest text-[10px] border border-red-100 dark:border-red-500/20">Rejeter le dossier</button>
                      <button className="flex-1 py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Approuver & Notifier</button>
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
