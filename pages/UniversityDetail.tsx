
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UNIVERSITIES } from '../constants';

const UniversityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showAllFaculties, setShowAllFaculties] = useState(false);
  
  const uni = UNIVERSITIES.find(u => u.id === id);

  if (!uni) return <div className="p-20 text-center">Université non trouvée.</div>;

  const displayedFaculties = showAllFaculties ? uni.faculties : uni.faculties.slice(0, 3);

  return (
    <div className="relative flex flex-col w-full">
      <main className="flex-1 flex flex-col items-center py-6 px-4 lg:px-10">
        <div className="w-full max-w-7xl flex flex-col gap-6">
          <nav className="flex flex-wrap gap-2 text-sm text-text-secondary mb-2">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link to="/universities" className="hover:text-primary">Universités</Link>
            <span>/</span>
            <span className="text-text-main dark:text-white font-medium">{uni.name}</span>
          </nav>

          <section className="rounded-3xl overflow-hidden relative shadow-lg min-h-[450px] flex flex-col justify-end p-8 md:p-16 text-white"
                   style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url(${uni.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="flex flex-col gap-4 max-w-3xl relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary text-[#0d1b13] text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{uni.type}</span>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-widest">Accrédité LMD</span>
              </div>
              <h1 className="text-4xl lg:text-7xl font-black leading-none tracking-tighter">{uni.name}</h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">{uni.description}</p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/apply" className="flex items-center justify-center rounded-2xl h-14 px-10 bg-primary hover:bg-[#0fd660] transition-all text-[#0d1b13] text-lg font-black shadow-xl shadow-primary/20 hover:scale-105">
                  Pré-inscription
                </Link>
                <button className="flex items-center justify-center rounded-2xl h-14 px-10 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-lg font-black border border-white/20 transition-all">
                  Brochure PDF
                </button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Étudiants', val: uni.stats.students, icon: 'groups' },
              { label: 'Formations', val: uni.stats.majors, icon: 'school' },
              { label: 'Classement', val: uni.stats.ranking, icon: 'workspace_premium' },
              { label: 'Fondée en', val: uni.stats.founded, icon: 'calendar_month' }
            ].map((s, idx) => (
              <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined font-bold">{s.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">{s.label}</span>
                </div>
                <p className="text-3xl font-black dark:text-white tracking-tight">{s.val}</p>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h3 className="text-text-main dark:text-white text-3xl font-black tracking-tight flex items-center gap-3">
                    Écoles & Facultés
                  </h3>
                  {uni.faculties.length > 3 && (
                    <button 
                      onClick={() => setShowAllFaculties(!showAllFaculties)}
                      className="text-primary font-black flex items-center gap-1 hover:underline text-sm uppercase tracking-widest"
                    >
                      {showAllFaculties ? 'Réduire' : `Voir tout (${uni.faculties.length})`}
                      <span className="material-symbols-outlined text-lg">{showAllFaculties ? 'expand_less' : 'expand_more'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {displayedFaculties.map(faculty => (
                    <div key={faculty.id} className="bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-gray-800 p-8 hover:shadow-xl transition-all relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary group-hover:w-3 transition-all"></div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <h4 className="text-2xl font-black group-hover:text-primary transition-colors dark:text-white tracking-tight">{faculty.name}</h4>
                          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{faculty.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {faculty.levels.map(l => (
                              <span key={l} className="px-3 py-1 bg-primary/10 text-primary font-black text-[10px] rounded-full uppercase tracking-widest">
                                {l}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link 
                          to={`/majors?search=${faculty.name}`}
                          className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-black transition-all"
                        >
                          <span className="material-symbols-outlined font-bold">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-surface-dark rounded-[40px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm sticky top-24 space-y-8">
                <h3 className="text-xl font-black dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Contact & Accès</h3>
                <ul className="space-y-8">
                  <li className="flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Adresse Siège</p>
                      <p className="text-sm font-bold dark:text-white leading-relaxed">Route de l'Université, Abomey-Calavi, Bénin</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-2xl">call</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Support Inscription</p>
                      <p className="text-sm font-bold dark:text-white">+229 21 36 00 74</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Académique</p>
                      <p className="text-sm font-bold dark:text-white">scolarite@uac.bj</p>
                    </div>
                  </li>
                </ul>
                <div className="pt-4">
                   <Link to="/contact" className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-primary transition-all dark:text-white">
                      Demander Conseil
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UniversityDetail;
