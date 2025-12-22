
import { University, Major } from './types';

export const UNIVERSITIES: University[] = [
  {
    id: 'uac',
    name: "Université d'Abomey-Calavi",
    acronym: 'UAC',
    location: 'Abomey-Calavi',
    type: 'Public',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9Jq16x5otnHyg7E7WMhdIr94N7IRHAwgcmunLNJLwtB1tVQuzQqzuKsBk9iHokxmIvZ19YdTP5MYWQAHFoFWK9wyfvS0AcnUkDnmXZomqZh5ZFwv73swAWO1KgDVpRQ1Jiu4aSX3cXtUEutOGwjv5CZ1qVjhd_EAd-M2fzOfyolBf0p3wApTYzRPhFhLN6P6wRtFGUTnEHPmHDcXIqdOWiWI1H9w3dSEQe4mLEGj2TYlGvBtIUBxPZNnr8Lt2Ot8q-9goX3UZlDI',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZmsqbdmT1-GiLvLmQynonHrIXvP_1Fo_tJd93hxZNGGjeTQ4LkQ9PfeppAQoCbwcy7Y0NEDzJ2a2KLlHuHChSq9xpxB50rSaeZJ5PZCwpdXEY0AWzqiw83HpOhy6pHLdKufQx_J6zhe44pDeHEfJTj5kyy_aO3qkfAdzZrdAEgUnzjF6h-49AstPUzkMJCxX59E0q80Vj26D54EOpZZJxkf-KSAb21KEQ7oTinUEAJw6EaYXdKEqmH-nogFisoAlm2JIE2CcDnwc',
    description: "L'institution de référence au Bénin offrant une vaste gamme de programmes académiques en ingénierie et sciences sociales.",
    stats: {
      students: '85,000+',
      majors: 120,
      founded: '1970',
      ranking: '1er National'
    },
    faculties: [
      { id: 'epac', name: "École Polytechnique d'Abomey-Calavi", description: 'Ingénierie de pointe', levels: ['Licence', 'Master'], type: 'Ecole' },
      { id: 'faseg', name: 'Sciences Économiques et de Gestion', description: 'Économie et Marketing', levels: ['Licence', 'Master'], type: 'Faculté' },
      { id: 'fast', name: 'Faculté des Sciences et Techniques', description: 'Sciences fondamentales', levels: ['Licence', 'Master', 'Doctorat'], type: 'Faculté' }
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
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
    description: "Leader du management privé au Bénin, HECM forme les cadres de demain depuis plus de 20 ans.",
    stats: {
      students: '10,000+',
      majors: 25,
      founded: '1999',
      ranking: 'Top Privé'
    },
    faculties: [
      { id: 'hecm-gestion', name: 'Département Gestion', description: 'Comptabilité et Finance', levels: ['Licence', 'Master'], type: 'Ecole' },
      { id: 'hecm-com', name: 'Département Communication', description: 'Journalisme et RP', levels: ['Licence'], type: 'Ecole' }
    ]
  },
  {
    id: 'up',
    name: "Université de Parakou",
    acronym: 'UP',
    location: 'Parakou',
    type: 'Public',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCknZn8XkyXEITg_nT5NbXBiZEy1lS_LdFqTMxCpIV56x_N53gpHglSfJnes4D0VLYgB9AZNQQlDS3OM6ZR_irU8kZ6OSYjE8FTHV4eI-U1SRT2xHKWv0gK2EZvQG_Vg7U5ktqFu9JhD3rQ3-XQIMySF4dDsS1hMqNQ4q4tITzVp0DX5Z8Q247T8VhLWjN8lxFyudTCv-_BAk2IYYbHCGL5W8rV-AFH2fUwA7ZZwbUafdW_paPoLTLo9sRjKyTj-yebbSb-G_hm7uY',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC332atNzkbb9ZxboIn121iu9APUd3M8ZtkKNM8xTpaxs3Dki_g7etdzQul5kwtjsyCS1sKVvuBqPaXuf6ki3ikAby_cAxDOhnonB2jbD2o00R0hmvQuXoOiaUm5lMGzXDGZx_cUMddjXbZrf2GfsjgTH5Sz6pOEWWupiLt2zRaG6S7b5xZTsJerxeRIS1TcErz_9XRq0X57O3K2I2s4GMuzB60F0Pj-_V4-6r5cAPcmB33cf2f_BmRvBEmwdao7hMnnUekAwjBM70',
    description: "Reconnue pour son excellence en Agronomie et Médecine, l'UP est le pôle majeur du septentrion.",
    stats: {
      students: '25,000+',
      majors: 60,
      founded: '2001',
      ranking: '2ème National'
    },
    faculties: [
      { id: 'up-fsa', name: 'Faculté des Sciences Agronomiques', description: 'Agronomie et Elevage', levels: ['Licence', 'Master', 'Doctorat'], type: 'Faculté' },
      { id: 'up-fm', name: 'Faculté de Médecine', description: 'Santé humaine', levels: ['Doctorat'], type: 'Faculté' }
    ]
  }
];

export const MAJORS: Major[] = [
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
      { title: "Chef de Projet IT", icon: "assignment_ind" },
      { title: "Consultant Cybersécurité", icon: "security" },
      { title: "Expert en Data Science", icon: "analytics" }
    ],
    requiredDiplomas: [
      { name: "BAC C (Mathématiques & Physiques)", icon: "function" },
      { name: "BAC D (Sciences de la Vie)", icon: "biotechnology" },
      { name: "BAC E (Technique)", icon: "settings_suggest" },
      { name: "Diplôme Équivalent (Séries Scientifiques)", icon: "verified_user" }
    ]
  },
  {
    id: 'uac-gc',
    name: "Génie Civil",
    universityId: 'uac',
    universityName: "UAC (EPAC)",
    facultyName: 'EPAC',
    domain: 'Génie Civil',
    level: 'Licence',
    duration: '3 Ans',
    fees: '450.000 FCFA',
    location: 'Abomey-Calavi',
    image: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Ingénieur de Travaux", icon: "construction" },
      { title: "Conducteur de Travaux", icon: "engineering" },
      { title: "Bureau d'études", icon: "draw" },
      { title: "Responsable HSE", icon: "health_and_safety" }
    ],
    requiredDiplomas: [
      { name: "BAC C (Mathématiques & Physiques)", icon: "function" },
      { name: "BAC D (Sciences de la Vie)", icon: "biotechnology" },
      { name: "BAC F4 (Génie Civil)", icon: "foundation" }
    ]
  },
  {
    id: 'hecm-mark',
    name: "Marketing et Action Commerciale",
    universityId: 'hecm',
    universityName: "HECM Cotonou",
    facultyName: "Gestion",
    domain: "Gestion",
    level: 'Licence',
    duration: '3 Ans',
    fees: '385.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400',
    careerProspects: [
      { title: "Responsable Marketing", icon: "campaign" },
      { title: "Chef de Produit", icon: "inventory_2" },
      { title: "Commercial Senior", icon: "handshake" },
      { title: "Community Manager", icon: "public" }
    ],
    requiredDiplomas: [
      { name: "BAC G2 (Comptabilité/Gestion)", icon: "calculate" },
      { name: "BAC Toutes Séries", icon: "school" }
    ]
  }
];
