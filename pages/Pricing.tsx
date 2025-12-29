
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const Pricing: React.FC = () => {
  const { user } = useCMS();
  const navigate = useNavigate();

  const handlePayment = (amount: number, description: string) => {
    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }

    // @ts-ignore
    FedaPay.init({
      public_key: 'pk_sandbox_votre_cle_publique_ici', // Remplacez par votre clé réelle
      transaction: {
        amount: amount,
        description: description
      },
      customer: {
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
      },
      onComplete: (response: any) => {
        if (response.status === 'approved') {
          alert("Paiement réussi ! Votre compte sera activé dans quelques instants.");
          navigate('/dashboard');
        } else {
          alert("Le paiement a été annulé ou a échoué.");
        }
      }
    }).open();
  };

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-background-dark py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">Une tarification claire pour votre avenir</h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium">Investir dans votre éducation n'a jamais été aussi simple. Choisissez l'offre adaptée à votre situation.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Local Student Plan */}
        <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 shadow-2xl border border-gray-100 dark:border-white/5 space-y-8 flex flex-col h-full relative overflow-hidden group">
           <div className="flex justify-between items-start">
             <div className="space-y-3">
               <div>
                 <h2 className="text-2xl font-black dark:text-white tracking-tight">Étudiant résidant au Bénin</h2>
                 <p className="text-gray-500 font-bold text-sm">Pour les candidats sur le territoire national</p>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit">
                  <span className="material-symbols-outlined text-amber-500 text-sm font-bold">info</span>
                  <p className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    NB: Les écoles et universités d'État sont exemptées
                  </p>
               </div>
             </div>
             <span className="px-4 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-gray-800">Local</span>
           </div>
           
           <div className="flex items-baseline gap-2">
             <span className="text-5xl font-black dark:text-white">2.500</span>
             <span className="text-xl text-primary font-black">CFA</span>
           </div>

           <ul className="space-y-5 flex-grow">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Accès complet au catalogue</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Candidature pour 1 seule filière</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Suivi de dossier en ligne 24/7</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Alertes par email et SMS</span>
              </li>
           </ul>

           <button 
             onClick={() => handlePayment(2500, "Activation Compte Local - Etudier au Bénin")}
             className="w-full py-5 text-center bg-gray-50 dark:bg-white/5 border-2 border-transparent hover:border-primary dark:text-white font-black rounded-2xl transition-all uppercase text-xs tracking-[0.2em]"
           >
             {user ? "Activer maintenant" : "S'inscrire (Résident Bénin)"}
           </button>
        </div>

        {/* Foreign Student Plan */}
        <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 shadow-2xl border-2 border-primary space-y-8 flex flex-col h-full relative overflow-hidden transform md:scale-105">
           <div className="absolute top-0 right-0 p-6">
              <span className="px-4 py-1.5 bg-primary text-black rounded-full text-[10px] font-black uppercase animate-pulse tracking-widest shadow-lg shadow-primary/30">Recommandé</span>
           </div>
           
           <div className="flex justify-between items-start">
             <div>
               <h2 className="text-2xl font-black dark:text-white tracking-tight">Étudiant résidant à l'étranger</h2>
               <p className="text-gray-500 font-bold text-sm">Accompagnement international complet</p>
             </div>
           </div>

           <div className="flex items-baseline gap-2">
             <span className="text-5xl font-black dark:text-white">100.000</span>
             <span className="text-xl text-primary font-black">CFA</span>
           </div>

           <ul className="space-y-4 flex-grow">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-black dark:text-white leading-tight">Tous les avantages résidents</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Suivi de l'inscription</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Authentification du diplôme étranger</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Accès au catalogue étranger</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Assistance prioritaire WhatsApp</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Conseil d'orientation (30 min)</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="text-sm font-bold dark:text-gray-300 leading-tight">Aide aux démarches de visa étudiant</span>
              </li>
           </ul>

           <button 
             onClick={() => handlePayment(100000, "Activation Compte International - Etudier au Bénin")}
             className="w-full py-5 text-center bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 uppercase text-xs tracking-[0.2em]"
           >
             {user ? "Activer maintenant" : "S'inscrire (Résident Étranger)"}
           </button>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="max-w-4xl mx-auto px-4 mt-24 text-center space-y-12">
         <div className="space-y-2">
            <h2 className="text-2xl font-black dark:text-white tracking-tight uppercase tracking-[0.1em]">Moyens de paiement acceptés</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
         </div>
         <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           <div className="flex flex-col items-center gap-2 group">
             <div className="h-14 px-8 bg-[#ffcc00] rounded-xl flex items-center font-black text-black shadow-lg group-hover:scale-110 transition-transform">MTN Mobile Money</div>
           </div>
           <div className="flex flex-col items-center gap-2 group">
             <div className="h-14 px-8 bg-[#0065a3] rounded-xl flex items-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">Moov Money</div>
           </div>
           <div className="flex flex-col items-center gap-2 group">
             <div className="h-14 px-10 border-2 border-gray-200 dark:border-gray-800 rounded-xl flex items-center font-black text-blue-900 dark:text-white italic text-2xl shadow-lg group-hover:scale-110 transition-transform">VISA</div>
           </div>
         </div>
      </section>
    </div>
  );
};

export default Pricing;
