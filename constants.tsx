
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
      { id: 'epac', name: "EPAC (Polytechnique)", description: 'Ingénierie et Technologies', levels: ['Licence', 'Master', 'Doctorat'], type: 'Ecole' },
      { id: 'eneam-uac', name: "ENEAM", description: 'Économie et Management', levels: ['Licence', 'Master'], type: 'Ecole' },
      { id: 'fadesp', name: "FADESP", description: 'Droit et Sciences Politiques', levels: ['Licence', 'Master', 'Doctorat'], type: 'Faculté' }
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
      { id: 'fm-up', name: "Faculté de Médecine", description: 'Santé humaine', levels: ['Doctorat'], type: 'Faculté' }
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
    // Fix: Removed duplicate isStandaloneSchool property
    stats: { students: '12,000+', majors: 45, founded: '2016', ranking: 'Top Innovation' },
    faculties: [
      { id: 'insti', name: "INSTI Lokossa", description: 'Technologies Industrielles', levels: ['Licence'], type: 'Institut' }
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
      { id: 'ensta', name: "ENSTA Ketou", description: 'Sciences et Techniques Agraires', levels: ['Licence'], type: 'Ecole' }
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
  // --- UAC (EPAC) ---
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
    careerProspects: [{ title: "Développeur Fullstack", icon: "code" }, { title: "Architecte Logiciel", icon: "architecture" }, { title: "Chef de Projet IT", icon: "assignment" }],
    requiredDiplomas: [{ name: "BAC C / D / E", icon: "school" }]
  },
  {
    id: 'uac-ds',
    name: "Data Science & IA",
    universityId: 'uac',
    universityName: "UAC (EPAC)",
    facultyName: 'EPAC',
    domain: 'Informatique',
    level: 'Master',
    duration: '2 Ans',
    fees: '600.000 FCFA',
    location: 'Abomey-Calavi',
    image: 'https://images.unsplash.com/photo-1551288049-bbda38656ad1?q=80&w=400',
    careerProspects: [{ title: "Data Scientist", icon: "analytics" }, { title: "Ingénieur IA", icon: "psychology" }],
    requiredDiplomas: [{ name: "Licence Math-Info", icon: "history_edu" }]
  },
  {
    id: 'uac-finance',
    name: "Banque & Finance",
    universityId: 'uac',
    universityName: "UAC (ENEAM)",
    facultyName: 'ENEAM',
    domain: 'Finances',
    level: 'Licence',
    duration: '3 Ans',
    fees: '400.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=400',
    careerProspects: [{ title: "Analyste Financier", icon: "trending_up" }, { title: "Conseiller Clientèle", icon: "person" }],
    requiredDiplomas: [{ name: "BAC B / G2 / C", icon: "calculate" }]
  },

  // --- UP (Parakou) ---
  {
    id: 'up-med',
    name: "Médecine Générale",
    universityId: 'up',
    universityName: "Université de Parakou",
    facultyName: 'Faculté de Médecine',
    domain: 'Santé',
    level: 'Doctorat',
    duration: '8 Ans',
    fees: 'Bourse d\'État',
    location: 'Parakou',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400',
    careerProspects: [{ title: "Médecin Généraliste", icon: "medical_services" }, { title: "Chercheur en Santé", icon: "biotechnology" }],
    requiredDiplomas: [{ name: "BAC C / D", icon: "science" }]
  },
  {
    id: 'up-agro',
    name: "Économie & Sociologie Rurale",
    universityId: 'up',
    universityName: "Université de Parakou",
    facultyName: 'FSA',
    domain: 'Agriculture',
    level: 'Licence',
    duration: '3 Ans',
    fees: '185.000 FCFA',
    location: 'Parakou',
    image: 'https://images.unsplash.com/photo-1495107336281-19d4f7a4ca0c?q=80&w=400',
    careerProspects: [{ title: "Conseiller Agricole", icon: "grass" }, { title: "Gestionnaire de Coopérative", icon: "groups" }],
    requiredDiplomas: [{ name: "BAC D / C", icon: "eco" }]
  },

  // --- HECM ---
  {
    id: 'hecm-com',
    name: "Marketing & Communication",
    universityId: 'hecm',
    universityName: "HECM",
    facultyName: "Pôle Gestion",
    domain: "Communication",
    level: 'Licence',
    duration: '3 Ans',
    fees: '385.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400',
    careerProspects: [{ title: "Chef de Marque", icon: "campaign" }, { title: "Chargé de Com", icon: "forum" }],
    requiredDiplomas: [{ name: "BAC Toutes séries", icon: "school" }]
  },
  {
    id: 'hecm-rh',
    name: "Management des RH",
    universityId: 'hecm',
    universityName: "HECM",
    facultyName: "Pôle Gestion",
    domain: "Gestion",
    level: 'Master',
    duration: '2 Ans',
    fees: '550.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400',
    careerProspects: [{ title: "DRH", icon: "badge" }, { title: "Recruteur", icon: "person_search" }],
    requiredDiplomas: [{ name: "Licence de Gestion", icon: "history_edu" }]
  },

  // --- UNSTIM ---
  {
    id: 'unstim-nrj',
    name: "Énergies Renouvelables",
    universityId: 'unstim',
    universityName: "UNSTIM",
    facultyName: 'INSTI',
    domain: 'Énergie',
    level: 'Licence',
    duration: '3 Ans',
    fees: '450.000 FCFA',
    location: 'Lokossa',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400',
    careerProspects: [{ title: "Technicien Solaire", icon: "wb_sunny" }, { title: "Expert Éolien", icon: "air" }],
    requiredDiplomas: [{ name: "BAC C / D / E / F", icon: "bolt" }]
  },

  // --- ISM Adonai ---
  {
    id: 'ism-audit',
    name: "Audit & Contrôle de Gestion",
    universityId: 'ism-adonai',
    universityName: "ISM Adonaï",
    facultyName: "Pôle Expertise",
    domain: "Finances",
    level: 'Master',
    duration: '2 Ans',
    fees: '650.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1454165833762-01d67877bd2c?q=80&w=400',
    careerProspects: [{ title: "Auditeur", icon: "manage_search" }, { title: "Contrôleur de Gestion", icon: "monitoring" }],
    requiredDiplomas: [{ name: "Licence Comptabilité", icon: "history_edu" }]
  },

  // --- ESGIS ---
  {
    id: 'esgis-cyber',
    name: "Cybersécurité",
    universityId: 'esgis',
    universityName: "ESGIS",
    facultyName: "Technologies",
    domain: "Informatique",
    level: 'Licence',
    duration: '3 Ans',
    fees: '500.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400',
    careerProspects: [{ title: "Analyste Sécurité", icon: "lock" }, { title: "Hacker Éthique", icon: "terminal" }],
    requiredDiplomas: [{ name: "BAC C / D / E", icon: "security" }]
  },

  // --- CERCO ---
  {
    id: 'cerco-ia',
    name: "Intelligence Artificielle",
    universityId: 'cerco',
    universityName: "CERCO",
    facultyName: "Digital Lab",
    domain: "Informatique",
    level: 'Licence',
    duration: '3 Ans',
    fees: '550.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400',
    careerProspects: [{ title: "Développeur IA", icon: "smart_toy" }, { title: "Data Analyst", icon: "bar_chart" }],
    requiredDiplomas: [{ name: "BAC C / E", icon: "memory" }]
  },

  // --- UNA ---
  {
    id: 'una-agro',
    name: "Agro-Industrie",
    universityId: 'una',
    universityName: "UNA",
    facultyName: 'ENSTA',
    domain: 'Agriculture',
    level: 'Licence',
    duration: '3 Ans',
    fees: '185.000 FCFA',
    location: 'Kétou',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400',
    careerProspects: [{ title: "Technologue Alimentaire", icon: "restaurant" }, { title: "Chef de Production", icon: "factory" }],
    requiredDiplomas: [{ name: "BAC D", icon: "grass" }]
  },

  // --- UPN ---
  {
    id: 'upn-droit',
    name: "Droit des Affaires",
    universityId: 'upn',
    universityName: "UPN",
    facultyName: 'FADESP',
    domain: 'Droit',
    level: 'Master',
    duration: '2 Ans',
    fees: '250.000 FCFA',
    location: 'Porto-Novo',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400',
    careerProspects: [{ title: "Juriste d'Affaires", icon: "gavel" }, { title: "Notaire", icon: "description" }],
    requiredDiplomas: [{ name: "Licence en Droit", icon: "menu_book" }]
  },

  // --- PIGIER ---
  {
    id: 'pigier-sec',
    name: "Assistante de Direction",
    universityId: 'pigier',
    universityName: "PIGIER",
    facultyName: "Tertiaire",
    domain: "Administration",
    level: 'Licence',
    duration: '3 Ans',
    fees: '550.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400',
    careerProspects: [{ title: "Assistante de Manager", icon: "support_agent" }, { title: "Office Manager", icon: "business_center" }],
    requiredDiplomas: [{ name: "BAC G1 / A", icon: "format_list_bulleted" }]
  },

  // --- ENEAM Standalone ---
  {
    id: 'eneam-stat',
    name: "Statistique Économique",
    universityId: 'eneam-standalone',
    universityName: "ENEAM",
    facultyName: "Pôle Statistique",
    domain: "Économie",
    level: 'Licence',
    duration: '3 Ans',
    fees: '150.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=400',
    careerProspects: [{ title: "Chargé d'Études", icon: "analytics" }, { title: "Économètre", icon: "show_chart" }],
    requiredDiplomas: [{ name: "BAC C / G2", icon: "functions" }]
  },
  {
    id: 'eneam-compt',
    name: "Comptabilité Gestion",
    universityId: 'eneam-standalone',
    universityName: "ENEAM",
    facultyName: "Pôle Gestion",
    domain: "Gestion",
    level: 'Licence',
    duration: '3 Ans',
    fees: '150.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400',
    careerProspects: [{ title: "Comptable", icon: "account_balance_wallet" }, { title: "Trésorier", icon: "payments" }],
    requiredDiplomas: [{ name: "BAC G2 / C", icon: "calculate" }]
  },

  // --- New Entries for Pagination ---
  {
    id: 'uac-bio',
    name: "Bio-Chimie Humaine",
    universityId: 'uac',
    universityName: "UAC (FAST)",
    facultyName: 'FAST',
    domain: 'Sciences',
    level: 'Licence',
    duration: '3 Ans',
    fees: 'Gratuit (Bourse)',
    location: 'Abomey-Calavi',
    image: 'https://images.unsplash.com/photo-1532187863486-abf51ad9f69d?q=80&w=400',
    careerProspects: [{ title: "Biologiste de Labo", icon: "biotechnology" }, { title: "Pharmacologue", icon: "medication" }],
    requiredDiplomas: [{ name: "BAC C / D", icon: "science" }]
  },
  {
    id: 'up-droit-up',
    name: "Droit Public",
    universityId: 'up',
    universityName: "Université de Parakou",
    facultyName: 'FDSP',
    domain: 'Droit',
    level: 'Licence',
    duration: '3 Ans',
    fees: '150.000 FCFA',
    location: 'Parakou',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=400',
    careerProspects: [{ title: "Administrateur Civil", icon: "account_balance" }, { title: "Juriste Publiciste", icon: "gavel" }],
    requiredDiplomas: [{ name: "BAC A / B", icon: "menu_book" }]
  },
  {
    id: 'esgis-reseau',
    name: "Réseaux & Télécoms",
    universityId: 'esgis',
    universityName: "ESGIS",
    facultyName: "Technologies",
    domain: "Informatique",
    level: 'Licence',
    duration: '3 Ans',
    fees: '500.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400',
    careerProspects: [{ title: "Admin Réseaux", icon: "router" }, { title: "Ingénieur Télécoms", icon: "settings_input_component" }],
    requiredDiplomas: [{ name: "BAC C / D / E", icon: "settings_ethernet" }]
  },
  {
    id: 'uak-biotech',
    name: "Biotechnologies Végétales",
    universityId: 'uak',
    universityName: "UAK",
    facultyName: 'ENAT',
    domain: 'Agriculture',
    level: 'Master',
    duration: '2 Ans',
    fees: '250.000 FCFA',
    location: 'Kétou',
    image: 'https://images.unsplash.com/photo-1530836361280-88eb2d477bf0?q=80&w=400',
    careerProspects: [{ title: "Améliorateur de Plantes", icon: "potted_plant" }, { title: "Chercheur INSAE", icon: "biotechnology" }],
    requiredDiplomas: [{ name: "Licence Agronomie", icon: "history_edu" }]
  },
  {
    id: 'cerco-fullstack',
    name: "Dév. Web Fullstack",
    universityId: 'cerco',
    universityName: "CERCO",
    facultyName: "Digital Lab",
    domain: "Informatique",
    level: 'Licence',
    duration: '3 Ans',
    fees: '450.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400',
    careerProspects: [{ title: "Développeur Web", icon: "web" }, { title: "Freelance", icon: "laptop_mac" }],
    requiredDiplomas: [{ name: "BAC Toutes séries", icon: "terminal" }]
  }
];
