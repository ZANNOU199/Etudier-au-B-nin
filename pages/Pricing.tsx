
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const Pricing: React.FC = () => {
  const { user, refreshData } = useCMS();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // === CONFIGURATION FEDAPAY ===
  const FEDAPAY_PUBLIC_KEY = 'pk_sandbox_MzMxVkj0kYgxGPfQe1UgWi4O'; 

  const handlePayment = (amount: number, description: string) => {
    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }

    setIsProcessing(true);

    try {
      // @ts-ignore
      FedaPay.init({
        public_key: FEDAPAY_PUBLIC_KEY,
        environment: 'sandbox',
        transaction: {
          amount: amount,
          description: description,
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
          setIsProcessing(true); // Garder le loading pendant le traitement du retour
          console.log("FedaPay Full Response Object:", response);
          
          // Extraction du statut depuis plusieurs sources possibles (selon version SDK)
          const status = response?.status || 
                         response?.transaction?.status || 
                         (response?.reason ? 'failed' : undefined);
          
          if (status === 'approved') {
            alert("✅ Félicitations ! Votre paiement a été approuvé.");
            await refreshData();
            setIsProcessing(false);
            navigate('/dashboard');
          } else if (status === 'failed' || status === 'canceled' || status === 'declined') {
            setIsProcessing(false);
            alert("❌ Le paiement n'a pas pu aboutir. Raison : " + (response?.reason || status));
          } else {
            // Si on ne trouve toujours pas le statut, on vérifie si l'objet contient un ID de transaction valide
            if (response?.transaction?.id && !response?.reason) {
                alert("✅ Paiement semble réussi (Vérification en cours...)");
                await refreshData();
                setIsProcessing(false);
                navigate('/dashboard');
            } else {
                setIsProcessing(false);
                console.error("Structure de réponse inconnue:", response);
                alert("⚠️ Retour de paiement ambigu. Veuillez vérifier votre tableau de bord. (Statut: " + status + ")");
            }
          }
        },
        onClose: () => {
          setIsProcessing(false);
        }
      }).open();
    } catch (err) {
      setIsProcessing(false);
      console.error("FedaPay Widget Error:", err);
      alert("Erreur système lors du lancement de FedaPay.");
    }
  };

  return (
    <div className="flex flex-col w-full pb-20 text-left">
      <section className="bg-background-dark py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight">Une tarification <br/><span className="text-primary italic">transparente</span></h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">Choisissez le plan qui correspond à votre ambition académique au Bénin.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-20">
        <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 shadow-2xl border border-gray-100 dark:border-white/5 space-y-8 flex flex-col h-full group hover:border-primary/30 transition-all duration-500">
           <div className="flex justify-between items-start">
             <div className="space-y-3 text-left">
               <h2 className="text-2xl font-black dark:text-white tracking-tight">Résident au Bénin</h2>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit">
                  <span className="material-symbols-outlined text-amber-500 text-sm font-bold">info</span>
                  <p className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Universités privées uniquement
                  </p>
               </div>
             </div>
             <span className="px-4 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-gray-800">Local</span>
           </div>
           
           <div className="flex items-baseline gap-2 justify-start">
             <span className="text-6xl font-black dark:text-white">2.500</span>
             <span className="text-xl text-primary font-black">CFA</span>
           </div>

           <ul className="space-y-5 flex-grow text-left">
              {[
                "Accès complet au catalogue",
                "Candidature pour 1 filière",
                "Suivi de dossier en ligne 24/7",
                "Support par email"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                  <span className="text-sm font-bold dark:text-gray-300">{item}</span>
                </li>
              ))}
           </ul>

           <button 
             disabled={isProcessing}
             onClick={() => handlePayment(2500, "Activation Compte Local")}
             className="w-full py-5 text-center bg-gray-50 dark:bg-white/5 border-2 border-transparent hover:border-primary dark:text-white font-black rounded-2xl transition-all uppercase text-xs tracking-[0.2em] disabled:opacity-50"
           >
             {isProcessing ? "Initialisation..." : (user ? "Activer mon compte" : "S'inscrire")}
           </button>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 shadow-2xl border-2 border-primary space-y-8 flex flex-col h-full relative transform md:scale-105 transition-all duration-500 group">
           <div className="absolute top-0 right-0 p-6">
              <span className="px-4 py-1.5 bg-primary text-black rounded-full text-[10px] font-black uppercase animate-bounce tracking-widest shadow-lg shadow-primary/30">Premium</span>
           </div>
           
           <div className="space-y-3 text-left">
             <h2 className="text-2xl font-black dark:text-white tracking-tight">Résident à l'étranger</h2>
             <p className="text-gray-500 font-bold text-sm">Accompagnement international de A à Z</p>
           </div>

           <div className="flex items-baseline gap-2 justify-start">
             <span className="text-6xl font-black dark:text-white">100.000</span>
             <span className="text-xl text-primary font-black">CFA</span>
           </div>

           <ul className="space-y-4 flex-grow text-left">
              {[
                "Tous les avantages résidents",
                "Authentification de diplôme",
                "Assistance Visa Étudiant",
                "Conseil d'orientation (30 min)",
                "Support Prioritaire WhatsApp"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary font-bold">verified_user</span>
                  <span className="text-sm font-black dark:text-white">{item}</span>
                </li>
              ))}
           </ul>

           <button 
             disabled={isProcessing}
             onClick={() => handlePayment(100000, "Activation Compte International")}
             className="w-full py-5 text-center bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 uppercase text-xs tracking-[0.2em] disabled:opacity-50"
           >
             {isProcessing ? "Initialisation..." : (user ? "Passer au Premium" : "S'inscrire (Étranger)")}
           </button>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-24 text-center space-y-12">
         <div className="space-y-2">
            <h2 className="text-2xl font-black dark:text-white tracking-tight uppercase tracking-[0.1em]">Moyens de paiement acceptés</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
         </div>
         <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-opacity">
           <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/MTN_Logo.svg" className="h-12 w-12 object-contain" alt="MTN" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Moov_Africa_logo.png" className="h-10 object-contain" alt="Moov" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-8 object-contain" alt="Visa" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-10 object-contain" alt="Mastercard" />
         </div>
      </section>
    </div>
  );
};

export default Pricing;
