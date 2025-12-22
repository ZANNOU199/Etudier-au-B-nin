
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AdminView = 'overview' | 'applications' | 'analytics' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const navigate = useNavigate();

  const kpis = [
    { label: 'Total Pré-inscriptions', val: '12 450', change: '+12%', color: 'border-primary', icon: 'school', trend: 'up' },
    { label: 'Dossiers en attente', val: '450', change: '-5%', color: 'border-amber-400', icon: 'hourglass_bottom', trend: 'down' },
    { label: 'Dossiers validés', val: '11 200', change: '+18%', color: 'border-primary-dark', icon: 'check_circle', trend: 'up' },
    { label: 'Revenus générés', val: '24.5M CFA', change: '+10%', color: 'border-blue-500', icon: 'payments', trend: 'up' }
  ];

  const recentApps = [
    { name: 'Aïcha Dossou', uni: 'UAC', major: 'Génie Logiciel', status: 'En attente', color: 'text-amber-500 bg-amber-500/10', date: 'Il y a 2h' },
    { name: 'Jean Kocou', uni: 'HECM', major: 'Marketing', status: 'Validé', color: 'text-primary bg-primary/10', date: 'Il y a 5h' },
    { name: 'Aminata Maiga', uni: 'UP', major: 'Médecine', status: 'Incomplet', color: 'text-red-500 bg-red-500/10', date: 'Il y a 1j' },
    { name: 'Koffi Mensah', uni: 'UAC', major: 'Génie Civil', status: 'En attente', color: 'text-amber-500 bg-amber-500/10', date: 'Il y a 2j' }
  ];

  return (
    <div className="flex h-screen w-full bg-[#f8faf9] dark:bg-background-dark font-display">
      {/* Admin Sidebar */}
      <aside className="w-72 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark flex flex-col py-10 px-6 gap-10">
        <div className="flex items-center gap-4 px-2">
          <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-3xl font-bold">shield_person</span>
          </div>
          <div>
            <span className="font-black text-lg dark:text-white tracking-tighter uppercase leading-none block">Admin Hub</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contrôle National</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: 'dashboard' },
            { id: 'applications', label: 'Candidatures', icon: 'description' },
            { id: 'analytics', label: 'Analytique', icon: 'analytics' },
            { id: 'settings', label: 'Paramètres', icon: 'settings_account_box' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeView === item.id ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={() => navigate('/login')} className="flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all mt-auto">
          <span className="material-symbols-outlined text-xl">logout</span>
          Déconnexion
        </button>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 overflow-y-auto p-10 space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-1">
              <h1 className="text-4xl font-black dark:text-white tracking-tighter">
                {activeView === 'overview' && 'Vue d\'ensemble'}
                {activeView === 'applications' && 'Gestion des Candidatures'}
                {activeView === 'analytics' && 'Rapports & Statistiques'}
                {activeView === 'settings' && 'Profil Administrateur'}
              </h1>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">
                {activeView === 'overview' && 'Statistiques en temps réel des admissions nationales.'}
                {activeView === 'applications' && 'Vérifiez et validez les dossiers d\'inscription entrants.'}
                {activeView === 'analytics' && 'Analyse détaillée des performances des universités.'}
                {activeView === 'settings' && 'Gérez vos accès et préférences de notification.'}
              </p>
           </div>
           
           <div className="flex gap-4">
              <div className="size-12 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 relative">
                 <span className="material-symbols-outlined">notifications</span>
                 <div className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></div>
              </div>
              <button className="px-8 py-3.5 bg-[#0f1a13] dark:bg-primary dark:text-black text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-[11px] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">download</span> Exporter Rapport
              </button>
           </div>
        </header>

        {/* VIEW: OVERVIEW */}
        {activeView === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {kpis.map((kpi, idx) => (
                 <div key={idx} className={`p-8 bg-white dark:bg-surface-dark rounded-[32px] border-l-[6px] ${kpi.color} shadow-sm space-y-6 hover:shadow-xl transition-all group`}>
                    <div className="flex justify-between items-center">
                      <div className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined font-bold">{kpi.icon}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase ${kpi.trend === 'up' ? 'text-primary' : 'text-red-400'}`}>
                        {kpi.change} {kpi.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </div>
                    <div>
                      <p className="text-3xl font-black dark:text-white tracking-tight">{kpi.val}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{kpi.label}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <section className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="text-xl font-black dark:text-white tracking-tight">Dernières Candidatures</h3>
                  <button onClick={() => setActiveView('applications')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Voir tout</button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="text-[10px] font-black uppercase text-gray-400 border-b border-gray-50 dark:border-gray-800">
                         <th className="px-8 py-4">Candidat</th>
                         <th className="px-8 py-4">Université</th>
                         <th className="px-8 py-4">Statut</th>
                         <th className="px-8 py-4 text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                       {recentApps.map((row, i) => (
                         <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-5">
                             <div className="flex items-center gap-4">
                               <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                 {row.name.charAt(0)}
                               </div>
                               <div>
                                 <p className="text-sm font-black dark:text-white">{row.name}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase">{row.major}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-8 py-5 text-sm font-bold dark:text-gray-300">{row.uni}</td>
                           <td className="px-8 py-5">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${row.color}`}>
                               {row.status}
                             </span>
                           </td>
                           <td className="px-8 py-5 text-right">
                             <button className="text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black px-4 py-2 rounded-lg transition-all border border-primary/20">Examiner</button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              </section>

              <div className="space-y-6">
                <div className="bg-[#0f1a13] p-8 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <span className="material-symbols-outlined text-8xl">bolt</span>
                  </div>
                  <h3 className="text-xl font-black relative z-10 tracking-tight">Analyse Rapide</h3>
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-4">
                      <span className="text-gray-400 font-bold">Public vs Privé</span>
                      <span className="font-black">65% / 35%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-4">
                      <span className="text-gray-400 font-bold">Taux de validation</span>
                      <span className="font-black text-primary">92%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold">Délai moyen</span>
                      <span className="font-black">1.8 Jours</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                  <h3 className="text-lg font-black dark:text-white tracking-tight">Alertes Systèmes</h3>
                  <div className="space-y-4">
                     <div className="flex gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                        <p className="text-[10px] font-bold text-red-600 dark:text-red-400 leading-tight">42 dossiers avec erreurs d'INE détectées.</p>
                     </div>
                     <div className="flex gap-4 p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
                        <span className="material-symbols-outlined text-primary">info</span>
                        <p className="text-[10px] font-bold text-gray-500 leading-tight">Mise à jour du serveur prévue ce soir à 23:00.</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: APPLICATIONS (Placeholder for table with filtering) */}
        {activeView === 'applications' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white dark:bg-surface-dark p-4 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4">
               <div className="flex-1 flex items-center h-14 bg-gray-50 dark:bg-white/5 rounded-2xl px-6 focus-within:ring-2 focus-within:ring-primary transition-all">
                  <span className="material-symbols-outlined text-gray-400">search</span>
                  <input className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold dark:text-white px-4" placeholder="Chercher par nom, INE ou Dossier ID..." />
               </div>
               <select className="md:w-64 bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest dark:text-white cursor-pointer focus:ring-2 focus:ring-primary">
                  <option>Tous les statuts</option>
                  <option>En attente</option>
                  <option>Validé</option>
                  <option>Incomplet</option>
               </select>
            </div>
            
            <div className="bg-white dark:bg-surface-dark rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden min-h-[500px] flex items-center justify-center text-gray-300 flex-col gap-4">
               <span className="material-symbols-outlined text-8xl font-thin">table_view</span>
               <p className="font-black uppercase tracking-[0.3em] text-[10px]">Chargement des données détaillées...</p>
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS / PROFILE */}
        {activeView === 'settings' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
             <div className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-10">
                <div className="flex items-center gap-4 pb-8 border-b border-gray-50 dark:border-gray-800">
                   <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl">manage_accounts</span>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black dark:text-white tracking-tight leading-none mb-1">Mon Compte Administrateur</h3>
                      <p className="text-sm font-medium text-gray-500">Modifiez vos identifiants et préférez vos notifications.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom complet</label>
                      <input defaultValue="Admin National" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-0 font-bold dark:text-white outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email professionnel</label>
                      <input defaultValue="contact@mesrs.bj" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-0 font-bold dark:text-white outline-none transition-all" />
                   </div>
                </div>

                <div className="pt-6 flex justify-end">
                   <button className="px-12 py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-105 transition-all">Sauvegarder les modifications</button>
                </div>
             </div>

             <div className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-10">
                <div className="flex items-center gap-4 pb-8 border-b border-gray-50 dark:border-gray-800">
                   <div className="size-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                      <span className="material-symbols-outlined text-3xl">security</span>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black dark:text-white tracking-tight leading-none mb-1">Sécurité Avancée</h3>
                      <p className="text-sm font-medium text-gray-500">Authentification à deux facteurs et changement de mot de passe.</p>
                   </div>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                   <div className="space-y-1">
                      <h4 className="text-sm font-black dark:text-white">Authentification 2FA</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Désactivé actuellement</p>
                   </div>
                   <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest dark:text-white hover:border-primary transition-all">Activer</button>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
