
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CMSProvider, useCMS } from './CMSContext';
import Home from './pages/Home';
import Universities from './pages/Universities';
import UniversityDetail from './pages/UniversityDetail';
import Majors from './pages/Majors';
import MajorDetail from './pages/MajorDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ApplyProcess from './pages/ApplyProcess';
import About from './pages/About';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Schools from './pages/Schools';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { translate, languages, currentLang, setLanguage, user, logout } = useCMS();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAppPage = location.pathname.startsWith('/admin') || 
                    location.pathname.startsWith('/super-admin') || 
                    location.pathname.startsWith('/apply');

  if (isAppPage) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: translate('nav_home'), path: '/' },
    { name: translate('nav_universities'), path: '/universities' },
    { name: translate('nav_schools'), path: '/schools' },
    { name: translate('nav_majors'), path: '/majors' },
    { name: translate('nav_pricing'), path: '/pricing' },
    { name: translate('nav_contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const activeLangs = languages.filter(l => l.isActive);

  // Version Utilisateur Connecté
  if (user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#0d1b13] shadow-sm">
        <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1500px] mx-auto w-full text-left">
          <div className="flex items-center gap-5">
            <Link 
              to={user.role === 'super_admin' ? '/super-admin' : user.role === 'admin' ? '/admin' : '/dashboard'} 
              className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined font-black text-2xl">grid_view</span>
            </Link>
            <div className="flex flex-col">
              <h2 className="text-lg font-black dark:text-white leading-none tracking-tight">Bonjour, {user.firstName}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Administrateur' : 'Espace Candidat'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
               <div className="flex flex-col items-end text-right">
                  <p className="text-[11px] font-black dark:text-white uppercase tracking-wider leading-none">{user.firstName} {user.lastName}</p>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1.5">ID #{user.id.split('-')[1] || '6329'}</p>
               </div>
               <span className="material-symbols-outlined text-gray-300 text-3xl">account_circle</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 h-11 px-4 sm:px-5 rounded-2xl bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-red-500/10 group"
            >
              <span className="hidden xs:inline">Déconnexion</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">logout</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Version Visiteur
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-white/5 bg-white dark:bg-[#0d1b13] shadow-md">
      <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1500px] mx-auto text-left">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="size-10 flex items-center justify-center text-primary bg-primary/10 rounded-2xl group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-[28px] font-bold">school</span>
          </div>
          <h2 className="text-text-main dark:text-white text-xl font-black tracking-tighter group-hover:text-primary transition-colors hidden sm:block">
            Etudier au Bénin
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center px-8">
          <nav className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-[13px] font-black uppercase tracking-wider transition-all px-4 py-2.5 rounded-xl ${isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">
            Connexion
          </Link>
          <Link to="/register" className="flex items-center justify-center rounded-2xl h-11 px-8 bg-primary text-black hover:bg-green-400 transition-all hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 text-xs font-black uppercase tracking-widest">
            S'inscrire
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden size-11 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-[#0d1b13] z-[110] lg:hidden animate-in slide-in-from-right duration-300 flex flex-col p-8 text-left shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <span className="font-black text-xl dark:text-white tracking-tighter">Menu</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="size-11 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all ${
                    isActive(link.path) 
                    ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-8 border-t border-gray-100 dark:border-white/10 space-y-4">
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full py-4 text-gray-500 dark:text-gray-400 font-black uppercase text-[11px] tracking-[0.2em]"
              >
                Espace Connexion
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full py-5 bg-primary text-black font-black rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary/20"
              >
                S'inscrire gratuitement
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

const Footer = () => {
  const location = useLocation();
  const { translate } = useCMS();
  
  const isAppPage = location.pathname.startsWith('/admin') || 
                    location.pathname.startsWith('/super-admin') || 
                    location.pathname.startsWith('/apply');

  if (isAppPage) return null;

  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-border-light dark:border-white/5 pt-20 pb-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-black"><span className="material-symbols-outlined text-sm font-bold">school</span></div>
              <span className="font-black text-xl tracking-tight dark:text-white">Etudier au Bénin</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              {translate('footer_desc')}
            </p>
          </div>
          <div className="space-y-8">
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400">Navigation</h3>
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-bold transition-colors">Accueil</Link>
              <Link to="/universities" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-bold transition-colors">Universités</Link>
              <Link to="/schools" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-bold transition-colors">Ecoles</Link>
              <Link to="/majors" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-bold transition-colors">Formations</Link>
            </div>
          </div>
          <div className="space-y-8">
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400">Aide</h3>
            <div className="flex flex-col gap-4">
              <Link to="/pricing" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-bold transition-colors">Tarifs</Link>
              <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-bold transition-colors">Nous Contacter</Link>
              <Link to="/faq" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-bold transition-colors">FAQ</Link>
            </div>
          </div>
          <div className="space-y-8">
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400">Restez informé</h3>
            <p className="text-xs text-gray-500 font-bold leading-relaxed">Soyez averti des dates de concours et des nouvelles offres de formation.</p>
            <div className="flex gap-2 p-1.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input className="w-full bg-transparent border-none text-sm font-bold placeholder:text-gray-400 focus:ring-0 px-3" placeholder="votre@email.com" type="email" />
              <button className="bg-primary text-black p-3 rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-xl font-bold">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">
          <p>© 2024 Etudier au Bénin • Par EDEN Communication</p>
          <div className="flex gap-10">
            <Link to="#" className="hover:text-primary transition-colors">Mentions Légales</Link>
            <Link to="#" className="hover:text-primary transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles: string[] }) => {
  const { user } = useCMS();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <CMSProvider>
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/university/:id" element={<UniversityDetail />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/majors" element={<Majors />} />
            <Route path="/major/:id" element={<MajorDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/super-admin/*" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/apply" element={<ApplyProcess />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </CMSProvider>
  );
};

export default App;
