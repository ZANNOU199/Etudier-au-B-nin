
export interface University {
  id: string;
  name: string;
  acronym: string;
  location: string; // Mappé depuis 'city'
  city?: string;    // Directement depuis l'API
  type: 'Public' | 'Privé';
  logo: string;
  cover: string;
  description: string;
  isStandaloneSchool?: boolean;
  // Added recommended property to fix errors in AdminDashboard
  recommended?: number;
  stats: {
    students: string;
    majors: number;
    founded: string;
    ranking: string;
  };
  faculties: Faculty[];
}

// Added CareerProspect interface to fix missing member error
export interface CareerProspect {
  title: string;
  icon: string;
}

// Added RequiredDiploma interface to fix missing member error
export interface RequiredDiploma {
  name: string;
  icon: string;
}

export interface Faculty {
  id: string;
  university_id?: string;
  name: string;
  description: string;
  levels: string[];
  // Added type property used in AdminDashboard and ImportService
  type?: 'Faculté' | 'Ecole' | 'Institut';
}

export interface Major {
  id: string;
  faculty_id?: string;
  name: string;
  universityId?: string;
  universityName: string;
  facultyName: string;
  domain: string;
  level: 'Licence' | 'Master' | 'Doctorat';
  duration: string;
  fees: string;
  location: string;
  image: string;
  // Added missing careerProspects and requiredDiplomas properties
  careerProspects?: CareerProspect[];
  requiredDiplomas?: RequiredDiploma[];
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  major_id?: string;
  majorName: string;
  universityName: string;
  status: 'En attente' | 'Validé' | 'Rejeté' | 'En cours';
  date: string;
  primary_document_url?: string;
  documents: any[];
  // Added majorId for navigation in Dashboard.tsx
  majorId?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'student';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  token?: string;
  // Added permissions property used in SuperAdminDashboard
  permissions?: string[];
  // Added ine property used in Dashboard
  ine?: string;
}

export interface Language {
  code: string;
  label: string;
  isActive: boolean;
}

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  background: string;
  surface: string;
  radius: string;
  isActive: boolean;
}

export interface CMSContent {
  [key: string]: {
    [lang: string]: string;
  };
}
