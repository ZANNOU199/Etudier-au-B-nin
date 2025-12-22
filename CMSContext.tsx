
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ThemeConfig, CMSContent, UserRole } from './types';

interface CMSContextType {
  content: CMSContent;
  languages: Language[];
  themes: ThemeConfig[];
  currentLang: string;
  activeTheme: ThemeConfig;
  userRole: UserRole;
  translate: (key: string) => string;
  updateContent: (key: string, lang: string, value: string) => void;
  setLanguage: (code: string) => void;
  toggleLanguage: (code: string) => void;
  applyTheme: (themeId: string) => void;
  updateTheme: (themeId: string, updates: Partial<ThemeConfig>) => void;
  setUserRole: (role: UserRole) => void;
}

const DEFAULT_CONTENT: CMSContent = {
  'hero_title': { fr: "Ouvrez les portes de votre destinée.", en: "Open the doors to your destiny." },
  'hero_subtitle': { fr: "Trouvez la formation idéale parmi les établissements d'excellence au Bénin.", en: "Find the ideal training among the institutions of excellence in Benin." },
  'btn_explore': { fr: "Explorer", en: "Explore" },
  'nav_home': { fr: "Accueil", en: "Home" },
  'nav_universities': { fr: "Universités", en: "Universities" },
  'nav_schools': { fr: "Ecoles", en: "Schools" },
  'nav_majors': { fr: "Formations", en: "Programs" },
  'nav_pricing': { fr: "Tarifs", en: "Pricing" },
  'nav_contact': { fr: "Contact", en: "Contact" },
  'dashboard_welcome': { fr: "Bienvenue sur votre espace", en: "Welcome to your space" }
};

const DEFAULT_THEMES: ThemeConfig[] = [
  { id: 'default', name: 'Nature (Vert)', primary: '#13ec6d', background: '#0d1b13', surface: '#162a1f', radius: '2rem', isActive: true },
  { id: 'ocean', name: 'Ocean (Bleu)', primary: '#3b82f6', background: '#0f172a', surface: '#1e293b', radius: '1rem', isActive: false },
  { id: 'royal', name: 'Royal (Or)', primary: '#eab308', background: '#1c1917', surface: '#292524', radius: '0.5rem', isActive: false }
];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<CMSContent>(() => {
    const saved = localStorage.getItem('cms_content');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  });

  const [languages, setLanguages] = useState<Language[]>([
    { code: 'fr', label: 'Français', isActive: true },
    { code: 'en', label: 'English', isActive: true }
  ]);

  const [currentLang, setCurrentLang] = useState('fr');
  
  const [themes, setThemes] = useState<ThemeConfig[]>(() => {
    const saved = localStorage.getItem('cms_themes');
    return saved ? JSON.parse(saved) : DEFAULT_THEMES;
  });

  const [userRole, setUserRole] = useState<UserRole>('super_admin'); // Simulé pour le démo

  const activeTheme = themes.find(t => t.isActive) || themes[0];

  useEffect(() => {
    localStorage.setItem('cms_content', JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem('cms_themes', JSON.stringify(themes));
    // Appliquer les variables CSS du thème
    const root = document.documentElement;
    root.style.setProperty('--primary-color', activeTheme.primary);
    root.style.setProperty('--bg-color', activeTheme.background);
    root.style.setProperty('--surface-color', activeTheme.surface);
    root.style.setProperty('--radius-main', activeTheme.radius);
  }, [themes, activeTheme]);

  const translate = (key: string) => content[key]?.[currentLang] || content[key]?.fr || key;

  const updateContent = (key: string, lang: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value }
    }));
  };

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
      content, languages, themes, currentLang, activeTheme, userRole,
      translate, updateContent, setLanguage: setCurrentLang, toggleLanguage,
      applyTheme, updateTheme, setUserRole
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
