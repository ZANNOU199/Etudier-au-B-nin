
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const ApplyProcess: React.FC = () => {
  const { user, majors, addApplication } = useCMS();
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const majorId = searchParams.get('id');
  const selectedMajor = useMemo(() => {
    return majors.find(m => m.id === majorId) || majors[0];
  }, [majorId, majors]);

  const handleFinalSubmit = () => {
    if (!user) return;
    
    addApplication({
      id: 'EAB-2024-' + Math.floor(Math.random() * 10000),
      studentId: user.id,
      studentName: `${user.firstName} ${user.lastName}`,
      majorId: selectedMajor.id,
      majorName: selectedMajor.name,
      universityName: selectedMajor.universityName,
      status: 'En attente',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      progress: 65,
      documents: ['Diplôme_Bac.pdf', 'Acte_Naissance.pdf']
    });
    setStep(4);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-background-dark flex flex-col font-display">
      <nav className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="size-10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 group">
             <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
           </button>
           <div>
             <h2 className="font-black dark:text-white tracking-tighter text-sm uppercase leading-none">Préinscription</h2>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Candidat: {user.firstName} {user.lastName}</p>
           </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center p-6 md:p-10">
        <div className="max-w-4xl w-full space-y-12">
          {/* Steps Indicator */}
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

          {/* Form Content */}
          <div className="bg-white dark:bg-surface-dark rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {step === 1 && (
              <div className="p-8 md:p-16 space-y-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-black dark:text-white tracking-tight">Choix de formation</h2>
                  <p className="text-gray-500 font-medium italic text-sm">Confirmez votre filière d'inscription.</p>
                </div>
                
                <div className="p-8 rounded-[40px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-8 items-center">
                   <div className="size-20 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center shadow-lg text-primary border border-primary/20">
                     <span className="material-symbols-outlined text-4xl font-bold">school</span>
                   </div>
                   <div className="text-center md:text-left space-y-1 flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Filière</p>
                      <h3 className="text-3xl font-black dark:text-white leading-tight">{selectedMajor.name}</h3>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{selectedMajor.universityName}</p>
                   </div>
                </div>

                <div className="flex flex-col items-center gap-6 pt-4">
                   <button onClick={() => setStep(2)} className="bg-primary hover:bg-green-400 px-20 py-5 rounded-2xl font-black text-black shadow-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 group">
                     Continuer
                     <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 font-black">arrow_forward</span>
                   </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-10 md:p-16 space-y-10 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-3xl font-black dark:text-white tracking-tighter">Informations Académiques</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Série du BAC</label>
                    <select className="w-full p-4 rounded-2xl border-2 border-gray-50 dark:bg-white/5 dark:border-gray-800 dark:text-white font-bold outline-none focus:border-primary">
                      <option>Série C</option>
                      <option>Série D</option>
                      <option>Série G2</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">INE / Numéro Table</label>
                    <input className="w-full p-4 rounded-2xl border-2 border-gray-50 dark:bg-white/5 dark:border-gray-800 dark:text-white font-bold outline-none focus:border-primary" type="text" defaultValue={user.ine || ''} />
                  </div>
                </div>
                <div className="flex justify-between pt-8">
                   <button onClick={() => setStep(1)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">Retour</button>
                   <button onClick={() => setStep(3)} className="bg-primary px-10 py-4 rounded-2xl font-black text-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Suivant</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-10 md:p-16 space-y-10 animate-in fade-in slide-in-from-right-4 text-center">
                <h2 className="text-3xl font-black dark:text-white tracking-tighter">Documents Numériques</h2>
                <p className="text-gray-500 font-medium">Glissez-déposez vos justificatifs (Relevé BAC, Identité).</p>
                <div className="py-20 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[32px] flex flex-col items-center gap-4 text-gray-300 hover:text-primary hover:border-primary transition-all cursor-pointer group">
                   <span className="material-symbols-outlined text-6xl group-hover:scale-110 transition-transform">cloud_upload</span>
                   <p className="font-bold uppercase text-[10px] tracking-widest">Télécharger les fichiers</p>
                </div>
                <div className="flex justify-between pt-8">
                   <button onClick={() => setStep(2)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">Retour</button>
                   <button onClick={handleFinalSubmit} className="bg-primary px-10 py-4 rounded-2xl font-black text-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Soumettre mon dossier</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-10 md:p-20 flex flex-col items-center text-center gap-8 animate-in zoom-in-95">
                <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                   <span className="material-symbols-outlined text-6xl font-black">verified</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black dark:text-white tracking-tighter">Félicitations !</h2>
                  <p className="text-gray-500 max-w-md mx-auto font-medium text-lg">Votre dossier est désormais en cours de traitement par l'administration.</p>
                </div>
                <Link to="/dashboard" className="px-16 py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">
                  Accéder au Suivi
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyProcess;
