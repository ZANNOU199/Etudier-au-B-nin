
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  
  // Masquer la navigation sur les pages "App" (Dashboard, Admin, Apply)
  const isAppPage = location.pathname.startsWith('/dashboard') || 
                    location.pathname.startsWith('/admin') || 
                    location.pathname.startsWith('/apply');

  if (isAppPage) return null;

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Universités', path: '/universities' },
    { name: 'Ecoles', path: '/schools' },
    { name: 'Formations', path: '/majors' },
    { name: 'Tarifs', path: '/pricing' },
    { name: 'Nous Contacter', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8f2ec] dark:border-gray-800 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md">
      <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-[1400px] mx-auto">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="size-8 flex items-center justify-center text-primary bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-[24px] font-bold">school</span>
          </div>
          <h2 className="text-[#0f1a13] dark:text-white text-lg font-black leading-tight tracking-tight hidden sm:block">
            Etudier au Bénin
          </h2>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center px-4">
          <nav className="flex items-center gap-2 xl:gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-[13px] font-bold transition-all px-3 py-2 rounded-lg ${isActive(link.path) ? 'text-primary' : 'text-[#0f1a13] dark:text-gray-300 hover:text-primary'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <Link to="/login" className="text-sm font-bold text-[#0f1a13] dark:text-gray-300 hover:text-primary transition-colors">
            Connexion
          </Link>
          <Link to="/register" className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-[#0f1a13] hover:bg-green-400 transition-all hover:scale-105 active:scale-95 text-sm font-bold shadow-sm">
            S'inscrire
          </Link>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-600 dark:text-gray-300">
          <span className="material-symbols-outlined text-3xl">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[61px] bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 p-8 flex flex-col gap-5 animate-fade-in shadow-2xl h-[calc(100vh-61px)] overflow-y-auto">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.path} onClick={() => setIsMenuOpen(false)} to={link.path} className={`text-xl font-black ${isActive(link.path) ? 'text-primary' : 'dark:text-white'}`}>
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Link onClick={() => setIsMenuOpen(false)} to="/login" className="text-lg font-bold text-center py-4 rounded-xl border-2 border-gray-50 dark:border-gray-800 dark:text-white">Connexion</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/register" className="bg-primary py-4 text-center rounded-xl font-bold text-[#0f1a13]">S'inscrire</Link>
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
    <footer className="bg-surface-light dark:bg-surface-dark border-t border-[#e8f2ec] dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#0f1a13] dark:text-white">
              <div className="size-6 bg-primary rounded flex items-center justify-center"><span className="material-symbols-outlined text-sm">school</span></div>
              <span className="font-bold text-lg">Etudier au Bénin</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">La plateforme officielle d'orientation et d'inscription pour l'enseignement supérieur au Bénin.</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-[#0f1a13] dark:text-white uppercase text-xs tracking-widest">Navigation</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">Accueil</Link>
              <Link to="/universities" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">Universités</Link>
              <Link to="/schools" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">Ecoles</Link>
              <Link to="/majors" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">Formations</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-[#0f1a13] dark:text-white uppercase text-xs tracking-widest">Aide</h3>
            <div className="flex flex-col gap-2">
              <Link to="/pricing" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">Tarifs</Link>
              <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">Nous Contacter</Link>
              <Link to="/faq" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">FAQ</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-[#0f1a13] dark:text-white uppercase text-xs tracking-widest">Restez informé</h3>
            <p className="text-xs text-gray-500">Recevez les dates des concours et les nouvelles offres.</p>
            <div className="flex gap-2">
              <input className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="Email" type="email" />
              <button className="bg-primary text-[#0f1a13] p-2 rounded-lg hover:bg-green-400"><span className="material-symbols-outlined text-xl">send</span></button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <p>© 2024 Etudier au Bénin. Par EDEN Communication.</p>
          <div className="flex gap-8"><Link to="#" className="hover:text-primary">Légal</Link><Link to="#" className="hover:text-primary">Confidentialité</Link></div>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
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
  );
};

export default App;
