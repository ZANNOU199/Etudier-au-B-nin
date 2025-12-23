
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const ApplyProcess: React.FC = () => {
  const { user, majors, addApplication } = useCMS();
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Simulation de fichiers téléchargés
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const majorId = searchParams.get('id');
  const selectedMajor = useMemo(() => {
    const found = majors.find(m => m.id === majorId);
    return found || majors[0];
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
      documents: uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name) : ['Diplôme_Preuve.pdf', 'Acte_Naissance.pdf']
    });
    setStep(4);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  if (!user) return null;

  const isLicence = selectedMajor.level === 'Licence';

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-background-dark flex flex-col font-display">
      {/* Header Process */}
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
          {/* Stepper Indicator */}
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

          <div className="bg-white dark:bg-surface-dark rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-500">
            {/* STEP 1: CHOIX DE FORMATION */}
            {step === 1 && (
              <div className="p-8 md:p-16 space-y-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-black dark:text-white tracking-tight">Choix de formation</h2>
                  <p className="text-gray-500 font-medium italic text-sm">Confirmez votre filière d'inscription.</p>
                </div>
                
                <div className="space-y-10">
                  {/* Carte Info Filière Principale */}
                  <div className="p-8 md:p-12 rounded-[40px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-8 items-center shadow-sm">
                    <div className="size-24 rounded-3xl bg-white dark:bg-surface-dark flex items-center justify-center shadow-lg text-primary border border-primary/20">
                      <span className="material-symbols-outlined text-5xl font-bold">school</span>
                    </div>
                    <div className="text-center md:text-left space-y-2 flex-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Filière</p>
                        <h3 className="text-3xl md:text-4xl font-black dark:text-white leading-tight tracking-tighter">{selectedMajor.name}</h3>
                        <p className="text-lg font-bold text-gray-500 uppercase tracking-widest">{selectedMajor.universityName}</p>
                    </div>
                  </div>

                  {/* Détails : Débouchés & Diplômes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Section Débouchés */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 px-2 border-l-4 border-primary">
                        <span className="material-symbols-outlined text-primary font-bold">work</span>
                        <h4 className="text-[12px] font-black text-text-main dark:text-white uppercase tracking-[0.2em]">
                          Débouchés après la formation
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedMajor.careerProspects && selectedMajor.careerProspects.length > 0 ? (
                          selectedMajor.careerProspects.map((cp, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors shadow-sm">
                              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-xl font-bold">{cp.icon}</span>
                              </div>
                              <span className="text-sm font-black dark:text-white tracking-tight">{cp.title}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                            <p className="text-xs text-gray-400 italic">Consultez la brochure pour les débouchés.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section Diplômes */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 px-2 border-l-4 border-amber-400">
                        <span className="material-symbols-outlined text-amber-400 font-bold">verified</span>
                        <h4 className="text-[12px] font-black text-text-main dark:text-white uppercase tracking-[0.2em]">
                          Diplômes & Conditions requis
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedMajor.requiredDiplomas && selectedMajor.requiredDiplomas.length > 0 ? (
                          selectedMajor.requiredDiplomas.map((rd, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-amber-400/30 transition-colors shadow-sm">
                              <div className="size-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-500">
                                <span className="material-symbols-outlined text-xl font-bold">{rd.icon}</span>
                              </div>
                              <span className="text-sm font-black dark:text-white tracking-tight">{rd.name}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="size-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-500">
                              <span className="material-symbols-outlined text-xl font-bold">history_edu</span>
                            </div>
                            <span className="text-sm font-black dark:text-white tracking-tight">BAC toutes séries</span>
                          </div>
                        )}
                        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3">
                           <span className="material-symbols-outlined text-blue-500 text-sm font-bold">info</span>
                           <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold leading-tight uppercase tracking-wider">Note : L'équivalence du diplôme est obligatoire pour les étudiants étrangers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 pt-4">
                   <button onClick={() => setStep(2)} className="bg-primary hover:bg-green-400 px-24 py-6 rounded-3xl font-black text-black shadow-2xl transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 group hover:scale-105 active:scale-95">
                     Confirmer et Continuer
                     <span className="material-symbols-outlined transition-transform group-hover:translate-x-2 font-black">arrow_forward</span>
                   </button>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En cliquant, vous confirmez l'exactitude de votre choix</p>
                </div>
              </div>
            )}

            {/* STEP 2: INFORMATIONS ACADÉMIQUES */}
            {step === 2 && (
              <div className="p-10 md:p-16 space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter">Informations Académiques</h2>
                  <p className="text-gray-500 font-medium text-sm">Veuillez renseigner votre cursus précédent pour une {selectedMajor.level}.</p>
                </div>

                <div className="max-w-md mx-auto w-full space-y-8">
                  {isLicence ? (
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">Série du BAC obtenue</label>
                      <div className="relative group">
                         <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary font-bold">school</span>
                         <select className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-100 dark:bg-white/5 dark:border-gray-800 dark:text-white font-black uppercase text-xs tracking-widest outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                            <option>Série C (Mathématiques)</option>
                            <option>Série D (Sciences de la vie)</option>
                            <option>Série G2 (Comptabilité)</option>
                            <option>Série A1/A2 (Lettres)</option>
                            <option>Série E / F (Techniques)</option>
                         </select>
                         <span className="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">Diplôme de Licence d'origine</label>
                      <div className="relative group">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary font-bold">workspace_premium</span>
                        <input 
                          className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-100 dark:bg-white/5 dark:border-gray-800 dark:text-white font-bold outline-none focus:border-primary transition-all" 
                          type="text" 
                          placeholder="Ex: Licence en Management"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6 bg-amber-400/5 rounded-3xl border border-amber-400/20 flex gap-4">
                     <span className="material-symbols-outlined text-amber-500">warning</span>
                     <p className="text-xs text-amber-700 dark:text-amber-400 font-bold leading-relaxed">Vérifiez que vos informations correspondent exactement à vos relevés de notes pour éviter tout rejet.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-10 border-t border-gray-50 dark:border-gray-800">
                   <button onClick={() => setStep(1)} className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                     <span className="material-symbols-outlined text-sm">arrow_back</span>
                     Modifier choix
                   </button>
                   <button onClick={() => setStep(3)} className="bg-background-dark dark:bg-primary px-12 py-4 rounded-2xl font-black text-white dark:text-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105 active:scale-95">Valider l'étape</button>
                </div>
              </div>
            )}

            {/* STEP 3: DOCUMENTS */}
            {step === 3 && (
              <div className="p-10 md:p-16 space-y-10 animate-in fade-in slide-in-from-right-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter">Documents Numériques</h2>
                  <p className="text-gray-500 font-medium italic">Téléchargez vos justificatifs ({isLicence ? 'Relevé BAC' : 'Diplôme de Licence'}, Identité, etc.).</p>
                </div>
                
                <div className="relative group max-w-2xl mx-auto">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <div className="py-24 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[48px] flex flex-col items-center gap-6 text-gray-300 group-hover:text-primary group-hover:border-primary transition-all bg-gray-50/50 dark:bg-white/5 shadow-inner">
                    <div className="size-20 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-5xl font-bold text-primary">cloud_upload</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-black uppercase text-[12px] tracking-[0.2em] text-text-main dark:text-white">Déposer vos fichiers ici</p>
                      <p className="text-[10px] text-gray-400 font-medium">Formats : PDF, JPG, PNG (Max 5Mo par fichier)</p>
                    </div>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-4 text-left max-w-2xl mx-auto">
                    <p className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] px-4">Fichiers en attente ({uploadedFiles.length})</p>
                    <div className="grid grid-cols-1 gap-3">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 group animate-in slide-in-from-bottom-2">
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-xl">file_present</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black dark:text-white truncate max-w-[200px]">{file.name}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                          <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="size-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-10 border-t border-gray-50 dark:border-gray-800">
                   <button onClick={() => setStep(2)} className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                     <span className="material-symbols-outlined text-sm">arrow_back</span>
                     Retour
                   </button>
                   <button 
                    onClick={handleFinalSubmit} 
                    disabled={uploadedFiles.length === 0}
                    className="bg-primary px-14 py-5 rounded-2xl font-black text-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3"
                   >
                    Soumettre mon dossier
                    <span className="material-symbols-outlined font-black">send</span>
                   </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION */}
            {step === 4 && (
              <div className="p-10 md:p-24 flex flex-col items-center text-center gap-10 animate-in zoom-in-95 duration-700">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <div className="size-32 rounded-[40px] bg-primary/20 flex items-center justify-center text-primary relative z-10 border-2 border-primary/20">
                     <span className="material-symbols-outlined text-7xl font-black">verified</span>
                  </div>
                </div>
                <div className="space-y-4 max-w-xl">
                  <h2 className="text-5xl font-black dark:text-white tracking-tighter leading-none">Candidature <span className="text-primary italic">Transmise</span> !</h2>
                  <p className="text-gray-500 font-medium text-xl leading-relaxed">
                    Félicitations ! Votre dossier pour <span className="text-primary font-black">{selectedMajor.name}</span> est désormais sous examen par l'administration.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-6">
                   <Link to="/dashboard" className="px-12 py-5 bg-background-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all">
                    Tableau de Bord
                   </Link>
                   <Link to="/majors" className="px-12 py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Autre Formation
                   </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyProcess;
