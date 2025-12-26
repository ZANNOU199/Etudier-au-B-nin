
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const ApplyProcess: React.FC = () => {
  const { user, majors, addApplication } = useCMS();
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const majorId = searchParams.get('id');
  const selectedMajor = useMemo(() => {
    return majors.find(m => m.id === majorId) || majors[0];
  }, [majorId, majors]);

  const handleFinalSubmit = async () => {
    if (!file || !selectedMajor) return;
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('major_id', selectedMajor.id);
    formData.append('file', file);

    const result = await addApplication(formData);
    setIsSubmitting(false);

    if (result.success) {
      setStep(4);
    } else {
      setError(result.message);
    }
  };

  if (!user || !selectedMajor) return null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display">
      <nav className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="size-10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center text-gray-400">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="font-black dark:text-white text-sm uppercase">Candidature Numérique</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedMajor.name}</p>
        </div>
        <div className="size-10" />
      </nav>

      <div className="flex-grow flex flex-col items-center p-6 md:p-10">
        <div className="max-w-xl w-full">
          <div className="bg-white dark:bg-surface-dark rounded-[40px] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
            {step === 1 && (
              <div className="p-10 space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                    <span className="material-symbols-outlined text-4xl font-bold">description</span>
                  </div>
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter">Étape 1 : Justificatifs</h2>
                  <p className="text-gray-500 font-medium text-sm">Veuillez télécharger votre relevé de notes ou diplôme (PDF, JPG).</p>
                </div>

                <div className="relative group border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center hover:border-primary transition-all bg-gray-50/50 dark:bg-white/5">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <span className="material-symbols-outlined text-5xl text-gray-300 group-hover:text-primary mb-4">cloud_upload</span>
                  <p className="font-black text-xs uppercase tracking-widest dark:text-white">
                    {file ? file.name : "Cliquez ou déposez votre fichier"}
                  </p>
                </div>

                {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

                <button 
                  disabled={!file || isSubmitting}
                  onClick={handleFinalSubmit}
                  className="w-full py-5 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Transmission..." : "Soumettre mon dossier"}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="p-16 text-center space-y-8 animate-fade-in">
                <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto animate-bounce">
                  <span className="material-symbols-outlined text-5xl font-black">verified</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black dark:text-white tracking-tighter">Dossier Transmis !</h2>
                  <p className="text-gray-500 font-medium">Votre demande est en cours d'examen par les services académiques.</p>
                </div>
                <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-background-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs">Tableau de Bord</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyProcess;
