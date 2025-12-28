
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const Login: React.FC = () => {
  const { login, user } = useCMS();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = searchParams.get('redirect');

  // Empêcher l'accès si déjà connecté
  useEffect(() => {
    if (user) {
      if (user.role === 'super_admin') {
        navigate('/super-admin');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath || '/dashboard');
      }
    }
  }, [user, navigate, redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email.toLowerCase().trim(), password);
    
    setLoading(false);
    if (result.success && result.user) {
      const role = result.user.role;
      if (role === 'super_admin') {
        navigate('/super-admin');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath || '/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-background-dark font-display">
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523050335192-ce11558cd97d?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Campus étudiant" 
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-primary rounded-xl flex items-center justify-center shadow-lg text-left">
              <span className="material-symbols-outlined text-white text-3xl font-bold">school</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Etudier au Bénin</h1>
          </div>
          <div className="space-y-6 max-w-lg text-white text-left">
            <p className="text-4xl font-bold leading-tight drop-shadow-2xl">
              "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
            </p>
            <div className="flex flex-col gap-2">
               <div className="h-1 w-16 bg-primary"></div>
               <p className="text-primary font-black uppercase tracking-[0.2em] text-sm">Nelson Mandela</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-[#f9fafb] dark:bg-background-dark overflow-y-auto">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-4 text-left">
            <h2 className="text-5xl font-black text-[#0f1a13] dark:text-white tracking-tighter leading-tight">Connexion</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
              Accédez à votre console de gestion ou à votre espace candidat.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold animate-fade-in text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[10px]">Adresse Email</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:bg-surface-dark dark:border-gray-800 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold" 
                  type="email" 
                  placeholder="votre@email.bj" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[10px]">Mot de passe</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:bg-surface-dark dark:border-gray-800 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold" 
                  type="password" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
                disabled={loading}
                type="submit" 
                className="w-full flex items-center justify-center gap-3 py-5 bg-primary hover:bg-green-400 text-black font-black rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loading ? "Connexion..." : "Initialiser l'accès"}
              {!loading && <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>}
            </button>
          </form>

          <p className="text-center font-bold text-gray-500 text-lg">
            Nouveau candidat ? <Link to="/register" className="text-primary hover:underline font-black">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
