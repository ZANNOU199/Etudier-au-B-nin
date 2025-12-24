
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
  token: string | null;
  staffUsers: User[];
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
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  addApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  deleteApplication: (id: string) => void;
  addUniversity: (uni: University) => void;
  updateUniversity: (uni: University) => void;
  deleteUniversity: (id: string) => void;
  addMajor: (major: Major) => void;
  updateMajor: (major: Major) => void;
  deleteMajor: (id: string) => void;
  addStaffUser: (user: User) => void;
  deleteStaffUser: (id: string) => void;
}

const API_BASE_URL = "https://api.cipaph.com/api";

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

const DEFAULT_STAFF: User[] = [
  { id: 'SUP-001', firstName: 'Directeur', lastName: 'Général', email: 'superadmin@eden.bj', role: 'super_admin', permissions: ['manage_catalog', 'validate_apps', 'view_logs', 'edit_cms'] },
  { id: 'ADM-001', firstName: 'Admin', lastName: 'Principal', email: 'admin@eden.bj', role: 'admin', permissions: ['manage_catalog', 'validate_apps'] }
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

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token_v1');
  });

  const [staffUsers, setStaffUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('db_staff_v1');
    return saved ? JSON.parse(saved) : DEFAULT_STAFF;
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
    localStorage.setItem('db_staff_v1', JSON.stringify(staffUsers));
    if (user) {
      localStorage.setItem('auth_user_v1', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user_v1');
    }
    if (token) {
      localStorage.setItem('auth_token_v1', token);
    } else {
      localStorage.removeItem('auth_token_v1');
    }
  }, [content, universities, majors, applications, user, staffUsers, token]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', activeTheme.primary);
    root.style.setProperty('--bg-color', activeTheme.background);
    root.style.setProperty('--surface-color', activeTheme.surface);
    root.style.setProperty('--radius-main', activeTheme.radius);
  }, [activeTheme]);

  const translate = (key: string) => content[key]?.[currentLang] || content[key]?.fr || key;

  const register = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.status === "success") {
        setUser(result.user);
        setToken(result.token);
        setUserRole(result.user.role);
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || "Erreur lors de l'inscription" };
    } catch (error) {
      return { success: false, message: "Erreur réseau ou serveur" };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (result.status === "success") {
        setUser(result.user);
        setToken(result.token);
        setUserRole(result.user.role);
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || "Email ou mot de passe incorrect" };
    } catch (error) {
      return { success: false, message: "Erreur réseau ou serveur" };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      setToken(null);
      setUserRole('student');
    }
  };

  const addStaffUser = (u: User) => setStaffUsers(prev => [u, ...prev]);
  const deleteStaffUser = (id: string) => setStaffUsers(prev => prev.filter(u => u.id !== id));

  const addApplication = (app: Application) => setApplications(prev => [app, ...prev]);
  const updateApplicationStatus = (id: string, status: Application['status']) => 
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const deleteApplication = (id: string) => setApplications(prev => prev.filter(a => a.id !== id));

  const addUniversity = (uni: University) => setUniversities(prev => [uni, ...prev]);
  const updateUniversity = (uni: University) => setUniversities(prev => prev.map(u => u.id === uni.id ? uni : u));
  const deleteUniversity = (id: string) => {
    setUniversities(prev => prev.filter(u => u.id !== id));
    setMajors(prevMajors => prevMajors.filter(m => m.universityId !== id));
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
      content, languages, themes, currentLang, activeTheme, userRole, user, token, staffUsers, applications, universities, majors,
      translate, updateContent, setLanguage, toggleLanguage,
      applyTheme, updateTheme, setUserRole, login, register, logout, addApplication, updateApplicationStatus, deleteApplication,
      addUniversity, updateUniversity, deleteUniversity, addMajor, updateMajor, deleteMajor,
      addStaffUser, deleteStaffUser
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
