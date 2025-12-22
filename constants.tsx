
import { University, Major } from './types';

export const UNIVERSITIES: University[] = [
  {
    id: 'uac',
    name: "Université d'Abomey-Calavi",
    acronym: 'UAC',
    location: 'Abomey-Calavi',
    type: 'Public',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9Jq16x5otnHyg7E7WMhdIr94N7IRHAwgcmunLNJLwtB1tVQuzQqzuKsBk9iHokxmIvZ19YdTP5MYWQAHFoFWK9wyfvS0AcnUkDnmXZomqZh5ZFwv73swAWO1KgDVpRQ1Jiu4aSX3cXtUEutOGwjv5CZ1qVjhd_EAd-M2fzOfyolBf0p3wApTYzRPhFhLN6P6wRtFGUTnEHPmHDcXIqdOWiWI1H9w3dSEQe4mLEGj2TYlGvBtIUBxPZNnr8Lt2Ot8q-9goX3UZlDI',
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
    description: "Plus grande université du Bénin, pôle d'excellence multidisciplinaire.",
    stats: {
      students: '85,000+',
      majors: 150,
      founded: '1970',
      ranking: '1er National'
    },
    faculties: [
      { id: 'epac', name: "École Polytechnique d'Abomey-Calavi", description: 'Ingénierie, BTP, Informatique', levels: ['Licence', 'Master'], type: 'Ecole' },
      { id: 'eneam', name: "École Nationale d'Économie Appliquée et de Management", description: 'Statistiques, Gestion, Audit', levels: ['Licence', 'Master'], type: 'Ecole' },
      { id: 'enam', name: "École Nationale d'Administration", description: 'Diplomatie, Administration Publique', levels: ['Licence', 'Master'], type: 'Ecole' },
      { id: 'fss-uac', name: "Faculté des Sciences de la Santé", description: 'Médecine, Pharmacie, Odontologie', levels: ['Doctorat', 'Master'], type: 'Faculté' }
    ]
  },
  {
    id: 'up',
    name: "Université de Parakou",
    acronym: 'UP',
    location: 'Parakou',
    type: 'Public',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCknZn8XkyXEITg_nT5NbXBiZEy1lS_LdFqTMxCpIV56x_N53gpHglSfJnes4D0VLYgB9AZNQQlDS3OM6ZR_irU8kZ6OSYjE8FTHV4eI-U1SRT2xHKWv0gK2EZvQG_Vg7U5ktqFu9JhD3rQ3-XQIMySF4dDsS1hMqNQ4q4tITzVp0DX5Z8Q247T8VhLWjN8lxFyudTCv-_BAk2IYYbHCGL5W8rV-AFH2fUwA7ZZwbUafdW_paPoLTLo9sRjKyTj-yebbSb-G_hm7uY',
    cover: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: "Deuxième pôle universitaire, leader en Agronomie et Médecine Tropicale.",
    stats: {
      students: '30,000+',
      majors: 85,
      founded: '2001',
      ranking: '2ème National'
    },
    faculties: [
      { id: 'fsa-up', name: "Faculté des Sciences Agronomiques", description: 'Élevage, Production végétale', levels: ['Licence', 'Master', 'Doctorat'], type: 'Faculté' },
      { id: 'fdsp-up', name: "Faculté de Droit et de Science Politique", description: 'Droit privé, Droit public', levels: ['Licence', 'Master'], type: 'Faculté' }
    ]
  },
  {
    id: 'unstim',
    name: "Université des Sciences, Technologies, Ingénierie et Mathématiques",
    acronym: 'UNSTIM',
    location: 'Abomey',
    type: 'Public',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200',
    description: "Spécialisée dans les sciences dures et les nouvelles technologies.",
    stats: {
      students: '12,000+',
      majors: 45,
      founded: '2016',
      ranking: 'Top Innovation'
    },
    faculties: [
      { id: 'insti', name: "Institut National Supérieur de Technologie Industrielle", description: 'Maintenance, Électricité', levels: ['Licence'], type: 'Institut' },
      { id: 'ifri', name: "Institut de Formation et de Recherche en Informatique", description: 'Cybersécurité, IA', levels: ['Licence', 'Master'], type: 'Institut' }
    ]
  },
  {
    id: 'una',
    name: "Université Nationale d'Agriculture",
    acronym: 'UNA',
    location: 'Porto-Novo',
    type: 'Public',
    logo: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    description: "Établissement thématique dédié à la souveraineté alimentaire.",
    stats: {
      students: '8,000+',
      majors: 30,
      founded: '2016',
      ranking: 'Leader Agrotech'
    },
    faculties: [
      { id: 'ensta', name: "École Nationale Supérieure des Sciences et Techniques Agronomiques", description: 'Production Animale', levels: ['Licence', 'Master'], type: 'Ecole' }
    ]
  },
  {
    id: 'hecm',
    name: "Hautes Études Commerciales et de Management",
    acronym: 'HECM',
    location: 'Cotonou',
    type: 'Privé',
    isStandaloneSchool: true,
    cities: ['Cotonou', 'Porto-Novo', 'Parakou', 'Bohicon'],
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    description: "Leader de l'enseignement privé, certifié ISO 9001.",
    stats: {
      students: '15,000+',
      majors: 25,
      founded: '1999',
      ranking: '1er Privé'
    },
    faculties: [
      { id: 'hecm-gest', name: 'Département Gestion & Finance', description: 'Comptabilité, Banque', levels: ['Licence', 'Master'], type: 'Ecole' },
      { id: 'hecm-tech', name: 'Département Technologies', description: 'Réseaux, Programmation', levels: ['Licence'], type: 'Ecole' }
    ]
  },
  {
    id: 'ism-adonai',
    name: "Institut Supérieur de Management Adonaï",
    acronym: 'ISM ADONAI',
    location: 'Cotonou',
    type: 'Privé',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=1200',
    description: "Expertise reconnue en Audit et Expertise Comptable.",
    stats: {
      students: '5,000+',
      majors: 18,
      founded: '2005',
      ranking: 'Top Management'
    },
    faculties: [
      { id: 'ism-compta', name: 'Pôle Expertise Comptable', description: 'Audit et Contrôle', levels: ['Licence', 'Master'], type: 'Ecole' }
    ]
  }
];

export const MAJORS: Major[] = [
  // --- UAC ---
  {
    id: 'uac-gl',
    name: "Génie Logiciel & Systèmes",
    universityId: 'uac',
    universityName: "UAC (EPAC)",
    facultyName: 'EPAC',
    domain: 'Informatique',
    level: 'Licence',
    duration: '3 Ans',
    fees: '450.000 FCFA',
    location: 'Abomey-Calavi',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Développeur Full-Stack", icon: "code" },
      { title: "Architecte Logiciel", icon: "architecture" },
      { title: "Ingénieur DevOps", icon: "cloud_done" },
      { title: "Consultant IT", icon: "terminal" }
    ],
    requiredDiplomas: [
      { name: "BAC C / D / E", icon: "function" }
    ]
  },
  {
    id: 'uac-eneam-stat',
    name: "Statistique Économique",
    universityId: 'uac',
    universityName: "UAC (ENEAM)",
    facultyName: 'ENEAM',
    domain: 'Économie',
    level: 'Licence',
    duration: '3 Ans',
    fees: '400.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1551288049-bbda38656ad1?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Data Analyst", icon: "analytics" },
      { title: "Chargé d'études économiques", icon: "trending_up" },
      { title: "Statisticien public", icon: "bar_chart" }
    ],
    requiredDiplomas: [
      { name: "BAC C / D / G2", icon: "calculate" }
    ]
  },
  {
    id: 'uac-enam-dipl',
    name: "Diplomatie et Relations Internationales",
    universityId: 'uac',
    universityName: "UAC (ENAM)",
    facultyName: 'ENAM',
    domain: 'Administration',
    level: 'Licence',
    duration: '3 Ans',
    fees: '350.000 FCFA',
    location: 'Abomey-Calavi',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2959d43?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Attaché d'ambassade", icon: "public" },
      { title: "Chargé de mission ONG", icon: "groups" },
      { title: "Analyste géopolitique", icon: "language" }
    ],
    requiredDiplomas: [
      { name: "BAC A / B / C / D", icon: "history_edu" }
    ]
  },

  // --- UP ---
  {
    id: 'up-medecine',
    name: "Médecine Générale",
    universityId: 'up',
    universityName: "Université de Parakou",
    facultyName: 'Faculté de Médecine',
    domain: 'Santé',
    level: 'Doctorat',
    duration: '8 Ans',
    fees: 'Subventionné (État)',
    location: 'Parakou',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Médecin Généraliste", icon: "medical_services" },
      { title: "Chercheur en santé", icon: "biotechnology" },
      { title: "Médecin Humanitaire", icon: "volunteer_activism" }
    ],
    requiredDiplomas: [
      { name: "BAC C / D (Excellent dossier)", icon: "science" }
    ]
  },
  {
    id: 'up-agronomie',
    name: "Agronomie et Production Végétale",
    universityId: 'up',
    universityName: "Université de Parakou",
    facultyName: 'FSA',
    domain: 'Agriculture',
    level: 'Licence',
    duration: '3 Ans',
    fees: '185.000 FCFA',
    location: 'Parakou',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Ingénieur Agronome", icon: "agriculture" },
      { title: "Conseiller technique rural", icon: "psychology" },
      { title: "Chef d'exploitation agricole", icon: "compost" }
    ],
    requiredDiplomas: [
      { name: "BAC D / C / DEAT", icon: "park" }
    ]
  },

  // --- UNSTIM ---
  {
    id: 'unstim-energies',
    name: "Énergies Renouvelables et Efficacité",
    universityId: 'unstim',
    universityName: "UNSTIM Abomey",
    facultyName: 'INSTI',
    domain: 'Énergie',
    level: 'Licence',
    duration: '3 Ans',
    fees: '450.000 FCFA',
    location: 'Abomey',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Installateur Photovoltaïque", icon: "wb_sunny" },
      { title: "Expert en audit énergétique", icon: "bolt" },
      { title: "Responsable maintenance éolien", icon: "wind_power" }
    ],
    requiredDiplomas: [
      { name: "BAC C / D / E / F3", icon: "electric_bolt" }
    ]
  },

  // --- PRIVÉ (HECM / ISM) ---
  {
    id: 'hecm-mark',
    name: "Marketing et Action Commerciale",
    universityId: 'hecm',
    universityName: "HECM Cotonou",
    facultyName: "Management",
    domain: "Gestion",
    level: 'Licence',
    duration: '3 Ans',
    fees: '385.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Responsable Marketing", icon: "campaign" },
      { title: "Directeur Commercial", icon: "handshake" },
      { title: "Chef de produit", icon: "shopping_bag" }
    ],
    requiredDiplomas: [
      { name: "BAC Toutes séries", icon: "school" }
    ]
  },
  {
    id: 'ism-audit',
    name: "Audit et Contrôle de Gestion",
    universityId: 'ism-adonai',
    universityName: "ISM Adonaï",
    facultyName: "Expertise Comptable",
    domain: "Finances",
    level: 'Master',
    duration: '2 Ans',
    fees: '650.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Auditeur Interne/Externe", icon: "search_check" },
      { title: "Contrôleur de gestion", icon: "account_balance" },
      { title: "Expert-Comptable Stagiaire", icon: "calculate" }
    ],
    requiredDiplomas: [
      { name: "Licence en Gestion / Finance", icon: "workspace_premium" }
    ]
  }
];
