
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
      { id: 'fadesp', name: "FADESP (Droit)", description: 'Droit et Sciences Politiques', levels: ['Licence', 'Master', 'Doctorat'], type: 'Faculté' },
      { id: 'fast', name: "FAST (Sciences)", description: 'Sciences et Techniques', levels: ['Licence', 'Master'], type: 'Faculté' }
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
    id: 'uac-gc',
    name: "Génie Civil",
    universityId: 'uac',
    universityName: "UAC (EPAC)",
    facultyName: 'EPAC',
    domain: 'BTP',
    level: 'Licence',
    duration: '3 Ans',
    fees: '450.000 FCFA',
    location: 'Abomey-Calavi',
    image: 'https://images.unsplash.com/photo-1541888941257-183a6200ca21?q=80&w=400',
    careerProspects: [{ title: "Ingénieur de Chantier", icon: "engineering" }, { title: "Chef de projet BTP", icon: "foundation" }],
    requiredDiplomas: [{ name: "BAC C / D / E / F4", icon: "school" }]
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
    careerProspects: [{ title: "Avocat d'affaires", icon: "gavel" }, { title: "Juriste d'entreprise", icon: "business_center" }],
    requiredDiplomas: [{ name: "BAC A1 / A2 / B", icon: "menu_book" }]
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
    id: 'up-droit-pub',
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
    careerProspects: [{ title: "Administrateur Civil", icon: "account_balance" }, { title: "Diplomate", icon: "public" }],
    requiredDiplomas: [{ name: "BAC A1 / A2 / B", icon: "history_edu" }]
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
    name: "Gestion des RH",
    universityId: 'hecm',
    universityName: "HECM",
    facultyName: "Pôle Gestion",
    domain: "Management",
    level: 'Master',
    duration: '2 Ans',
    fees: '550.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400',
    careerProspects: [{ title: "Responsable RH", icon: "badge" }, { title: "Consultant Recrutement", icon: "person_search" }],
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
  {
    id: 'unstim-maint',
    name: "Maintenance Industrielle",
    universityId: 'unstim',
    universityName: "UNSTIM",
    facultyName: 'INSTI',
    domain: 'Industrie',
    level: 'Licence',
    duration: '3 Ans',
    fees: '450.000 FCFA',
    location: 'Lokossa',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400',
    careerProspects: [{ title: "Chef de Maintenance", icon: "settings" }, { title: "Responsable Qualité", icon: "verified" }],
    requiredDiplomas: [{ name: "BAC E / F / C", icon: "precision_manufacturing" }]
  },

  // --- ISM Adonai ---
  {
    id: 'ism-audit',
    name: "Audit & Contrôle de Gestion",
    universityId: 'ism-adonai',
    universityName: "ISM Adonaï",
    facultyName: "Département Finance",
    domain: "Finances",
    level: 'Master',
    duration: '2 Ans',
    fees: '650.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1454165833762-01d67877bd2c?q=80&w=400',
    careerProspects: [{ title: "Auditeur Interne", icon: "manage_search" }, { title: "Contrôleur de Gestion", icon: "monitoring" }],
    requiredDiplomas: [{ name: "Licence Comptabilité", icon: "history_edu" }]
  },

  // --- ESGIS ---
  {
    id: 'esgis-cyber',
    name: "Cybersécurité",
    universityId: 'esgis',
    universityName: "ESGIS",
    facultyName: "Systèmes d'Information",
    domain: "Informatique",
    level: 'Licence',
    duration: '3 Ans',
    fees: '500.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400',
    careerProspects: [{ title: "Analyste Sécurité", icon: "lock" }, { title: "Pénétreur (Hacker éthique)", icon: "terminal" }],
    requiredDiplomas: [{ name: "BAC C / D / E", icon: "security" }]
  },

  // --- CERCO ---
  {
    id: 'cerco-ia',
    name: "Intelligence Artificielle",
    universityId: 'cerco',
    universityName: "CERCO",
    facultyName: "Institut d'Innovation",
    domain: "Informatique",
    level: 'Licence',
    duration: '3 Ans',
    fees: '550.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400',
    careerProspects: [{ title: "Ingénieur IA", icon: "smart_toy" }, { title: "Data Scientist", icon: "bar_chart" }],
    requiredDiplomas: [{ name: "BAC C / E", icon: "memory" }]
  },

  // --- UNA ---
  {
    id: 'una-agro-ind',
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
    careerProspects: [{ title: "Ingénieur Agroalimentaire", icon: "restaurant" }, { title: "Responsable Production", icon: "factory" }],
    requiredDiplomas: [{ name: "BAC D / C", icon: "grass" }]
  },

  // --- UPN ---
  {
    id: 'upn-socio',
    name: "Sociologie du Développement",
    universityId: 'upn',
    universityName: "UPN",
    facultyName: 'FASHS',
    domain: 'Sciences Sociales',
    level: 'Licence',
    duration: '3 Ans',
    fees: 'Gratuit',
    location: 'Porto-Novo',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400',
    careerProspects: [{ title: "Chargé d'études sociales", icon: "groups" }, { title: "Consultant ONG", icon: "public" }],
    requiredDiplomas: [{ name: "BAC A1 / A2 / B / D", icon: "school" }]
  },

  // --- PIGIER ---
  {
    id: 'pigier-ass-dir',
    name: "Assistante de Direction",
    universityId: 'pigier',
    universityName: "PIGIER",
    facultyName: "Département Tertiaire",
    domain: "Administration",
    level: 'Licence',
    duration: '3 Ans',
    fees: '550.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400',
    careerProspects: [{ title: "Assistante de Manager", icon: "support_agent" }, { title: "Secrétaire de Direction", icon: "business_center" }],
    requiredDiplomas: [{ name: "BAC G1 / A / B", icon: "format_list_bulleted" }]
  },

  // --- ENEAM Standalone ---
  {
    id: 'eneam-stat-eco',
    name: "Statistique Économique",
    universityId: 'eneam-standalone',
    universityName: "ENEAM",
    facultyName: "Département Statistique",
    domain: "Économie",
    level: 'Licence',
    duration: '3 Ans',
    fees: '150.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=400',
    careerProspects: [{ title: "Statisticien", icon: "analytics" }, { title: "Analyste Économique", icon: "show_chart" }],
    requiredDiplomas: [{ name: "BAC C / G2", icon: "functions" }]
  },
  {
    id: 'eneam-compt-ges',
    name: "Comptabilité & Gestion",
    universityId: 'eneam-standalone',
    universityName: "ENEAM",
    facultyName: "Département Gestion",
    domain: "Gestion",
    level: 'Licence',
    duration: '3 Ans',
    fees: '150.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400',
    careerProspects: [{ title: "Comptable", icon: "account_balance_wallet" }, { title: "Gestionnaire", icon: "payments" }],
    requiredDiplomas: [{ name: "BAC G2 / C / D", icon: "calculate" }]
  },

  // --- UAK (Kétou) ---
  {
    id: 'uak-agro-equip',
    name: "Génie Rural & Agro-équipement",
    universityId: 'uak',
    universityName: "UAK",
    facultyName: 'ENAT',
    domain: 'Agriculture',
    level: 'Licence',
    duration: '3 Ans',
    fees: '185.000 FCFA',
    location: 'Kétou',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=400',
    careerProspects: [{ title: "Concepteur de machines agricoles", icon: "agriculture" }, { title: "Technicien Irrigation", icon: "water" }],
    requiredDiplomas: [{ name: "BAC D / C / E", icon: "settings" }]
  },
  {
    id: 'uak-biotech-veg',
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
    careerProspects: [{ title: "Améliorateur de semences", icon: "potted_plant" }, { title: "Chercheur en Bio-tech", icon: "biotechnology" }],
    requiredDiplomas: [{ name: "Licence Agronomie", icon: "history_edu" }]
  }
];
