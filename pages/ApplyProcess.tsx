
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const ApplyProcess: React.FC = () => {
  const { user, majors, addApplication } = useCMS();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [academicInfo, setAcademicInfo] = useState({
    bac_series: 'Série D',
    previous_major: '',
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const majorId = searchParams.get('id');
  const selectedMajor = useMemo(() => {
    return majors.find(m => m.id.toString() === majorId) || (majors.length > 0 ? majors[0] : null);
  }, [majorId, majors]);

  const handleFinalSubmit = async () => {
    if (!user || !selectedMajor || !uploadedFile) {
      setError("Veuillez joindre votre document principal (Relevé/BAC).");
      return;
    }
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('major_id', selectedMajor.id.toString());
    formData.append('file', uploadedFile); // Clé 'file' requise par l'API CIPAPH
    
    // Champs optionnels supplémentaires pour le backend
    formData.append('bac_series', academicInfo.bac_series);
    if (academicInfo.previous_major) formData.append('previous_major', academicInfo.previous_major);

    const result = await addApplication(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      setStep(4);
    } else {
      setError(result.message || "Impossible de transmettre votre dossier. Veuillez réessayer.");
    }
  };

  if (!user || !selectedMajor) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-background-dark">
      <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-background-dark flex flex-col font-display">
      <nav className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="size-10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 group">
             <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
           </button>
           <h2 className="font-black dark:text-white tracking-tighter text-sm uppercase">Préinscription</h2>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center p-6 md:p-10">
        <div className="max-w-4xl w-full space-y-12">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black uppercase text-center animate-fade-in">
              {error}
            </div>
          )}

          <div className="relative flex items-center justify-between max-w-xl mx-auto mb-10 pt-4">
            <div className="absolute top-10 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 rounded-full"></div>
            <div className="absolute top-10 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-700" style={{ width: `${(step - 1) * 33.3}%` }}></div>
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`size-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-gray-700 text-gray-300'}`}>
                {step > s ? <span className="material-symbols-outlined font-bold">check</span> : s}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[48px] shadow-2xl border border-gray-100 dark:border-gray-800 p-10 md:p-16">
            {step === 1 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 text-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black dark:text-white tracking-tight">Confirmer la filière</h2>
                  <div className="p-10 rounded-[40px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 space-y-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Candidature pour :</p>
                    <h3 className="text-3xl font-black dark:text-white leading-tight">{selectedMajor.name}</h3>
                    <p className="text-lg font-bold text-gray-500">{selectedMajor.universityName}</p>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="bg-primary hover:bg-green-400 px-20 py-5 rounded-2xl font-black text-black shadow-xl transition-all uppercase tracking-widest text-sm">Continuer</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-3xl font-black dark:text-white tracking-tighter text-center">Cursus</h2>
                <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 px-2">Série du BAC</label>
                    <select 
                      value={academicInfo.bac_series}
                      onChange={(e) => setAcademicInfo({...academicInfo, bac_series: e.target.value})}
                      className="w-full px-6 py-4 rounded-xl border-2 border-gray-100 dark:bg-white/5 dark:border-gray-800 dark:text-white font-bold outline-none focus:border-primary"
                    >
                      <option>Série C</option>
                      <option>Série D</option>
                      <option>Série G2</option>
                      <option>Série A1</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between">
                   <button onClick={() => setStep(1)} className="text-gray-400 font-black">Retour</button>
                   <button onClick={() => setStep(3)} className="bg-primary px-10 py-4 rounded-xl font-black text-black uppercase text-xs">Suivant</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 text-center">
                <h2 className="text-3xl font-black dark:text-white tracking-tighter">Documents</h2>
                <div className="relative group max-w-2xl mx-auto cursor-pointer">
                  <input 
                    type="file" 
                    onChange={(e) => e.target.files && setUploadedFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className="py-20 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[48px] bg-gray-50/50 dark:bg-white/5 flex flex-col items-center gap-6 group-hover:border-primary transition-all">
                    <span className="material-symbols-outlined text-6xl text-primary font-bold">cloud_upload</span>
                    <p className="font-black uppercase text-xs tracking-widest dark:text-white">
                      {uploadedFile ? uploadedFile.name : 'Choisir votre relevé (PDF/JPG)'}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between pt-10 border-t border-gray-50 dark:border-gray-800">
                   <button onClick={() => setStep(2)} className="text-gray-400 font-black">Retour</button>
                   <button 
                    onClick={handleFinalSubmit} 
                    disabled={!uploadedFile || isSubmitting}
                    className="bg-primary px-14 py-5 rounded-2xl font-black text-black uppercase tracking-widest text-xs shadow-2xl disabled:opacity-50"
                   >
                    {isSubmitting ? "Envoi en cours..." : "Soumettre le dossier"}
                   </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-10 flex flex-col items-center text-center gap-10 animate-in zoom-in-95">
                <span className="material-symbols-outlined text-8xl text-primary font-black">verified</span>
                <h2 className="text-5xl font-black dark:text-white tracking-tighter">Dossier <span className="text-primary italic">Transmis</span> !</h2>
                <p className="text-gray-500 font-medium text-lg">Votre demande est en cours de traitement par nos services.</p>
                <Link to="/dashboard" className="px-12 py-5 bg-background-dark text-white rounded-2xl font-black uppercase text-xs">Tableau de Bord</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyProcess;
