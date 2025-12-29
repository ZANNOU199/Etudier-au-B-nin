
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const MajorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { majors } = useCMS();
  const major = majors.find(m => m.id === id);

  if (!major) return <div className="p-20 text-center font-black dark:text-white">Filière non trouvée ou supprimée.</div>;

  return (
    <div className="w-full flex flex-col items-center font-display bg-[#f8faf9] dark:bg-background-dark min-h-screen">
      <div className="max-w-7xl w-full px-4 lg:px-10 py-10 flex flex-col gap-10">
        <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link to="/majors" className="hover:text-primary transition-colors">Filières</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-gray-900 dark:text-white">{major.name}</span>
        </nav>

        <div className="bg-white dark:bg-surface-dark p-8 md:p-16 rounded-[48px] border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col lg:flex-row gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex-1 space-y-10 relative z-10">
            <div className="flex flex-wrap gap-3">
               <span className="px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">{major.level}</span>
               <span className="px-5 py-2 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Accrédité LMD</span>
               <span className="px-5 py-2 rounded-full bg-amber-400/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-400/20">{major.domain}</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] dark:text-white">
                {major.name}
              </h1>
              <div className="h-1.5 w-24 bg-primary rounded-full"></div>
            </div>

            <div className="flex items-center gap-6 p-8 rounded-[32px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 group hover:border-primary/30 transition-all shadow-sm">
              <div className="size-20 rounded-3xl bg-white dark:bg-surface-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-gray-100 dark:border-white/10 shrink-0">
                <span className="material-symbols-outlined text-primary text-4xl font-bold">account_balance</span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Établissement hôte</p>
                <Link to={`/university/${major.universityId}`} className="text-2xl font-black hover:text-primary transition-colors dark:text-white tracking-tight">{major.universityName}</Link>
                <p className="text-sm font-bold text-gray-500 italic">{major.facultyName}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
               <Link to={`/apply?id=${major.id}`} className="px-16 py-6 bg-primary text-black font-black rounded-3xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all text-center uppercase tracking-widest text-xs flex items-center justify-center gap-3 group">
                 DÉBUTER LA PRÉ-INSCRIPTION
                 <span className="material-symbols-outlined font-black group-hover:translate-x-2 transition-transform">arrow_forward</span>
               </Link>
            </div>
          </div>

          <div className="lg:w-96 shrink-0 relative z-10">
            <div className="bg-[#0f1a13] p-12 rounded-[48px] shadow-3xl space-y-12 text-white relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <span className="material-symbols-outlined text-[120px]">info</span>
              </div>
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-start gap-5">
                  <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined font-bold">schedule</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Durée du cycle</p>
                    <p className="text-2xl font-black tracking-tight">{major.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined font-bold">location_on</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Ville de formation</p>
                    <p className="text-2xl font-black tracking-tight">{major.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined font-bold">payments</span>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Détails : Débouchés & Diplômes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="bg-white dark:bg-surface-dark p-10 md:p-16 rounded-[56px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined font-bold">work</span></div>
                 <h2 className="text-2xl font-black dark:text-white tracking-tight uppercase tracking-[0.1em] text-sm">Débouchés Professionnels</h2>
              </div>
              <p className="text-gray-500 font-medium">Les métiers auxquels cette formation vous prépare directement.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {major.careerProspects && major.careerProspects.length > 0 ? (
                major.careerProspects.map((cp, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 group hover:border-primary/20 transition-all">
                    <span className="material-symbols-outlined text-primary text-xl font-black group-hover:scale-110 transition-transform">{cp.icon}</span>
                    <span className="text-sm font-black dark:text-white">{cp.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">Informations en attente de validation.</p>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-surface-dark p-10 md:p-16 rounded-[56px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-500"><span className="material-symbols-outlined font-bold">assignment_ind</span></div>
                 <h2 className="text-2xl font-black dark:text-white tracking-tight uppercase tracking-[0.1em] text-sm">Conditions d'Admission</h2>
              </div>
              <p className="text-gray-500 font-medium">Les prérequis indispensables pour valider votre dossier.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {major.requiredDiplomas && major.requiredDiplomas.length > 0 ? (
                major.requiredDiplomas.map((rd, idx) => (
                  <div key={idx} className="flex items-center gap-5 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 group hover:border-amber-400/20 transition-all">
                    <div className="size-12 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center text-amber-500 shadow-sm group-hover:rotate-6 transition-transform">
                      <span className="material-symbols-outlined text-2xl font-black">{rd.icon}</span>
                    </div>
                    <span className="text-lg font-black dark:text-white tracking-tight">{rd.name}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-5 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <div className="size-12 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center text-amber-500">
                    <span className="material-symbols-outlined text-2xl font-black">history_edu</span>
                  </div>
                  <span className="text-lg font-black dark:text-white">BAC toutes séries</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="bg-white dark:bg-surface-dark p-10 md:p-16 rounded-[56px] border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-3xl font-black dark:text-white tracking-tight mb-10 flex items-center gap-4">
             <span className="material-symbols-outlined text-primary text-3xl">description</span>
             Présentation du programme
          </h2>
          <div className="prose prose-stone dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-medium text-lg leading-relaxed space-y-6">
            <p>Le parcours <span className="text-primary font-black">{major.name}</span> à <span className="font-bold text-text-main dark:text-white">{major.universityName}</span> est conçu pour former des cadres hautement qualifiés. Ce programme intègre les dernières innovations de son domaine pour répondre aux exigences du marché de l'emploi béninois et international.</p>
            <p>Les cours sont dispensés par des experts académiques et des professionnels du secteur, favorisant ainsi une immersion pratique dès les premières années du cycle.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MajorDetail;
