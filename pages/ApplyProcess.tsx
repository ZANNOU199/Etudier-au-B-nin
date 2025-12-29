
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const ApplyProcess: React.FC = () => {
  const { user, majors, addApplication, refreshData } = useCMS();
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');

  // === CONFIGURATION FEDAPAY ===
  const FEDAPAY_PUBLIC_KEY = 'pk_sandbox_MzMxVkj0kYgxGPfQe1UgWi4O';

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const majorId = searchParams.get('id');
  const selectedMajor = useMemo(() => {
    return majors.find(m => m.id === majorId) || majors[0];
  }, [majorId, majors]);

  const handlePayment = () => {
    if (!user) return;

    setIsProcessingPayment(true);

    // @ts-ignore
    FedaPay.init({
      public_key: FEDAPAY_PUBLIC_KEY,
      environment: 'sandbox',
      transaction: {
        amount: 5000,
        description: `Frais de dossier : ${selectedMajor.name}`,
        currency: { iso: 'XOF' }
      },
      customer: {
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        phone_number: {
          number: '64000001', // NUMÉRO DE TEST REQUIS POUR LE SUCCÈS (Doc FedaPay)
          country: 'bj'
        }
      },
      onComplete: async (response: any) => {
        setIsProcessingPayment(true); // Maintenir le statut pendant la redirection
        console.log("FedaPay Application Response:", response);

        // Lecture robuste du statut
        const status = response?.status || 
                       response?.transaction?.status || 
                       (response?.reason ? 'failed' : undefined);

        if (status === 'approved' || (response?.transaction?.id && !response?.reason)) {
          setIsPaid(true);
          setIsProcessingPayment(false);
          setStep(3); 
        } else {
          setIsProcessingPayment(false);
          alert("Le paiement n'a pas été approuvé. Raison : " + (response?.reason || status || "Inconnu"));
        }
      },
      onClose: () => {
        setIsProcessingPayment(false);
      }
    }).open();
  };

  const handleFinalSubmit = async () => {
    if (!file || !selectedMajor || !isPaid) return;
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('major_id', selectedMajor.id);
    formData.append('file', file);

    const result = await addApplication(formData);
    
    if (result.success) {
      await refreshData();
      setStep(4);
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  if (!user || !selectedMajor) return null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display text-left">
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
          <div className="flex justify-between mb-8 px-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
                <div className={`size-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${step >= s ? 'bg-primary text-black' : 'bg-gray-200 text-gray-400'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`h-1 flex-1 mx-2 rounded-full ${step > s ? 'bg-primary' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[40px] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
            {step === 1 && (
              <div className="p-10 space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                    <span className="material-symbols-outlined text-4xl font-bold">cloud_upload</span>
                  </div>
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter">Étape 1 : Justificatifs</h2>
                  <p className="text-gray-500 font-medium text-sm">Téléchargez votre dernier diplôme ou relevé de notes.</p>
                </div>

                <div className="relative group border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center hover:border-primary transition-all bg-gray-50/50 dark:bg-white/5">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <span className="material-symbols-outlined text-5xl text-gray-300 group-hover:text-primary mb-4 transition-colors">description</span>
                  <p className="font-black text-xs uppercase tracking-widest dark:text-white truncate max-w-full">
                    {file ? file.name : "Cliquez ou glissez-deposez"}
                  </p>
                </div>

                <button 
                  disabled={!file}
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="p-10 space-y-8 animate-fade-in text-center">
                <div className="size-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto">
                  <span className="material-symbols-outlined text-4xl font-bold">payments</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter">Étape 2 : Frais d'étude</h2>
                  <p className="text-gray-500 font-medium text-sm px-4">Le traitement de votre dossier requiert des frais de dossier fixes.</p>
                </div>
                <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 shadow-inner">
                   <p className="text-5xl font-black dark:text-white tracking-tighter">5.000 <span className="text-base text-primary uppercase font-black ml-1">CFA</span></p>
                </div>
                <button 
                  disabled={isProcessingPayment}
                  onClick={handlePayment}
                  className="w-full py-5 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isProcessingPayment ? <span className="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> : null}
                  {isProcessingPayment ? "Initialisation..." : "Payer maintenant"}
                </button>
                <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-gray-400 hover:text-primary transition-colors">Modifier le fichier</button>
              </div>
            )}

            {step === 3 && (
              <div className="p-10 space-y-8 animate-fade-in text-center">
                <div className="size-20 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 mx-auto">
                  <span className="material-symbols-outlined text-4xl font-bold">verified</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter">Paiement Réussi !</h2>
                  <p className="text-gray-500 font-medium text-sm">Cliquez sur le bouton ci-dessous pour transmettre officiellement votre dossier.</p>
                </div>
                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</div>}
                <button 
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="w-full py-5 bg-background-dark text-white font-black rounded-2xl shadow-2xl hover:scale-[1.02] transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <span className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
                  {isSubmitting ? "Soumission..." : "Envoyer ma candidature"}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="p-16 text-center space-y-8 animate-fade-in">
                <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto animate-bounce">
                  <span className="material-symbols-outlined text-5xl font-black">celebration</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black dark:text-white tracking-tighter">Félicitations !</h2>
                  <p className="text-gray-500 font-medium">Votre dossier est maintenant entre les mains de nos conseillers. Vous recevrez une alerte pour chaque étape de validation.</p>
                </div>
                <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-background-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all">Aller au Tableau de Bord</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyProcess;
