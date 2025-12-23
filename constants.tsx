
import { University, Major } from './types';

export const UNIVERSITIES: University[] = [
  {
    id: 'uac',
    name: "Université d'Abomey-Calavi",
    acronym: 'UAC',
    location: 'Abomey-Calavi',
    type: 'Public',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
    description: "Plus grande université du Bénin, pôle d'excellence multidisciplinaire.",
    isStandaloneSchool: false,
    stats: { students: '85,000+', majors: 150, founded: '1970', ranking: '1er National' },
    faculties: [
      { id: 'epac', name: "EPAC", description: 'Ingénierie et Technologies', levels: ['Licence', 'Master', 'Doctorat'], type: 'Ecole' },
      { id: 'eneam-uac', name: "ENEAM", description: 'Économie et Management', levels: ['Licence', 'Master'], type: 'Ecole' },
      { id: 'fadesp', name: "FADESP", description: 'Droit et Sciences Politiques', levels: ['Licence', 'Master', 'Doctorat'], type: 'Faculté' },
      { id: 'fast', name: "FAST", description: 'Sciences et Techniques', levels: ['Licence', 'Master'], type: 'Faculté' }
    ]
  },
  {
    id: 'up',
    name: "Université de Parakou",
    acronym: 'UP',
    location: 'Parakou',
    type: 'Public',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: "Deuxième pôle universitaire du pays, leader dans le septentrion.",
    isStandaloneSchool: false,
    stats: { students: '30,000+', majors: 85, founded: '2001', ranking: '2ème National' },
    faculties: [
      { id: 'fsa-up', name: "FSA", description: 'Sciences Agronomiques', levels: ['Licence', 'Master'], type: 'Faculté' },
      { id: 'fm-up', name: "Faculté de Médecine", description: 'Santé humaine', levels: ['Doctorat'], type: 'Faculté' },
      { id: 'fdsp-up', name: "FDSP", description: 'Droit et Sciences Politiques', levels: ['Licence', 'Master'], type: 'Faculté' }
    ]
  },
  {
    id: 'hecm',
    name: "Hautes Études Commerciales et de Management",
    acronym: 'HECM',
    location: 'Cotonou',
    type: 'Privé',
    isStandaloneSchool: true,
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    description: "L'école des leaders, pionnière de l'enseignement supérieur privé au Bénin.",
    stats: { students: '15,000+', majors: 25, founded: '1999', ranking: '1er Privé' },
    faculties: []
  },
  {
    id: 'unstim',
    name: "Université des Sciences et Technologies",
    acronym: 'UNSTIM',
    location: 'Abomey',
    type: 'Public',
    isStandaloneSchool: false,
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200',
    description: "Formation de pointe en ingénierie et technologies industrielles.",
    stats: { students: '12,000+', majors: 45, founded: '2016', ranking: 'Top Innovation' },
    faculties: [
      { id: 'insti', name: "INSTI", description: 'Technologies Industrielles', levels: ['Licence'], type: 'Institut' }
    ]
  },
  {
    id: 'ism-adonai',
    name: "Institut Supérieur Adonaï",
    acronym: 'ISM ADONAI',
    location: 'Cotonou',
    type: 'Privé',
    isStandaloneSchool: true,
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1200',
    description: "Spécialiste en Audit, Contrôle de Gestion et Comptabilité.",
    stats: { students: '5,000+', majors: 18, founded: '2005', ranking: 'Top Management' },
    faculties: []
  },
  {
    id: 'una',
    name: "Université Nationale d'Agriculture",
    acronym: 'UNA',
    location: 'Porto-Novo',
    type: 'Public',
    isStandaloneSchool: false,
    logo: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200',
    description: "Dédiée à la recherche agronomique et à la sécurité alimentaire.",
    stats: { students: '8,000+', majors: 30, founded: '2016', ranking: 'Leader Agrotech' },
    faculties: [
      { id: 'ensta', name: "ENSTA", description: 'Sciences et Techniques Agraires', levels: ['Licence'], type: 'Ecole' }
    ]
  },
  {
    id: 'esgis',
    name: "ESGIS Bénin",
    acronym: 'ESGIS',
    location: 'Cotonou',
    type: 'Privé',
    isStandaloneSchool: true,
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200',
    description: "Expertise en systèmes d'information et gestion des entreprises.",
    stats: { students: '3,500', majors: 12, founded: '2008', ranking: 'Top Privé' },
    faculties: []
  },
  {
    id: 'upn',
    name: "Université de Porto-Novo",
    acronym: 'UPN',
    location: 'Porto-Novo',
    type: 'Public',
    isStandaloneSchool: false,
    logo: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1200',
    description: "Pôle d'excellence en sciences sociales et humaines.",
    stats: { students: '20,000', majors: 40, founded: '2010', ranking: '4ème National' },
    faculties: [
      { id: 'fashs-upn', name: "FASHS", description: 'Lettres et Sciences Humaines', levels: ['Licence'], type: 'Faculté' }
    ]
  },
  {
    id: 'cerco',
    name: "Groupe Cerco",
    acronym: 'CERCO',
    location: 'Cotonou',
    type: 'Privé',
    isStandaloneSchool: true,
    logo: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1200',
    description: "Innovation technologique, IA et entrepreneuriat.",
    stats: { students: '4,000', majors: 15, founded: '1998', ranking: 'Innovateur' },
    faculties: []
  },
  {
    id: 'uak',
    name: "Université d'Agriculture de Kétou",
    acronym: 'UAK',
    location: 'Kétou',
    type: 'Public',
    isStandaloneSchool: false,
    logo: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200',
    description: "Recherche agronomique avancée et biotechnologies.",
    stats: { students: '5,000', majors: 20, founded: '2012', ranking: 'Spécialisé' },
    faculties: [
      { id: 'enat', name: "ENAT", description: 'Agro-technologie', levels: ['Licence'], type: 'Ecole' }
    ]
  },
  {
    id: 'pigier',
    name: "Pigier Bénin",
    acronym: 'PIGIER',
    location: 'Cotonou',
    type: 'Privé',
    isStandaloneSchool: true,
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200',
    description: "Formation pratique aux métiers de l'entreprise et du tertiaire.",
    stats: { students: '3,000', majors: 10, founded: '1995', ranking: 'Référence' },
    faculties: []
  },
  {
    id: 'eneam-standalone',
    name: "ENEAM (Autonome)",
    acronym: 'ENEAM',
    location: 'Cotonou',
    type: 'Public',
    isStandaloneSchool: true,
    logo: 'https://images.unsplash.com/photo-1551288049-bbda38656ad1?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1551288049-bbda38656ad1?q=80&w=1200',
    description: "Référence nationale en économie, statistique et management.",
    stats: { students: '6,000', majors: 12, founded: '1980', ranking: 'Prestigieuse' },
    faculties: []
  }
];

export const MAJORS: Major[] = [
  // --- UAC (EPAC / ENEAM / FADESP) ---
  {
    id: 'uac-gl',
    name: "Génie Logiciel",
    universityId: 'uac',
    universityName: "UAC (EPAC)",
    facultyName: 'EPAC',
    domain: 'Informatique',
    level: 'Licence',
    duration: '3 Ans',
    fees: '450.000 FCFA',
    location: 'Abomey-Calavi',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400',
    careerProspects: [{ title: "Développeur Fullstack", icon: "code" }, { title: "Chef de Projet IT", icon: "assignment" }],
    requiredDiplomas: [{ name: "BAC C / D / E", icon: "school" }]
  },
  {
    id: 'uac-droit',
    name: "Droit des Affaires",
    universityId: 'uac',
    universityName: "UAC (FADESP)",
    facultyName: 'FADESP',
    domain: 'Droit',
    level: 'Licence',
    duration: '3 Ans',
    fees: 'Gratuit (Bourse)',
    location: 'Abomey-Calavi',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400',
    careerProspects: [{ title: "Juriste d'entreprise", icon: "business_center" }, { title: "Avocat d'affaires", icon: "gavel" }],
    requiredDiplomas: [{ name: "BAC A1 / A2 / B", icon: "menu_book" }]
  },

  // --- HECM (Standalone) ---
  {
    id: 'hecm-marketing',
    name: "Marketing & Communication",
    universityId: 'hecm',
    universityName: "HECM",
    facultyName: "Hautes Études Commerciales et de Management",
    domain: "Communication",
    level: 'Licence',
    duration: '3 Ans',
    fees: '385.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400',
    careerProspects: [{ title: "Responsable Marketing", icon: "campaign" }, { title: "Chargé de Com", icon: "forum" }],
    requiredDiplomas: [{ name: "BAC Toutes séries", icon: "school" }]
  },
  {
    id: 'hecm-rh',
    name: "Management des RH",
    universityId: 'hecm',
    universityName: "HECM",
    facultyName: "Hautes Études Commerciales et de Management",
    domain: "Gestion",
    level: 'Licence',
    duration: '3 Ans',
    fees: '385.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400',
    careerProspects: [{ title: "Gestionnaire RH", icon: "badge" }, { title: "Recruteur", icon: "person_search" }],
    requiredDiplomas: [{ name: "BAC G2 / G3 / B / D", icon: "school" }]
  },
  {
    id: 'hecm-audit',
    name: "Audit & Contrôle de Gestion",
    universityId: 'hecm',
    universityName: "HECM",
    facultyName: "Hautes Études Commerciales et de Management",
    domain: "Finances",
    level: 'Master',
    duration: '2 Ans',
    fees: '550.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1454165833762-01d67877bd2c?q=80&w=400',
    careerProspects: [{ title: "Auditeur interne", icon: "manage_search" }, { title: "Contrôleur de gestion", icon: "monitoring" }],
    requiredDiplomas: [{ name: "Licence Gestion/Comptabilité", icon: "history_edu" }]
  },

  // --- ISM ADONAI (Standalone) ---
  {
    id: 'ism-compta',
    name: "Comptabilité, Audit et Contrôle",
    universityId: 'ism-adonai',
    universityName: "ISM ADONAI",
    facultyName: "Institut Supérieur Adonaï",
    domain: "Finances",
    level: 'Licence',
    duration: '3 Ans',
    fees: '425.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400',
    careerProspects: [{ title: "Comptable", icon: "account_balance_wallet" }, { title: "Assistant Audit", icon: "verified" }],
    requiredDiplomas: [{ name: "BAC G2 / C / D / B", icon: "calculate" }]
  },
  {
    id: 'ism-banque',
    name: "Banque et Institutions Financières",
    universityId: 'ism-adonai',
    universityName: "ISM ADONAI",
    facultyName: "Institut Supérieur Adonaï",
    domain: "Finances",
    level: 'Licence',
    duration: '3 Ans',
    fees: '425.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1501167786227-4cba0077d0d2?q=80&w=400',
    careerProspects: [{ title: "Chargé de clientèle", icon: "groups" }, { title: "Analyste Crédit", icon: "trending_up" }],
    requiredDiplomas: [{ name: "BAC G2 / B / C / D", icon: "payments" }]
  },

  // --- ESGIS (Standalone) ---
  {
    id: 'esgis-cyber',
    name: "Systèmes, Réseaux et Cybersécurité",
    universityId: 'esgis',
    universityName: "ESGIS",
    facultyName: "ESGIS Bénin",
    domain: "Informatique",
    level: 'Licence',
    duration: '3 Ans',
    fees: '500.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400',
    careerProspects: [{ title: "Administrateur Réseaux", icon: "router" }, { title: "Analyste Sécurité", icon: "lock" }],
    requiredDiplomas: [{ name: "BAC C / D / E / F", icon: "security" }]
  },
  {
    id: 'esgis-digital',
    name: "Management Digital",
    universityId: 'esgis',
    universityName: "ESGIS",
    facultyName: "ESGIS Bénin",
    domain: "Management",
    level: 'Licence',
    duration: '3 Ans',
    fees: '480.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400',
    careerProspects: [{ title: "Chef de projet Digital", icon: "devices" }, { title: "Social Media Manager", icon: "public" }],
    requiredDiplomas: [{ name: "BAC Toutes séries", icon: "laptop" }]
  },

  // --- CERCO (Standalone) ---
  {
    id: 'cerco-ia',
    name: "Intelligence Artificielle et Big Data",
    universityId: 'cerco',
    universityName: "CERCO",
    facultyName: "Groupe Cerco",
    domain: "Informatique",
    level: 'Licence',
    duration: '3 Ans',
    fees: '550.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400',
    careerProspects: [{ title: "Développeur IA", icon: "smart_toy" }, { title: "Data Analyst", icon: "analytics" }],
    requiredDiplomas: [{ name: "BAC C / E / D", icon: "memory" }]
  },
  {
    id: 'cerco-iot',
    name: "Objets Connectés (IoT)",
    universityId: 'cerco',
    universityName: "CERCO",
    facultyName: "Groupe Cerco",
    domain: "Technologies",
    level: 'Licence',
    duration: '3 Ans',
    fees: '550.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=400',
    careerProspects: [{ title: "Ingénieur IoT", icon: "settings_input_component" }, { title: "Maintenancier Systèmes", icon: "build" }],
    requiredDiplomas: [{ name: "BAC C / E / F", icon: "sensors" }]
  },

  // --- PIGIER (Standalone) ---
  {
    id: 'pigier-assdir',
    name: "Assistant de Direction",
    universityId: 'pigier',
    universityName: "PIGIER",
    facultyName: "Pigier Bénin",
    domain: "Administration",
    level: 'Licence',
    duration: '3 Ans',
    fees: '525.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400',
    careerProspects: [{ title: "Assistant de Manager", icon: "support_agent" }, { title: "Office Manager", icon: "business_center" }],
    requiredDiplomas: [{ name: "BAC G1 / A / B", icon: "format_list_bulleted" }]
  },
  {
    id: 'pigier-compta',
    name: "Gestion Comptable et Financière",
    universityId: 'pigier',
    universityName: "PIGIER",
    facultyName: "Pigier Bénin",
    domain: "Finances",
    level: 'Licence',
    duration: '3 Ans',
    fees: '525.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=400',
    careerProspects: [{ title: "Comptable d'entreprise", icon: "account_balance" }, { title: "Assistant Trésorier", icon: "savings" }],
    requiredDiplomas: [{ name: "BAC G2 / B / C / D", icon: "calculate" }]
  },

  // --- ENEAM STANDALONE ---
  {
    id: 'eneam-stat',
    name: "Statistique Économique",
    universityId: 'eneam-standalone',
    universityName: "ENEAM",
    facultyName: "ENEAM (Autonome)",
    domain: "Économie",
    level: 'Licence',
    duration: '3 Ans',
    fees: '150.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=400',
    careerProspects: [{ title: "Statisticien", icon: "bar_chart" }, { title: "Chargé d'études", icon: "analytics" }],
    requiredDiplomas: [{ name: "BAC C / D / G2", icon: "functions" }]
  },
  {
    id: 'eneam-management',
    name: "Management des Organisations",
    universityId: 'eneam-standalone',
    universityName: "ENEAM",
    facultyName: "ENEAM (Autonome)",
    domain: "Management",
    level: 'Licence',
    duration: '3 Ans',
    fees: '150.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=400',
    careerProspects: [{ title: "Gestionnaire de projet", icon: "assignment" }, { title: "Administrateur", icon: "business" }],
    requiredDiplomas: [{ name: "BAC B / G2 / D / G3", icon: "groups" }]
  }
];
