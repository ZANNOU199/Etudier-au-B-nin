
import { University, Major } from './types';

export const UNIVERSITIES: University[] = [
  {
    id: 'uni-hecm',
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
    id: 'uni-adonai',
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
  }
];

export const MAJORS: Major[] = [
  {
    id: 'maj-hecm-mkt',
    name: "Marketing & Communication",
    universityId: 'uni-hecm',
    universityName: "HECM",
    facultyName: "Management",
    domain: "Marketing",
    level: 'Licence',
    duration: '3 Ans',
    fees: '385.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400',
    careerProspects: [{ title: "Responsable Com", icon: "campaign" }],
    requiredDiplomas: [{ name: "BAC Toutes séries", icon: "school" }]
  },
  {
    id: 'maj-hecm-rh',
    name: "Management des RH",
    universityId: 'uni-hecm',
    universityName: "HECM",
    facultyName: "Gestion",
    domain: "Ressources Humaines",
    level: 'Licence',
    duration: '3 Ans',
    fees: '385.000 FCFA',
    location: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400',
    careerProspects: [{ title: "Gestionnaire RH", icon: "badge" }],
    requiredDiplomas: [{ name: "BAC G2/G3/B/D", icon: "school" }]
  }
];
