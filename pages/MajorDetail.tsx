
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

        <div className="bg-white dark:bg-surface-dark p-10 md:p-16 rounded-[48px] border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-8">
            <div className="flex flex-wrap gap-3">
               <span className="px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">{major.level}</span>
               <span className="px-5 py-2 rounded-full bg-gray-50 dark:bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-800">Accrédité LMD</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none dark:text-white">
              {major.name}
            </h1>

            <div className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
              <div className="size-16 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-primary text-4xl font-bold">school</span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Établissement hôte</p>
                <Link to={`/university/${major.universityId}`} className="text-xl font-black hover:text-primary transition-colors dark:text-white">{major.universityName}</Link>
                <p className="text-sm font-bold text-gray-500">{major.facultyName}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
               <Link to={`/apply?id=${major.id}`} className="px-12 py-5 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-center uppercase tracking-widest text-xs">
                 DÉBUTER LA PRÉ-INSCRIPTION
               </Link>
            </div>
          </div>

          <div className="lg:w-96">
            <div className="bg-[#0f1a13] p-10 rounded-[40px] shadow-2xl space-y-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-[80px]">info</span>
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary font-bold">schedule</span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Durée du cycle</p>
                    <p className="text-xl font-black">{major.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary font-bold">location_on</span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ville de formation</p>
                    <p className="text-xl font-black">{major.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="prose prose-stone dark:prose-invert max-w-none bg-white dark:bg-surface-dark p-10 md:p-16 rounded-[48px] border border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-black dark:text-white tracking-tight mb-8">Présentation du programme</h2>
          <div className="text-gray-600 dark:text-gray-400 font-medium text-lg leading-relaxed space-y-6">
            <p>Cette formation est une référence nationale pour les bacheliers souhaitant s'orienter vers les métiers d'avenir.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MajorDetail;
