
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ThemeConfig, CMSContent, UserRole, User, Application, University, Major, Faculty } from './types';
import { UNIVERSITIES as MOCK_UNIS, MAJORS as MOCK_MAJORS } from './constants';

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
  recordPayment: (paymentData: { fedapay_id: string, amount: number, status: string, application_id?: string | number | null, description?: string }) => Promise<any>;
  refreshData: () => Promise<void>;
  // Admin methods
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
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
  updateStaffUser: (user: User) => void;
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
  'btn_explore': { fr: "Rechercher", en: "Search" },
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

  const [universities, setUniversities] = useState<University[]>(MOCK_UNIS);
  const [majors, setMajors] = useState<Major[]>(MOCK_MAJORS);
  const [applications, setApplications] = useState<Application[]>([]);
  const [staffUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState('fr');
  const [themes] = useState<ThemeConfig[]>(DEFAULT_THEMES);
  const [, setUserRole] = useState<UserRole>(user?.role || 'student');

  const activeTheme = themes.find(t => t.isActive) || themes[0];

  const translate = (key: string) => {
    return content[key]?.[currentLang] || content[key]?.['fr'] || key;
  };

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const headers: any = {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      
      if (response.status === 401) {
        if (endpoint !== '/majors' && endpoint !== '/universities' && endpoint !== '/login') {
          handleLogoutLocal();
        }
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `Erreur serveur (${response.status})` };
        }
        const error = new Error(errorData.message || `Erreur ${response.status}`);
        (error as any).status = response.status;
        (error as any).data = errorData;
        throw error;
      }
      
      return response;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  };

  const refreshData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const [uniRes, majorRes] = await Promise.all([
        fetch(`${API_BASE_URL}/universities`, { headers: { 'Accept': 'application/json' } }),
        fetch(`${API_BASE_URL}/majors`, { headers: { 'Accept': 'application/json' } })
      ]);

      if (uniRes.ok) {
        const uniData = await uniRes.json();
        const rawUnis = Array.isArray(uniData) ? uniData : (uniData.data || []);
        setUniversities(rawUnis.map((u: any) => ({
          ...u,
          id: u.id.toString(),
          location: u.city || u.location || 'Bénin',
          type: (u.type || u.status_inst || '').toLowerCase() === 'public' ? 'Public' : 'Privé',
          isStandaloneSchool: u.is_standalone === 1 || u.is_standalone === true || u.is_standalone === "1",
          recommended: parseInt(u.recommended || 0),
          stats: u.stats || { students: 'N/A', majors: 0, founded: 'N/A', ranking: 'N/A' },
          faculties: Array.isArray(u.faculties) ? u.faculties.map((f: any) => ({ ...f, id: f.id.toString() })) : []
        })));
      }

      if (majorRes.ok) {
        const majorData = await majorRes.json();
        const rawMajors = Array.isArray(majorData) ? majorData : (majorData.data || []);
        setMajors(rawMajors.map((m: any) => ({
          ...m,
          id: m.id.toString(),
          universityId: (m.university_id || m.institution_id)?.toString(),
          facultyId: m.faculty_id?.toString(),
          universityName: m.university?.acronym || m.institution?.acronym || 'N/A',
          facultyName: m.faculty?.name || 'Tronc commun',
          location: m.location || m.university?.city || 'Bénin',
          image: m.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400',
          careerProspects: m.career_prospects ? (typeof m.career_prospects === 'string' ? JSON.parse(m.career_prospects) : m.career_prospects) : [],
          requiredDiplomas: m.required_diplomas ? (typeof m.required_diplomas === 'string' ? JSON.parse(m.required_diplomas) : m.required_diplomas) : []
        })));
      }

      if (token && user) {
        const isAdmin = user.role === 'admin' || user.role === 'super_admin';
        const endpoint = isAdmin ? '/admin/applications' : '/applications';
        try {
          const appRes = await apiRequest(endpoint);
          const appData = await appRes.json();
          const rawApps = Array.isArray(appData) ? appData : (appData.data || []);
          const statusMap: Record<string, Application['status']> = {
            'pending': 'En attente', 'accepted': 'Validé', 'validated': 'Validé', 'rejected': 'Rejeté', 'processing': 'En cours'
          };
          setApplications(rawApps.map((a: any) => ({
            ...a,
            id: a.id.toString(),
            studentId: (a.user_id || user.id).toString(),
            studentName: a.user ? `${a.user.firstName || a.user.first_name} ${a.user.lastName || a.user.last_name}` : "Candidat",
            majorId: (a.major?.id || a.major_id)?.toString(),
            majorName: a.major?.name || 'Filière non spécifiée',
            universityName: a.major?.university?.acronym || a.university?.acronym || "Établissement",
            status: statusMap[a.status] || a.status || 'En attente',
            date: a.created_at ? new Date(a.created_at).toLocaleDateString('fr-FR') : 'Date inconnue',
            documents: a.documents || [],
            primary_document_url: a.primary_document_url ? (a.primary_document_url.startsWith('http') ? a.primary_document_url : `https://api.cipaph.com${a.primary_document_url}`) : ''
          })));
        } catch (err) {}
      }
    } catch (e) { console.error("Global refresh failure", e); }
    setIsLoading(false);
  };

  useEffect(() => { refreshData(); }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiRequest('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (res.ok) {
        const userData = { ...data.user, id: data.user.id.toString(), role: (data.user.role || 'student').toLowerCase() };
        setUser(userData); setToken(data.token); setUserRole(userData.role as UserRole);
        localStorage.setItem('auth_token_v1', data.token);
        localStorage.setItem('auth_user_v1', JSON.stringify(userData));
        return { success: true, message: data.message, user: userData };
      }
      return { success: false, message: "Identifiants invalides" };
    } catch (e: any) { return { success: false, message: e.message }; }
  };

  const register = async (formData: any) => {
    try {
      const res = await apiRequest('/register', { method: 'POST', body: JSON.stringify(formData) });
      const data = await res.json();
      const userData = { ...data.user, id: data.user.id.toString(), role: (data.user.role || 'student').toLowerCase() };
      setUser(userData); setToken(data.token); setUserRole(userData.role as UserRole);
      localStorage.setItem('auth_token_v1', data.token);
      localStorage.setItem('auth_user_v1', JSON.stringify(userData));
      return { success: true, message: data.message, user: userData };
    } catch (e: any) { return { success: false, message: e.message }; }
  };

  const handleLogoutLocal = () => {
    setUser(null); setToken(null); setUserRole('student');
    localStorage.removeItem('auth_token_v1'); localStorage.removeItem('auth_user_v1');
  };

  const logout = async () => {
    try { await apiRequest('/logout', { method: 'POST' }); } catch (e) {}
    handleLogoutLocal();
  };

  const recordPayment = async (paymentData: { fedapay_id: string, amount: number, status: string, application_id?: string | number | null, description?: string }) => {
    console.log("RECORD_PAYMENT: Tentative d'enregistrement...", paymentData);
    try {
      const res = await apiRequest('/payments', { 
        method: 'POST', 
        body: JSON.stringify({
          fedapay_id: paymentData.fedapay_id,
          amount: paymentData.amount,
          status: paymentData.status,
          application_id: paymentData.application_id || null,
          description: paymentData.description || null,
          mode: 'Mobile Money'
        }) 
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      console.error("RECORD_PAYMENT Error:", e);
      throw e;
    }
  };

  const addApplication = async (formData: FormData) => {
    try {
      const res = await apiRequest('/applications', { method: 'POST', body: formData });
      await refreshData();
      return { success: true, message: "Dossier créé" };
    } catch (e: any) { return { success: false, message: e.message }; }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    const endpoint = isAdmin ? `/admin/applications/${id}/status` : `/applications/${id}/status`;
    const method = isAdmin ? 'PATCH' : 'PUT';
    await apiRequest(endpoint, { method, body: JSON.stringify({ status }) });
    await refreshData();
  };

  const deleteApplication = (id: string) => apiRequest(`/applications/${id}`, { method: 'DELETE' }).then(() => refreshData());
  const addUniversity = async (fd: FormData) => { const res = await apiRequest('/admin/universities', { method: 'POST', body: fd }); await refreshData(); return await res.json(); };
  const updateUniversity = async (id: string, uni: any) => { await apiRequest(`/admin/universities/${id}`, { method: 'PUT', body: JSON.stringify(uni) }); await refreshData(); };
  const deleteUniversity = (id: string) => apiRequest(`/admin/universities/${id}`, { method: 'DELETE' }).then(() => refreshData());
  const addFaculty = async (f: any) => { await apiRequest('/admin/faculties', { method: 'POST', body: JSON.stringify(f) }); await refreshData(); };
  const deleteFaculty = (id: string) => apiRequest(`/admin/faculties/${id}`, { method: 'DELETE' }).then(() => refreshData());
  const addMajor = async (m: any) => { await apiRequest('/admin/majors', { method: 'POST', body: JSON.stringify(m) }); await refreshData(); };
  const updateMajor = async (m: Major) => { await apiRequest(`/admin/majors/${m.id}`, { method: 'PUT', body: JSON.stringify(m) }); await refreshData(); };
  const deleteMajor = (id: string) => apiRequest(`/admin/majors/${id}`, { method: 'DELETE' }).then(() => refreshData());

  return (
    <CMSContext.Provider value={{ 
      content, languages: [{ code: 'fr', label: 'Français', isActive: true }], themes, currentLang, activeTheme, userRole: user?.role || 'student', user, token, applications, universities, majors, isLoading, apiError,
      translate, updateContent: () => {}, setLanguage: setCurrentLang,
      applyTheme: () => {}, updateTheme: () => {}, setUserRole: () => {}, login, register, logout, addApplication, recordPayment, refreshData, deleteApplication,
      addUniversity, updateUniversity, deleteUniversity, addFaculty, deleteFaculty, addMajor, updateMajor, deleteMajor,
      updateApplicationStatus, staffUsers: [], addStaffUser: () => {}, updateStaffUser: () => {}, deleteStaffUser: () => {}
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
