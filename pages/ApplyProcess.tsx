
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const ApplyProcess: React.FC = () => {
  const { user, majors, addApplication, refreshData, recordPayment } = useCMS();
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [fedapayId, setFedapayId] = useState<string | null>(null);
  const [error, setError] = useState('');

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
    setError('');

    // @ts-ignore
    FedaPay.init({
      public_key: FEDAPAY_PUBLIC_KEY,
      environment: 'sandbox',
      transaction: {
        amount: 5000,
        description: `Frais d'étude : ${selectedMajor.name}`,
        currency: { iso: 'XOF' }
      },
      customer: {
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        phone_number: { number: '64000001', country: 'bj' }
      },
      onComplete: async (response: any) => {
        const fId = response?.transaction?.id?.toString();
        const status = response?.status || response?.transaction?.status;

        if (status === 'approved' || (fId && !response?.reason)) {
          try {
            await recordPayment({
              fedapay_id: fId,
              amount: 5000,
              status: 'approved',
              description: `Paiement Candidature : ${selectedMajor.name}`
            });
            
            setFedapayId(fId);
            setIsPaid(true);
            setIsProcessingPayment(false);
            setStep(3); 
          } catch (dbError: any) {
            console.error("Backend Error:", dbError);
            // On laisse avancer l'utilisateur si le paiement FedaPay est OK
            setFedapayId(fId);
            setIsPaid(true);
            setStep(3);
            setError("Note: Paiement réussi mais enregistrement différé. ID: " + fId);
          }
        } else {
          setIsProcessingPayment(false);
          setError("Le paiement n'a pas été validé.");
        }
      },
      onClose: () => setIsProcessingPayment(false)
    }).open();
  };

  const handleFinalSubmit = async () => {
    if (!file || !selectedMajor || !isPaid || !fedapayId) return;
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData();
    formData.append('major_id', selectedMajor.id);
    formData.append('file', file);
    formData.append('fedapay_id', fedapayId); 
    formData.append('amount', '5000');

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
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display">
      <nav className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="size-10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="font-black dark:text-white text-sm uppercase tracking-tighter">Candidature Digitale</h2>
          <p className="text-[9px] text-primary font-bold uppercase tracking-[0.2em]">{selectedMajor.name}</p>
        </div>
        <div className="size-10" />
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="max-w-2xl w-full">
          {/* Enhanced Progress Bar */}
          <div className="flex justify-between mb-12 px-8 relative">
            <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200 dark:bg-white/5 z-0" />
            {[1, 2, 3].map(s => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`size-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 border-4 ${
                  step > s ? 'bg-primary border-primary text-black' : 
                  step === s ? 'bg-white dark:bg-surface-dark border-primary text-primary shadow-lg shadow-primary/20' : 
                  'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-400'
                }`}>
                  {step > s ? <span className="material-symbols-outlined text-sm font-black">check</span> : s}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${step === s ? 'text-primary' : 'text-gray-400'}`}>
                  {s === 1 ? 'Documents' : s === 2 ? 'Paiement' : 'Soumission'}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[48px] shadow-premium border border-gray-100 dark:border-white/5 overflow-hidden animate-fade-in">
            {step === 1 && (
              <div className="p-12 space-y-10">
                <div className="text-center space-y-4">
                  <div className="size-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/20">
                    <span className="material-symbols-outlined text-5xl font-bold">upload_file</span>
                  </div>
                  <h2 className="text-4xl font-black dark:text-white tracking-tighter">Diplôme & Identité</h2>
                  <p className="text-gray-500 font-medium text-lg">Fournissez vos justificatifs pour analyse.</p>
                </div>
                
                <div className="relative group border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[32px] p-16 text-center hover:border-primary transition-all bg-gray-50/50 dark:bg-white/5 cursor-pointer">
                  <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <span className="material-symbols-outlined text-6xl text-gray-300 group-hover:text-primary mb-6 transition-all group-hover:scale-110">cloud_upload</span>
                  <p className="font-black text-xs uppercase tracking-widest dark:text-white">{file ? file.name : "Cliquez ou glissez votre dossier"}</p>
                </div>

                <button disabled={!file} onClick={() => setStep(2)} className="w-full py-6 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50">
                  Étape Suivante
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="p-12 space-y-10 text-center">
                <div className="size-24 rounded-[32px] bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto border border-amber-500/20">
                  <span className="material-symbols-outlined text-5xl font-bold">account_balance_wallet</span>
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-black dark:text-white tracking-tighter">Frais de Dossier</h2>
                  <p className="text-gray-500 font-medium text-lg italic">Étude technique du dossier numérique.</p>
                </div>
                <div className="p-10 bg-gray-50 dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/10 shadow-inner group">
                   <p className="text-6xl font-black dark:text-white tracking-tighter group-hover:scale-105 transition-transform">5.000 <span className="text-base text-primary uppercase font-black ml-1">CFA</span></p>
                </div>
                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</div>}
                <button disabled={isProcessingPayment} onClick={handlePayment} className="w-full py-6 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4">
                  {isProcessingPayment ? <span className="size-5 border-4 border-black/20 border-t-black rounded-full animate-spin"></span> : "Payer par Mobile Money"}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="p-12 space-y-10 text-center animate-fade-in">
                <div className="size-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto border border-green-500/20 shadow-lg shadow-green-500/10">
                  <span className="material-symbols-outlined text-5xl font-black">verified</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black dark:text-white tracking-tighter">Transaction Réussie</h2>
                  <p className="text-gray-500 font-medium">Votre paiement a été validé par le système.</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">
                  ID Transaction : {fedapayId}
                </div>
                <button disabled={isSubmitting} onClick={handleFinalSubmit} className="w-full py-6 bg-background-dark text-white font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4">
                  {isSubmitting ? <span className="size-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></span> : "Soumettre définitivement"}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="p-20 text-center space-y-10 animate-fade-in">
                <div className="size-32 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto animate-bounce border-4 border-primary">
                  <span className="material-symbols-outlined text-6xl font-black">celebration</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black dark:text-white tracking-tighter">Félicitations !</h2>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-sm mx-auto">Votre dossier est maintenant en cours de traitement par l'université.</p>
                </div>
                <button onClick={() => navigate('/dashboard')} className="w-full py-5 bg-background-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-xl">Mon Tableau de Bord</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyProcess;
