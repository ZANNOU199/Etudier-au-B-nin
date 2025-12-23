
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ThemeConfig, CMSContent, UserRole, User, Application, University, Major } from './types';
import { UNIVERSITIES as STATIC_UNIS, MAJORS as STATIC_MAJORS } from './constants';

interface CMSContextType {
  content: CMSContent;
  languages: Language[];
  themes: ThemeConfig[];
  currentLang: string;
  activeTheme: ThemeConfig;
  userRole: UserRole;
  user: User | null;
  applications: Application[];
  universities: University[];
  majors: Major[];
  translate: (key: string) => string;
  updateContent: (key: string, lang: string, value: string) => void;
  setLanguage: (code: string) => void;
  toggleLanguage: (code: string) => void;
  applyTheme: (themeId: string) => void;
  updateTheme: (themeId: string, updates: Partial<ThemeConfig>) => void;
  setUserRole: (role: UserRole) => void;
  login: (userData: User) => void;
  logout: () => void;
  addApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  deleteApplication: (id: string) => void;
  // Admin Methods
  addUniversity: (uni: University) => void;
  updateUniversity: (uni: University) => void;
  deleteUniversity: (id: string) => void;
  addMajor: (major: Major) => void;
  updateMajor: (major: Major) => void;
  deleteMajor: (id: string) => void;
}

const DEFAULT_CONTENT: CMSContent = {
  'hero_title_line1': { fr: "Ouvrez les portes", en: "Open the doors" },
  'hero_title_accent': { fr: "destinée", en: "destiny" },
  'hero_subtitle': { fr: "Trouvez la formation idéale parmi les établissements d'excellence au Bénin et gérez vos préinscriptions en quelques clics.", en: "Find the ideal training among the institutions of excellence in Benin and manage your pre-registrations in a few clicks." },
  'btn_explore': { fr: "Explorer", en: "Explore" },
  'nav_home': { fr: "Accueil", en: "Home" },
  'nav_universities': { fr: "Universités", en: "Universities" },
  'nav_schools': { fr: "Ecoles", en: "Schools" },
  'nav_majors': { fr: "Formations", en: "Programs" },
  'nav_pricing': { fr: "Tarifs", en: "Pricing" },
  'nav_contact': { fr: "Nous Contacter", en: "Contact Us" },
  'footer_desc': { fr: "La plateforme de référence pour l'orientation, les préinscriptions et l'admission dans le supérieur au Bénin.", en: "The reference platform for orientation, pre-registration and admission to higher education in Benin." },
  'cta_title': { fr: "Lancez votre futur", en: "Launch your future" },
  'cta_today': { fr: "aujourd'hui", en: "today" },
  'cta_desc': { fr: "Rejoignez plus de 15,000 étudiants qui ont déjà trouvé leur voie grâce à notre plateforme d'orientation intelligente.", en: "Join more than 15,000 students who have already found their way thanks to our intelligent orientation platform." }
};

const DEFAULT_THEMES: ThemeConfig[] = [
  { id: 'default', name: 'Nature (Actuel)', primary: '#13ec6d', background: '#0d1b13', surface: '#162a1f', radius: '2rem', isActive: true },
  { id: 'ocean', name: 'Ocean (Bleu)', primary: '#3b82f6', background: '#0f172a', surface: '#1e293b', radius: '1rem', isActive: false },
  { id: 'royal', name: 'Royal (Or)', primary: '#eab308', background: '#1c1917', surface: '#292524', radius: '0.5rem', isActive: false }
];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<CMSContent>(() => {
    const saved = localStorage.getItem('cms_content_v1');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user_v1');
    return saved ? JSON.parse(saved) : null;
  });

  const [universities, setUniversities] = useState<University[]>(() => {
    const saved = localStorage.getItem('db_universities_v1');
    return saved ? JSON.parse(saved) : STATIC_UNIS;
  });

  const [majors, setMajors] = useState<Major[]>(() => {
    const saved = localStorage.getItem('db_majors_v1');
    return saved ? JSON.parse(saved) : STATIC_MAJORS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('db_applications_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [languages, setLanguages] = useState<Language[]>([
    { code: 'fr', label: 'Français', isActive: true },
    { code: 'en', label: 'English', isActive: true }
  ]);

  const [currentLang, setCurrentLang] = useState('fr');
  
  const [themes, setThemes] = useState<ThemeConfig[]>(() => {
    const saved = localStorage.getItem('cms_themes_v1');
    return saved ? JSON.parse(saved) : DEFAULT_THEMES;
  });

  const [userRole, setUserRole] = useState<UserRole>(user?.role || 'student');

  const activeTheme = themes.find(t => t.isActive) || themes[0];

  useEffect(() => {
    localStorage.setItem('cms_content_v1', JSON.stringify(content));
    localStorage.setItem('db_universities_v1', JSON.stringify(universities));
    localStorage.setItem('db_majors_v1', JSON.stringify(majors));
    localStorage.setItem('db_applications_v1', JSON.stringify(applications));
    if (user) localStorage.setItem('auth_user_v1', JSON.stringify(user));
    else localStorage.removeItem('auth_user_v1');
  }, [content, universities, majors, applications, user]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', activeTheme.primary);
    root.style.setProperty('--bg-color', activeTheme.background);
    root.style.setProperty('--surface-color', activeTheme.surface);
    root.style.setProperty('--radius-main', activeTheme.radius);
  }, [themes, activeTheme]);

  const translate = (key: string) => content[key]?.[currentLang] || content[key]?.fr || key;

  const login = (userData: User) => {
    setUser(userData);
    setUserRole(userData.role);
  };

  const logout = () => {
    setUser(null);
    setUserRole('student');
  };

  const addApplication = (app: Application) => setApplications(prev => [app, ...prev]);
  const updateApplicationStatus = (id: string, status: Application['status']) => 
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const deleteApplication = (id: string) => setApplications(prev => prev.filter(a => a.id !== id));

  const addUniversity = (uni: University) => setUniversities(prev => [uni, ...prev]);
  const updateUniversity = (uni: University) => setUniversities(prev => prev.map(u => u.id === uni.id ? uni : u));
  
  // CASCADE DELETE IMPLEMENTATION
  const deleteUniversity = (id: string) => {
    // 1. Remove the university
    setUniversities(prev => prev.filter(u => u.id !== id));
    // 2. Cascade remove all related majors
    setMajors(prevMajors => prevMajors.filter(m => m.universityId !== id));
    // 3. Optional: Remove related applications if desired (usually kept for audit, but here we clean up)
    setApplications(prevApps => prevApps.filter(a => {
       const relatedMajor = majors.find(m => m.id === a.majorId);
       return relatedMajor ? relatedMajor.universityId !== id : true;
    }));
  };

  const addMajor = (major: Major) => setMajors(prev => [major, ...prev]);
  const updateMajor = (major: Major) => setMajors(prev => prev.map(m => m.id === major.id ? major : m));
  const deleteMajor = (id: string) => setMajors(prev => prev.filter(m => m.id !== id));

  const updateContent = (key: string, lang: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value }
    }));
  };

  const setLanguage = (code: string) => setCurrentLang(code);
  const toggleLanguage = (code: string) => {
    setLanguages(prev => prev.map(l => l.code === code ? { ...l, isActive: !l.isActive } : l));
  };

  const applyTheme = (themeId: string) => {
    setThemes(prev => prev.map(t => ({ ...t, isActive: t.id === themeId })));
  };

  const updateTheme = (themeId: string, updates: Partial<ThemeConfig>) => {
    setThemes(prev => prev.map(t => t.id === themeId ? { ...t, ...updates } : t));
  };

  return (
    <CMSContext.Provider value={{ 
      content, languages, themes, currentLang, activeTheme, userRole, user, applications, universities, majors,
      translate, updateContent, setLanguage, toggleLanguage,
      applyTheme, updateTheme, setUserRole, login, logout, addApplication, updateApplicationStatus, deleteApplication,
      addUniversity, updateUniversity, deleteUniversity, addMajor, updateMajor, deleteMajor
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within CMSProvider');
  return context;
};
