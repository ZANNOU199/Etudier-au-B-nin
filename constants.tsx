
import { University, Major } from './types';

export const UNIVERSITIES: University[] = [
  {
    id: 'uni-aa',
    name: "AAAA",
    acronym: "AA",
    location: "BNBBN",
    type: "Public",
    isStandaloneSchool: true,
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100',
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
    description: "Établissement académique de référence.",
    stats: { students: '1,200', majors: 5, founded: '2024', ranking: 'N/A' },
    faculties: []
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
  }
];

export const MAJORS: Major[] = [
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
  }
];
