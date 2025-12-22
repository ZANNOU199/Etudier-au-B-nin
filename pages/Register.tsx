
import React from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-background-dark">
      {/* Left side: Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Étudiants travaillant" 
        />
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full text-white">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-[#13ec6d] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl font-bold">school</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Etudier au Bénin</h1>
          </div>

          <div className="space-y-8">
            <h2 className="text-6xl font-black leading-tight tracking-tighter max-w-lg drop-shadow-xl">
              Votre avenir académique commence ici.
            </h2>
            <p className="text-xl text-gray-200 max-w-md font-medium leading-relaxed drop-shadow-lg">
              Rejoignez la plateforme de référence pour l'orientation universitaire. Comparez les établissements, choisissez votre parcours et préparez votre succès.
            </p>

            <div className="flex items-center gap-6 pt-6">
              <div className="flex -space-x-4">
                <img className="size-14 rounded-full border-4 border-white object-cover shadow-lg" src="https://i.pravatar.cc/150?u=a1" alt="Student" />
                <img className="size-14 rounded-full border-4 border-white object-cover shadow-lg" src="https://i.pravatar.cc/150?u=a2" alt="Student" />
                <img className="size-14 rounded-full border-4 border-white object-cover shadow-lg" src="https://i.pravatar.cc/150?u=a3" alt="Student" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[#13ec6d] font-black text-2xl tracking-tight">15k+ Étudiants</p>
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Inscrits cette année</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Portail Indépendant d'Orientation et d'Admission</p>
        </div>
      </div>

      {/* Right side: Registration Form */}
      <div className="flex-1 flex flex-col p-8 md:p-16 lg:p-24 bg-[#f9fafb] dark:bg-background-dark overflow-y-auto">
        <div className="flex justify-end mb-12">
          <div className="flex items-center gap-6">
             <span className="text-sm font-bold text-gray-500">Déjà inscrit ?</span>
             <Link to="/login" className="px-8 py-3 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-[#0f1a13] dark:text-white hover:bg-white hover:shadow-lg transition-all font-black uppercase text-xs tracking-widest">Connexion</Link>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-[#0f1a13] dark:text-white tracking-tighter leading-tight">Créer votre compte étudiant</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
              Remplissez le formulaire ci-dessous pour accéder à votre espace personnel.
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Prénom</label>
                <input className="w-full p-4 rounded-xl border-2 border-gray-100 dark:bg-surface-dark dark:border-gray-800 dark:text-white outline-none focus:ring-4 focus:ring-[#13ec6d]/10 focus:border-[#13ec6d] transition-all" type="text" placeholder="Ex: Koffi" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nom</label>
                <input className="w-full p-4 rounded-xl border-2 border-gray-100 dark:bg-surface-dark dark:border-gray-800 dark:text-white outline-none focus:ring-4 focus:ring-[#13ec6d]/10 focus:border-[#13ec6d] transition-all" type="text" placeholder="Ex: Mensah" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">mail</span>
                   <input className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 dark:bg-surface-dark dark:border-gray-800 dark:text-white outline-none focus:ring-4 focus:ring-[#13ec6d]/10 focus:border-[#13ec6d] transition-all" type="email" placeholder="etudiant@exemple.bj" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Téléphone</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">call</span>
                   <input className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 dark:bg-surface-dark dark:border-gray-800 dark:text-white outline-none focus:ring-4 focus:ring-[#13ec6d]/10 focus:border-[#13ec6d] transition-all" type="tel" placeholder="+229 XX XX XX XX" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Pays de résidence</label>
                <div className="relative">
                  <select className="w-full p-4 rounded-xl border-2 border-gray-100 dark:bg-surface-dark dark:border-gray-800 dark:text-white outline-none focus:ring-4 focus:ring-[#13ec6d]/10 focus:border-[#13ec6d] appearance-none font-bold">
                    <option>Bénin</option>
                    <option>Togo</option>
                    <option>France</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Ville</label>
                <input className="w-full p-4 rounded-xl border-2 border-gray-100 dark:bg-surface-dark dark:border-gray-800 dark:text-white outline-none focus:ring-4 focus:ring-[#13ec6d]/10 focus:border-[#13ec6d] transition-all" type="text" placeholder="Ex: Cotonou" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Mot de passe</label>
              <div className="relative group">
                 <input className="w-full p-4 rounded-xl border-2 border-gray-100 dark:bg-surface-dark dark:border-gray-800 dark:text-white outline-none focus:ring-4 focus:ring-[#13ec6d]/10 focus:border-[#13ec6d] transition-all" type="password" placeholder="8 caractères minimum" />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 cursor-pointer hover:text-[#13ec6d] transition-colors">visibility</span>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-2 flex-1 bg-[#13ec6d] rounded-full"></div>
                <div className="h-2 flex-1 bg-[#13ec6d] rounded-full"></div>
                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              </div>
            </div>

            <label className="flex items-start gap-4 cursor-pointer pt-2">
              <input type="checkbox" className="mt-1 size-6 rounded border-gray-300 text-[#13ec6d] focus:ring-[#13ec6d] transition-all" />
              <span className="text-sm font-medium text-gray-500 leading-relaxed">
                J'accepte les <Link to="#" className="text-[#13ec6d] font-black hover:underline">Conditions Générales d'Utilisation</Link> et la politique de confidentialité de la plateforme.
              </span>
            </label>

            <Link to="/dashboard" className="block w-full text-center py-5 bg-[#13ec6d] hover:bg-green-400 text-black font-black rounded-xl shadow-2xl shadow-[#13ec6d]/30 transition-all hover:scale-[1.01] active:scale-[0.98] uppercase tracking-widest text-sm">
              S'inscrire gratuitement
            </Link>
          </div>

          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
            <span className="flex-shrink mx-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ou continuer avec</span>
            <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button className="flex items-center justify-center gap-4 py-4 border-2 border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-surface-dark hover:shadow-lg transition-all font-black text-xs uppercase tracking-widest">
              <img className="size-6" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              Google
            </button>
            <button className="flex items-center justify-center gap-4 py-4 border-2 border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-surface-dark hover:shadow-lg transition-all font-black text-xs uppercase tracking-widest">
              <img className="size-6" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" alt="Facebook" />
              Facebook
            </button>
          </div>

          <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] pt-12">
            © 2024 Etudier au Bénin. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
