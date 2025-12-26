
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ThemeConfig, CMSContent, UserRole, User, Application, University, Major, Faculty } from './types';

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
  // Admin methods
  updateApplicationStatus: (id: string, status: Application['status']) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  addUniversity: (formData: FormData) => Promise<any>;
  updateUniversity: (id: string, uni: any) => Promise<void>;
  deleteUniversity: (id: string) => Promise<void>;
  addFaculty: (faculty: any) => Promise<any>;
  deleteFaculty: (id: string) => Promise<void>;
  addMajor: (major: any) => Promise<void>;
  updateMajor: (major: Major) => Promise<void>;
  deleteMajor: (id: string) => Promise<void>;
  // SuperAdmin methods
  staffUsers: User[];
  addStaffUser: (user: User) => void;
  deleteStaffUser: (id: string) => void;
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
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token_v1');
  });

  const [universities, setUniversities] = useState<University[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [currentLang, setCurrentLang] = useState('fr');
  const [themes, setThemes] = useState<ThemeConfig[]>(DEFAULT_THEMES);
  const [userRole, setUserRole] = useState<UserRole>(user?.role || 'student');

  const activeTheme = themes.find(t => t.isActive) || themes[0];

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const headers: any = {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(!(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      
      if (response.status === 401) {
        handleLogoutLocal();
        throw new Error("Session expirée");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let message = errorData.message || `Erreur serveur : ${response.status}`;
        if (errorData.errors) {
            const firstErrorKey = Object.keys(errorData.errors)[0];
            message = errorData.errors[firstErrorKey][0];
        }
        throw new Error(message);
      }
      
      return response;
    } catch (error) {
      console.error(`API Fetch Failure on ${endpoint}:`, error);
      throw error;
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    
    // 1. Universités (Public)
    try {
      const uniRes = await fetch(`${API_BASE_URL}/universities`);
      if (uniRes.ok) {
        const uniData = await uniRes.json();
        const rawUnis = Array.isArray(uniData) ? uniData : (uniData.data || []);
        setUniversities(rawUnis.map((u: any) => ({
          ...u,
          id: u.id.toString(),
          location: u.city || u.location || 'Bénin',
          stats: u.stats || { students: 'N/A', majors: 0, founded: 'N/A', ranking: 'N/A' },
          faculties: Array.isArray(u.faculties) ? u.faculties.map((f: any) => ({ ...f, id: f.id.toString() })) : []
        })));
      }
    } catch (e) {
      console.warn("Échec silencieux chargement universités:", e);
    }

    if (token) {
      // 2. Candidatures (Étudiants seulement)
      if (userRole === 'student') {
        try {
          const appRes = await apiRequest('/applications');
          const appData = await appRes.json();
          const rawApps = Array.isArray(appData) ? appData : (appData.data || []);
          setApplications(rawApps.map((a: any) => ({
            ...a,
            id: a.id.toString(),
            status: a.status || 'En attente',
            majorId: a.major_id?.toString()
          })));
        } catch (e) {
          console.warn("Échec silencieux chargement candidatures");
        }
      }

      // 3. Filières (Admin seulement)
      if (userRole !== 'student') {
        try {
          const majorRes = await apiRequest('/admin/majors');
          const majorData = await majorRes.json();
          const rawMajors = Array.isArray(majorData) ? majorData : (majorData.data || []);
          
          setMajors(rawMajors.map((m: any) => ({
            ...m,
            id: m.id.toString(),
            universityId: (m.university_id || m.institution_id)?.toString(),
            facultyId: m.faculty_id?.toString(),
            universityName: m.university?.acronym || m.institution?.acronym || 'N/A',
            facultyName: m.faculty?.name || 'Tronc commun'
          })));
        } catch (e) {
          console.warn("Échec silencieux chargement filières admin");
        }
      }
    }
    
    setIsLoading(false);
  };

  useEffect(() => { refreshData(); }, [token, userRole]);

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
        setUserRole(userData.role);
        localStorage.setItem('auth_token_v1', data.token);
        localStorage.setItem('auth_user_v1', JSON.stringify(userData));
        return { success: true, message: data.message, user: userData };
      }
      return { success: false, message: "Identifiants invalides" };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.status === 201) {
        const userData = { ...data.user, id: data.user.id.toString(), role: data.user.role || 'student' };
        setUser(userData);
        setToken(data.token);
        setUserRole(userData.role);
        localStorage.setItem('auth_token_v1', data.token);
        localStorage.setItem('auth_user_v1', JSON.stringify(userData));
        return { success: true, message: data.message, user: userData };
      }
      return { success: false, message: "Erreur d'inscription" };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const handleLogoutLocal = () => {
    setUser(null);
    setToken(null);
    setUserRole('student');
    localStorage.removeItem('auth_token_v1');
    localStorage.removeItem('auth_user_v1');
  };

  const logout = async () => {
    try { await apiRequest('/logout', { method: 'POST' }); } catch (e) {}
    handleLogoutLocal();
  };

  const addApplication = async (formData: FormData) => {
    try {
      const res = await apiRequest('/applications', { method: 'POST', body: formData });
      if (res.status === 201) {
        refreshData();
        return { success: true, message: "Dossier créé" };
      }
      return { success: false, message: "Erreur" };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const addUniversity = async (formData: FormData) => {
    const res = await apiRequest('/admin/universities', { method: 'POST', body: formData });
    const data = await res.json();
    await refreshData();
    return data.data || data;
  };

  const updateUniversity = async (id: string, uni: any) => {
    await apiRequest(`/admin/universities/${id}`, { method: 'PUT', body: JSON.stringify(uni) });
    refreshData();
  };

  const deleteUniversity = async (id: string) => {
    await apiRequest(`/admin/universities/${id}`, { method: 'DELETE' });
    refreshData();
  };

  const addFaculty = async (faculty: any) => {
    const res = await apiRequest('/admin/faculties', { method: 'POST', body: JSON.stringify(faculty) });
    const data = await res.json();
    await refreshData();
    return data.data || data;
  };

  const deleteFaculty = async (id: string) => {
    await apiRequest(`/admin/faculties/${id}`, { method: 'DELETE' });
    refreshData();
  };

  const addMajor = async (major: any) => {
    await apiRequest('/admin/majors', { method: 'POST', body: JSON.stringify(major) });
    await refreshData();
  };

  const updateMajor = async (major: Major) => {
    const { id, ...data } = major;
    await apiRequest(`/admin/majors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    refreshData();
  };

  const deleteMajor = async (id: string) => {
    await apiRequest(`/admin/majors/${id}`, { method: 'DELETE' });
    refreshData();
  };

  const updateApplicationStatus = (id: string, status: any) => apiRequest(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }).then(() => refreshData());
  const deleteApplication = (id: string) => apiRequest(`/applications/${id}`, { method: 'DELETE' }).then(() => refreshData());
  
  const addStaffUser = (newUser: User) => setStaffUsers(prev => [...prev, newUser]);
  const deleteStaffUser = (id: string) => setStaffUsers(prev => prev.filter(u => u.id !== id));

  return (
    <CMSContext.Provider value={{ 
      content, languages: [{ code: 'fr', label: 'Français', isActive: true }], themes, currentLang, activeTheme, userRole, user, token, applications, universities, majors, isLoading, apiError,
      translate, updateContent: () => {}, setLanguage: setCurrentLang,
      applyTheme: (id) => setThemes(prev => prev.map(t => ({ ...t, isActive: t.id === id }))),
      updateTheme: () => {}, setUserRole, login, register, logout, addApplication, refreshData, deleteApplication,
      addUniversity, updateUniversity, deleteUniversity, addFaculty, deleteFaculty, addMajor, updateMajor, deleteMajor,
      updateApplicationStatus, staffUsers, addStaffUser, deleteStaffUser
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
