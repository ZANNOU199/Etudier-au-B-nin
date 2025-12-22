
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import ApplyProcess from './pages/ApplyProcess';
import About from './pages/About';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Schools from './pages/Schools';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { translate, languages, currentLang, setLanguage } = useCMS();
  
  const isAppPage = location.pathname.startsWith('/dashboard') || 
                    location.pathname.startsWith('/admin') || 
                    location.pathname.startsWith('/apply');

  if (isAppPage) return null;

  const navLinks = [
    { name: translate('nav_home'), path: '/' },
    { name: translate('nav_universities'), path: '/universities' },
    { name: translate('nav_schools'), path: '/schools' },
    { name: translate('nav_majors'), path: '/majors' },
    { name: translate('nav_pricing'), path: '/pricing' },
    { name: translate('nav_contact'), path: '/contact' },
  ];

  const activeLangs = languages.filter(l => l.isActive);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-white/5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl">
      <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1500px] mx-auto">
        <Link to="/" className="flex items-center gap-4 shrink-0 group">
          <div className="size-10 flex items-center justify-center text-primary bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[28px] font-bold">school</span>
          </div>
          <h2 className="text-text-main dark:text-white text-xl font-black tracking-tight group-hover:text-primary transition-colors hidden sm:block">
            Etudier au Bénin
          </h2>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center px-8">
          <nav className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-[14px] font-bold transition-all px-4 py-2.5 rounded-xl ${location.pathname === link.path ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-6 shrink-0">
          {/* Lang Selector */}
          {activeLangs.length > 1 && (
            <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
              {activeLangs.map(lang => (
                <button 
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${currentLang === lang.code ? 'bg-primary text-black shadow-sm' : 'text-gray-400 hover:text-primary'}`}
                >
                  {lang.code}
                </button>
              ))}
            </div>
          )}
          
          <Link to="/login" className="text-sm font-black text-gray-500 hover:text-primary transition-colors">
            Connexion
          </Link>
          <Link to="/register" className="flex items-center justify-center rounded-2xl h-12 px-8 bg-primary text-black hover:bg-green-400 transition-all hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 text-sm font-black">
            S'inscrire
          </Link>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
          <span className="material-symbols-outlined text-3xl">{isMenuOpen ? 'close' : 'menu_open'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white dark:bg-background-dark p-8 flex flex-col gap-10 animate-fade-in">
          <div className="flex justify-between items-center">
             <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
               <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><span className="material-symbols-outlined font-bold">school</span></div>
               <span className="font-black text-xl">Etudier au Bénin</span>
             </Link>
             <button onClick={() => setIsMenuOpen(false)} className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
          </div>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.path} onClick={() => setIsMenuOpen(false)} to={link.path} className={`text-2xl font-black p-4 rounded-3xl transition-all ${location.pathname === link.path ? 'bg-primary text-black' : 'hover:bg-primary/5 dark:text-white'}`}>
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-4">
            <Link onClick={() => setIsMenuOpen(false)} to="/login" className="text-lg font-black text-center py-5 rounded-3xl border-2 border-gray-100 dark:border-white/10 dark:text-white">Connexion</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/register" className="bg-primary py-5 text-center rounded-3xl font-black text-black text-lg shadow-xl shadow-primary/20">S'inscrire</Link>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  const location = useLocation();
  const isAppPage = location.pathname.startsWith('/dashboard') || 
                    location.pathname.startsWith('/admin') || 
                    location.pathname.startsWith('/apply');

  if (isAppPage) return null;

  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-border-light dark:border-white/5 pt-20 pb-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-black"><span className="material-symbols-outlined text-sm font-bold">school</span></div>
              <span className="font-black text-xl tracking-tight dark:text-white">Etudier au Bénin</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              La plateforme de référence pour l'orientation, les préinscriptions et l'admission dans le supérieur au Bénin.
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
            <Route path="/admin/*" element={<AdminDashboard />} />
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
