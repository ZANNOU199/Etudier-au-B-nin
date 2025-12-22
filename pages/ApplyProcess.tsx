
import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MAJORS } from '../constants';

const ApplyProcess: React.FC = () => {
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // On récupère l'ID de la formation depuis l'URL (?id=uac-gl)
  const majorId = searchParams.get('id');
  
  // On cherche la formation correspondante dans nos constantes
  const selectedMajor = useMemo(() => {
    return MAJORS.find(m => m.id === majorId) || MAJORS[0]; // Par défaut GL si non trouvé
  }, [majorId]);

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-background-dark flex flex-col font-display">
      {/* Inscription Header */}
      <nav className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="size-10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 group">
             <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
           </button>
           <div>
             <h2 className="font-black dark:text-white tracking-tighter text-sm uppercase">Dossier Numérique</h2>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">ID: EAB-2024-8932</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <Link to="/contact" className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
             <span className="material-symbols-outlined">support_agent</span>
           </Link>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center p-6 md:p-10">
        <div className="max-w-4xl w-full space-y-12">
          
          {/* Progress Indicator */}
          <div className="relative flex items-center justify-between max-w-xl mx-auto mb-10 pt-4">
            <div className="absolute top-10 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 rounded-full"></div>
            <div className="absolute top-10 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-700" style={{ width: `${(step - 1) * 33.3}%` }}></div>
            
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex flex-col items-center gap-3">
                <div className={`size-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-gray-700 text-gray-300'}`}>
                  {step > s ? <span className="material-symbols-outlined font-bold">check</span> : s}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${step >= s ? 'text-primary' : 'text-gray-400'}`}>
                  {['Choix', 'Info', 'Docs', 'Fin'][s-1]}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {step === 1 && (
              <div className="p-8 md:p-16 space-y-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-black dark:text-white tracking-tight">Vérification du choix</h2>
                  <p className="text-gray-500 font-medium italic text-sm">Confirmez la filière avant de passer aux informations personnelles.</p>
                </div>
                
                {/* Formation Card - DYNAMIQUE */}
                <div className="p-8 rounded-[40px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-8 items-center">
                   <div className="size-20 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center shadow-lg text-primary border border-primary/20">
                     <span className="material-symbols-outlined text-4xl font-bold">terminal</span>
                   </div>
                   <div className="text-center md:text-left space-y-1 flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Formation Sélectionnée</p>
                      <h3 className="text-3xl font-black dark:text-white leading-tight">{selectedMajor.level} {selectedMajor.name}</h3>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{selectedMajor.universityName}</p>
                   </div>
                   <div className="px-8 py-4 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Durée</p>
                      <p className="text-lg font-black dark:text-white uppercase">{selectedMajor.duration}</p>
                   </div>
                </div>

                {/* Career Prospects Section - DYNAMIQUE */}
                {selectedMajor.careerProspects && (
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <h4 className="text-[11px] font-black dark:text-white uppercase tracking-[0.3em] flex-shrink-0">Débouchés Professionnels</h4>
                        <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedMajor.careerProspects.map((job, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 group hover:border-primary/40 transition-all hover:bg-white dark:hover:bg-primary/5">
                             <div className="size-10 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors border border-transparent group-hover:border-primary/20 shadow-sm">
                                <span className="material-symbols-outlined text-xl">{job.icon}</span>
                             </div>
                             <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{job.title}</span>
                          </div>
                        ))}
                     </div>
                     <p className="text-[10px] text-center text-gray-400 font-medium italic">
                       * Liste non exhaustive des opportunités après obtention du diplôme.
                     </p>
                  </div>
                )}

                {/* Required Diplomas Section - DYNAMIQUE */}
                {selectedMajor.requiredDiplomas && (
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <h4 className="text-[11px] font-black dark:text-white uppercase tracking-[0.3em] flex-shrink-0">Diplômes Requis</h4>
                        <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                     </div>
                     
                     <div className="flex flex-wrap gap-3">
                        {selectedMajor.requiredDiplomas.map((dip, idx) => (
                          <div key={idx} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
                             <span className="material-symbols-outlined text-primary text-xl font-bold">{dip.icon}</span>
                             <span className="text-xs font-black text-primary uppercase tracking-widest">{dip.name}</span>
                          </div>
                        ))}
                     </div>
                     <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold px-2">
                       <span className="material-symbols-outlined text-sm">info</span>
                       <p className="italic">L'inscription définitive est soumise à l'authenticité de ces diplômes.</p>
                     </div>
                  </div>
                )}

                <div className="flex flex-col items-center gap-6 pt-4">
                   <button 
                    onClick={() => setStep(2)} 
                    className="w-full md:w-auto bg-primary hover:bg-green-400 px-20 py-5 rounded-2xl font-black text-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-3 group"
                   >
                     Valider et Continuer
                     <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                   </button>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Plateforme de référence pour l'Enseignement Supérieur</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-10 md:p-16 space-y-10 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-3xl font-black dark:text-white">Identité & BAC</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Série du BAC</label>
                    <select className="w-full p-4 rounded-2xl border-2 border-gray-50 dark:bg-white/5 dark:border-gray-800 dark:text-white font-bold outline-none focus:border-primary">
                      <option>Série C (Maths & Physiques)</option>
                      <option>Série D (Sciences de la Vie)</option>
                      <option>Série E (Technique)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Numéro de table / INE</label>
                    <input className="w-full p-4 rounded-2xl border-2 border-gray-50 dark:bg-white/5 dark:border-gray-800 dark:text-white font-bold outline-none focus:border-primary" type="text" placeholder="Ex: 12345678" />
                  </div>
                </div>
                <div className="flex justify-between pt-8">
                   <button onClick={() => setStep(1)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">Retour</button>
                   <button onClick={() => setStep(3)} className="bg-primary px-10 py-4 rounded-2xl font-black text-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Suivant</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-10 md:p-16 space-y-10 animate-in fade-in slide-in-from-right-4 text-center">
                <h2 className="text-3xl font-black dark:text-white">Documents</h2>
                <p className="text-gray-500">Glissez-déposez vos justificatifs (BAC, Acte de naissance).</p>
                <div className="py-12 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[32px] flex flex-col items-center gap-4 text-gray-300 hover:text-primary hover:border-primary/50 transition-all cursor-pointer">
                   <span className="material-symbols-outlined text-6xl">cloud_upload</span>
                   <p className="font-bold uppercase text-[10px] tracking-[0.3em]">Cliquez pour uploader</p>
                </div>
                <div className="flex justify-between pt-8">
                   <button onClick={() => setStep(2)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">Retour</button>
                   <button onClick={() => setStep(4)} className="bg-primary px-10 py-4 rounded-2xl font-black text-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Soumettre</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-10 md:p-20 flex flex-col items-center text-center gap-8 animate-in zoom-in-95 duration-500">
                <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 shadow-inner ring-8 ring-primary/5">
                   <span className="material-symbols-outlined text-6xl font-bold">verified</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black dark:text-white tracking-tighter leading-none">C'est envoyé !</h2>
                  <p className="text-gray-500 max-w-md mx-auto font-medium text-lg leading-relaxed">Votre dossier pour <span className="text-primary">{selectedMajor.name}</span> est désormais en cours de traitement.</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 w-full max-sm:px-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Délai estimé de réponse</p>
                   <p className="text-lg font-black dark:text-white">48h à 72h ouvrées</p>
                </div>
                <Link to="/dashboard" className="px-16 py-5 bg-[#0f1a13] dark:bg-primary text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">
                  Retour au Portail
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="py-8 px-6 text-center border-t border-gray-100 dark:border-gray-800 bg-white/50 backdrop-blur-sm">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">Système d'Admission • Portail d'Orientation Académique du Bénin</p>
      </footer>
    </div>
  );
};

export default ApplyProcess;
