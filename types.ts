
export interface University {
  id: string;
  name: string;
  acronym: string;
  location: string;
  type: 'Public' | 'Privé';
  logo: string;
  cover: string;
  description: string;
  isStandaloneSchool?: boolean;
  cities?: string[];
  stats: {
    students: string;
    majors: number;
    founded: string;
    ranking: string;
  };
  faculties: Faculty[];
}

export interface Faculty {
  id: string;
  name: string;
  description: string;
  levels: string[];
  type?: 'Ecole' | 'Institut' | 'Faculté';
}

export interface CareerProspect {
  title: string;
  icon: string;
}

export interface RequiredDiploma {
  name: string;
  icon: string;
}

export interface Major {
  id: string;
  name: string;
  universityId: string;
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

export type UserRole = 'super_admin' | 'editor' | 'student';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  ine?: string;
}

// CMS SPECIFIC TYPES
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
