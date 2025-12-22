
import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-background-dark">
      {/* Left side: Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523050335192-ce11558cd97d?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Campus étudiant" 
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-[#13ec6d] rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl font-bold">school</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Etudier au Bénin</h1>
          </div>

          <div className="space-y-6 max-w-lg">
            <p className="text-4xl font-bold text-white leading-tight drop-shadow-2xl">
              "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
            </p>
            <div className="flex flex-col gap-2">
               <div className="h-1 w-16 bg-[#13ec6d]"></div>
               <p className="text-[#13ec6d] font-black uppercase tracking-[0.2em] text-sm">Nelson Mandela</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-[#f9fafb] dark:bg-background-dark">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-[#0f1a13] dark:text-white tracking-tighter">Connexion</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
              Bienvenue sur votre espace étudiant. Entrez vos identifiants pour accéder à votre compte.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Adresse Email</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-[#13ec6d] transition-colors">mail</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:bg-surface-dark dark:border-gray-800 dark:text-white focus:ring-2 focus:ring-[#13ec6d]/20 focus:border-[#13ec6d] transition-all outline-none" 
                  type="email" 
                  placeholder="etudiant@exemple.bj" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Mot de passe</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-[#13ec6d] transition-colors">lock</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:bg-surface-dark dark:border-gray-800 dark:text-white focus:ring-2 focus:ring-[#13ec6d]/20 focus:border-[#13ec6d] transition-all outline-none" 
                  type="password" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded border-gray-300 text-[#13ec6d] focus:ring-[#13ec6d]" />
                Se souvenir de moi
              </label>
              <Link to="#" className="font-bold text-[#13ec6d] hover:underline">Mot de passe oublié ?</Link>
            </div>

            {/* FIXED: Changed to Link for navigation */}
            <Link to="/dashboard" className="w-full flex items-center justify-center gap-3 py-4 bg-[#13ec6d] hover:bg-green-400 text-black font-black rounded-xl shadow-xl shadow-[#13ec6d]/20 transition-all hover:scale-[1.02] active:scale-95 group">
              Se connecter
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            <span className="flex-shrink mx-4 text-xs font-black text-gray-400 uppercase tracking-widest">OU</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          </div>

          <p className="text-center font-bold text-gray-500 text-lg">
            Nouveau bachelier ? <Link to="/register" className="text-[#13ec6d] hover:underline">Créer un compte</Link>
          </p>

          <div className="flex justify-center gap-8 pt-10 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link to="#" className="hover:text-[#13ec6d] transition-colors">Aide & Support</Link>
            <Link to="#" className="hover:text-[#13ec6d] transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
