
export interface University {
  id: string;
  name: string;
  acronym: string;
  location: string;
  type: 'Public' | 'Privé';
  logo: string;
  cover: string;
  description: string;
  isStandaloneSchool?: boolean; // Indique si c'est une école autonome (ex: HECM)
  cities?: string[]; // Pour les écoles présentes dans plusieurs villes
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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  ine?: string;
}
