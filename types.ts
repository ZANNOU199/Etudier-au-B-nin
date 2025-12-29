
export interface University {
  id: string;
  name: string;
  acronym: string;
  location: string;
  city?: string;
  type: 'Public' | 'Privé';
  logo: string;
  cover: string;
  description: string;
  isStandaloneSchool?: boolean;
  recommended?: number;
  stats: {
    students: string;
    majors: number;
    founded: string;
    ranking: string;
  };
  faculties: Faculty[];
}

export interface CareerProspect {
  title: string;
  icon: string;
}

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
  type?: 'Faculté' | 'Ecole' | 'Institut';
}

export interface Major {
  id: string;
  facultyId?: string;
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
  careerProspects?: CareerProspect[];
  requiredDiplomas?: RequiredDiploma[];
}

export interface Payment {
  id: string;
  fedapay_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'failed' | 'canceled';
  mode: string;
  description?: string;
  created_at: string;
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
  majorId?: string;
  payment?: Payment; // Lien vers le paiement si existant
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
  permissions?: string[];
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
