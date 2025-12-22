
import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-background-dark py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-primary font-black uppercase tracking-[0.2em] text-xs bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
            Notre Mission
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Simplifier votre avenir <br /> académique au Bénin
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium">
            Notre mission principale est de simplifier votre inscription universitaire en vous aidant à choisir la formation qui vous correspond, tout en vous accompagnant vers un parcours de réussite au Bénin.
          </p>
        </div>
      </section>

      {/* Main Mission Content */}
      <section className="py-20 px-4 bg-white dark:bg-surface-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-[#0f1a13] dark:text-white tracking-tight leading-tight">
                  L'inscription à l'université ne devrait pas être une tâche pénible.
                </h2>
                <div className="h-1.5 w-20 bg-primary rounded-full"></div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                <span className="font-bold text-primary">EtudierAuBenin.com</span> vous offre les informations les plus récentes sur les universités et écoles béninoises ainsi que leurs programmes d'études pour planifier efficacement votre avenir académique.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-background-light dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                  <span className="material-symbols-outlined text-primary mb-3 text-3xl font-bold">update</span>
                  <h4 className="font-black dark:text-white mb-2 uppercase text-xs tracking-widest">Données à jour</h4>
                  <p className="text-sm text-gray-500">Programmes et coûts actualisés pour chaque rentrée.</p>
                </div>
                <div className="p-6 rounded-2xl bg-background-light dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                  <span className="material-symbols-outlined text-primary mb-3 text-3xl font-bold">support_agent</span>
                  <h4 className="font-black dark:text-white mb-2 uppercase text-xs tracking-widest">Accompagnement</h4>
                  <p className="text-sm text-gray-500">Un suivi personnalisé pour chaque étape de votre dossier.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                className="rounded-[32px] shadow-2xl relative z-10 w-full object-cover h-[500px] border-4 border-white dark:border-gray-800" 
                alt="Étudiants en discussion"
              />
            </div>
          </div>
        </div>
      </section>

      {/* EDEN Communication Section */}
      <section className="py-20 px-4 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 md:p-16 shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-[120px]">public</span>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="size-24 md:size-32 rounded-3xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <span className="text-primary text-3xl md:text-4xl font-black tracking-tight leading-none uppercase">EDEN</span>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-black text-[#0f1a13] dark:text-white tracking-tight">
                  Un service de EDEN Communication et Services
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-medium italic">
                  "Étudier au Bénin est un service de EDEN Communication et Services dédié aux étudiants étrangers ou béninois résidant hors du pays qui souhaitent poursuivre leurs études supérieures dans ce beau pays d'Afrique de l'Ouest."
                </p>
                <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                  <Link to="/register" className="bg-primary hover:bg-green-400 text-[#0f1a13] font-black py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary/20">
                    Commencer mon dossier
                  </Link>
                  <Link to="/contact" className="bg-transparent border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 dark:text-white font-black py-3 px-8 rounded-xl transition-colors">
                    Nous contacter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision/Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f1a13] dark:text-white tracking-tight">Notre Vision du Supérieur</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-black mb-4 text-primary uppercase tracking-widest text-sm">Égalité des Chances</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                L'information doit être accessible à tous, que vous soyez à Cotonou, Parakou ou à l'étranger. Nous réduisons la fracture numérique et informationnelle pour tous les futurs bacheliers et étudiants.
              </p>
            </div>
            <div className="p-10 bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-black mb-4 text-primary uppercase tracking-widest text-sm">Excellence Académique</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                Nous orientons les étudiants vers les filières les plus porteuses et les établissements les mieux notés, garantissant ainsi une employabilité optimale après la diplomation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
