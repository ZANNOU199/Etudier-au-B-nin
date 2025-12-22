
import React from 'react';
// Added missing Link import
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
  const faqs = [
    { q: "Comment fonctionne le système LMD ?", a: "Le système LMD organise les études en trois grades : Licence (3 ans), Master (5 ans) et Doctorat (8 ans). Il favorise la mobilité internationale." },
    { q: "La pré-inscription est-elle gratuite ?", a: "La recherche d'informations est gratuite. Toutefois, des frais de dossier techniques de 5.000 FCFA sont demandés pour le traitement de votre candidature numérique." },
    { q: "Puis-je postuler à plusieurs universités ?", a: "Absolument. Vous pouvez sélectionner plusieurs filières et suivre l'état de vos candidatures directement depuis votre tableau de bord." },
    { q: "Quels sont les formats de fichiers acceptés ?", a: "Nous acceptons uniquement les fichiers PDF, JPG et PNG. La taille maximale est de 5 Mo par fichier." }
  ];

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-black text-center mb-4 dark:text-white">Questions Fréquentes</h1>
      <p className="text-center text-text-secondary text-lg mb-16">Trouvez des réponses rapides aux interrogations courantes.</p>
      
      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <details key={idx} className="group bg-white dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-white/5 shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden open:ring-2 open:ring-primary/20 transition-all">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-lg dark:text-white">
              {f.q}
              <span className="material-symbols-outlined transition group-open:-rotate-180 text-primary">expand_more</span>
            </summary>
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 text-gray-600 dark:text-gray-300 leading-relaxed">
              {f.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-20 p-10 bg-primary/5 rounded-3xl border border-primary/20 flex flex-col items-center text-center gap-6">
         <div className="size-16 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
           <span className="material-symbols-outlined text-4xl">support_agent</span>
         </div>
         <h3 className="text-2xl font-bold dark:text-white">Toujours besoin d'aide ?</h3>
         <p className="text-text-secondary">Notre équipe est disponible sur WhatsApp et par email pour vous accompagner.</p>
         <Link to="/contact" className="px-10 py-4 bg-primary text-black font-bold rounded-xl shadow-lg shadow-primary/20">Contactez-nous</Link>
      </div>
    </div>
  );
};

export default FAQ;
