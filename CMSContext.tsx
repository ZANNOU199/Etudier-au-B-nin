
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ThemeConfig, CMSContent, UserRole, User, Application, University, Major } from './types';
import { UNIVERSITIES, MAJORS } from './constants';

interface CMSContextType {
  content: CMSContent;
  languages: Language[];
  themes: ThemeConfig[];
  currentLang: string;
  activeTheme: ThemeConfig;
  userRole: UserRole;
  user: User | null;
  token: string | null;
  applications: Application[];
  universities: University[];
  majors: Major[];
  isLoading: boolean;
  apiError: string | null;
  translate: (key: string) => string;
  updateContent: (key: string, lang: string, value: string) => void;
  setLanguage: (code: string) => void;
  applyTheme: (themeId: string) => void;
  updateTheme: (themeId: string, updates: Partial<ThemeConfig>) => void;
  setUserRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (data: any) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => Promise<void>;
  addApplication: (formData: FormData) => Promise<{ success: boolean; message: string }>;
  refreshData: () => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  addUniversity: (uni: any) => Promise<void>;
  updateUniversity: (id: string, uni: any) => Promise<void>;
  deleteUniversity: (id: string) => Promise<void>;
  addMajor: (major: any) => Promise<void>;
  updateMajor: (id: string, major: any) => Promise<void>;
  deleteMajor: (id: string) => Promise<void>;
}

const API_BASE_URL = "https://api.cipaph.com/api";

const DEFAULT_CONTENT: CMSContent = {
  'hero_title_line1': { fr: "Ouvrez les portes", en: "Open the doors" },
  'hero_title_accent': { fr: "destinée", en: "destiny" },
  'nav_home': { fr: "Accueil", en: "Home" },
  'nav_universities': { fr: "Universités", en: "Universities" },
  'nav_schools': { fr: "Ecoles", en: "Schools" },
  'nav_majors': { fr: "Formations", en: "Programs" },
  'nav_pricing': { fr: "Tarifs", en: "Pricing" },
  'nav_contact': { fr: "Nous Contacter", en: "Contact Us" },
  'footer_desc': { fr: "La plateforme de référence pour l'orientation, les préinscriptions et l'admission dans le supérieur au Bénin.", en: "The reference platform for orientation, pre-registration and admission to higher education in Benin." },
};

const DEFAULT_THEMES: ThemeConfig[] = [
  { id: 'default', name: 'Nature', primary: '#13ec6d', background: '#0d1b13', surface: '#162a1f', radius: '2rem', isActive: true },
];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content] = useState<CMSContent>(DEFAULT_CONTENT);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user_v1');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token_v1'));
  const [universities, setUniversities] = useState<University[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState('fr');
  const [themes, setThemes] = useState<ThemeConfig[]>(DEFAULT_THEMES);
  const [userRole, setUserRole] = useState<UserRole>(user?.role || 'student');

  const activeTheme = themes.find(t => t.isActive) || themes[0];

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    // Nettoyage de l'endpoint pour éviter les doubles slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;

    const headers: any = {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(!(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { 
        ...options, 
        headers,
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (response.status === 401) {
        handleLogoutLocal();
        throw new Error("Session expirée");
      }
      
      return response;
    } catch (error) {
      console.error(`Fetch error on ${url}:`, error);
      throw error;
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      // 1. Universités (Endpoint public)
      try {
        const uniRes = await apiRequest('/universities');
        if (uniRes.ok) {
          const uniData = await uniRes.json();
          const rawUnis = Array.isArray(uniData) ? uniData : (uniData.data || []);
          const mappedUnis: University[] = rawUnis.map((u: any) => ({
            ...u,
            id: u.id.toString(),
            location: u.city || u.location || 'Bénin',
            stats: u.stats || { students: 'N/A', majors: 0, founded: 'N/A', ranking: 'N/A' },
            faculties: u.faculties || []
          }));
          setUniversities(mappedUnis);
        } else {
          throw new Error("Erreur serveur Universités");
        }
      } catch (err) {
        console.warn("API Universités inaccessible, chargement des données locales.");
        setUniversities(UNIVERSITIES);
      }

      // 2. Données privées (si token présent)
      if (token) {
        try {
          const appRes = await apiRequest('/applications');
          if (appRes.ok) {
            const appData = await appRes.json();
            const rawApps = Array.isArray(appData) ? appData : (appData.data || []);
            setApplications(rawApps.map((a: any) => ({
              ...a,
              id: a.id.toString(),
              status: a.status || 'En attente'
            })));
          }

          if (user?.role !== 'student') {
            const majorRes = await apiRequest('/admin/majors');
            if (majorRes.ok) {
              const majorData = await majorRes.json();
              setMajors(Array.isArray(majorData) ? majorData : (majorData.data || []));
            }
          }
        } catch (err) {
          console.error("Erreur chargement données privées:", err);
          setApiError("Certaines données n'ont pas pu être synchronisées.");
        }
      } else {
        // Chargement des filières locales par défaut pour les visiteurs
        setMajors(MAJORS);
      }

    } catch (err) {
      setApiError("Erreur de connexion au serveur. Mode hors-ligne activé.");
      console.error("Erreur de synchronisation globale:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [token]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', activeTheme.primary);
    root.style.setProperty('--bg-color', activeTheme.background);
    root.style.setProperty('--surface-color', activeTheme.surface);
    root.style.setProperty('--radius-main', activeTheme.radius);
  }, [activeTheme]);

  const translate = (key: string) => content[key]?.[currentLang] || content[key]?.fr || key;

  const login = async (email: string, password: string) => {
    try {
      const res = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        const userData = { ...data.user, id: data.user.id.toString(), role: data.user.role || 'student' };
        setUser(userData);
        setToken(data.token);
        localStorage.setItem('auth_token_v1', data.token);
        localStorage.setItem('auth_user_v1', JSON.stringify(userData));
        return { success: true, message: "Connecté avec succès", user: userData };
      }
      return { success: false, message: data.message || "Identifiants invalides" };
    } catch (e) {
      return { success: false, message: "Le serveur est injoignable (Erreur Réseau/CORS)." };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.status === 201 || res.status === 200) {
        const userData = { ...data.user, id: data.user.id.toString(), role: data.user.role || 'student' };
        setUser(userData);
        setToken(data.token);
        localStorage.setItem('auth_token_v1', data.token);
        localStorage.setItem('auth_user_v1', JSON.stringify(userData));
        return { success: true, message: "Bienvenue !", user: userData };
      }
      return { success: false, message: data.message || "Erreur d'inscription" };
    } catch (e) {
      return { success: false, message: "Le serveur est injoignable." };
    }
  };

  const handleLogoutLocal = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token_v1');
    localStorage.removeItem('auth_user_v1');
  };

  const logout = async () => {
    try { await apiRequest('/logout', { method: 'POST' }); } catch(e) {}
    handleLogoutLocal();
  };

  const addApplication = async (formData: FormData) => {
    try {
      const res = await apiRequest('/applications', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.status === 201 || res.status === 200) {
        refreshData();
        return { success: true, message: "Dossier transmis" };
      }
      return { success: false, message: data.message || "Erreur" };
    } catch (e) {
      return { success: false, message: "Erreur réseau lors de l'envoi." };
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      await apiRequest(`/applications/${id}`, { method: 'DELETE' });
      refreshData();
    } catch (e) {}
  };

  const addUniversity = async (uni: any) => {
    const payload = {
      name: uni.name,
      acronym: uni.acronym,
      city: uni.location || uni.city,
      type: uni.type.toLowerCase(),
      description: uni.description || "Établissement"
    };
    try {
      await apiRequest('/admin/universities', { method: 'POST', body: JSON.stringify(payload) });
      refreshData();
    } catch (e) {}
  };

  const updateUniversity = async (id: string, uni: any) => {
    try {
      await apiRequest(`/admin/universities/${id}`, { method: 'PUT', body: JSON.stringify(uni) });
      refreshData();
    } catch (e) {}
  };

  const deleteUniversity = async (id: string) => {
    try {
      await apiRequest(`/admin/universities/${id}`, { method: 'DELETE' });
      refreshData();
    } catch (e) {}
  };

  const addMajor = async (major: any) => {
    try {
      await apiRequest('/admin/majors', { method: 'POST', body: JSON.stringify(major) });
      refreshData();
    } catch (e) {}
  };

  const updateMajor = async (id: string, major: any) => {
    try {
      await apiRequest(`/admin/majors/${id}`, { method: 'PUT', body: JSON.stringify(major) });
      refreshData();
    } catch (e) {}
  };

  const deleteMajor = async (id: string) => {
    try {
      await apiRequest(`/admin/majors/${id}`, { method: 'DELETE' });
      refreshData();
    } catch (e) {}
  };

  return (
    <CMSContext.Provider value={{ 
      content, languages: [{ code: 'fr', label: 'Français', isActive: true }], themes, currentLang, activeTheme, userRole, user, token, applications, universities, majors, isLoading, apiError,
      translate, updateContent: () => {}, setLanguage: setCurrentLang,
      applyTheme: (id) => setThemes(prev => prev.map(t => ({ ...t, isActive: t.id === id }))),
      updateTheme: () => {}, setUserRole, login, register, logout, addApplication, refreshData, deleteApplication,
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
