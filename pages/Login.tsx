
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const Login: React.FC = () => {
  const { login } = useCMS();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectPath = searchParams.get('redirect');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation simple d'authentification
    if (email === 'superadmin@eden.bj') {
      login({
        id: 'SUP-001',
        firstName: 'Directeur',
        lastName: 'Général',
        email: 'superadmin@eden.bj',
        role: 'super_admin'
      });
      navigate('/super-admin');
    } else if (email === 'admin@eden.bj') {
      login({
        id: 'ADM-001',
        firstName: 'Admin',
        lastName: 'Principal',
        email: 'admin@eden.bj',
        role: 'super_admin'
      });
      navigate(redirectPath || '/admin');
    } else {
      login({
        id: 'USR-6329',
        firstName: 'staff',
        lastName: 'Candidat',
        email: email,
        role: 'student',
        ine: '2024' + Math.floor(Math.random() * 100000)
      });
      navigate(redirectPath || '/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-background-dark">
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
          <div className="space-y-6 max-w-lg text-white">
            <p className="text-4xl font-bold leading-tight drop-shadow-2xl">
              "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
            </p>
            <div className="flex flex-col gap-2">
               <div className="h-1 w-16 bg-[#13ec6d]"></div>
               <p className="text-[#13ec6d] font-black uppercase tracking-[0.2em] text-sm">Nelson Mandela</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-[#f9fafb] dark:bg-background-dark">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-[#0f1a13] dark:text-white tracking-tighter">Connexion</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed text-left">
              Accédez à votre console de gestion ou à votre espace candidat.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Adresse Email</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-[#13ec6d] transition-colors">mail</span>
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:bg-surface-dark dark:border-gray-800 dark:text-white focus:ring-2 focus:ring-[#13ec6d]/20 focus:border-[#13ec6d] transition-all outline-none" 
                  type="email" 
                  placeholder="votre@email.bj" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Mot de passe</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-[#13ec6d] transition-colors">lock</span>
                <input 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:bg-surface-dark dark:border-gray-800 dark:text-white focus:ring-2 focus:ring-[#13ec6d]/20 focus:border-[#13ec6d] transition-all outline-none" 
                  type="password" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 bg-[#13ec6d] hover:bg-green-400 text-black font-black rounded-xl shadow-xl shadow-[#13ec6d]/20 transition-all hover:scale-[1.02] active:scale-95 group">
              Initialiser l'accès
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </form>

          <p className="text-center font-bold text-gray-500 text-lg">
            Nouveau candidat ? <Link to="/register" className="text-[#13ec6d] hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
