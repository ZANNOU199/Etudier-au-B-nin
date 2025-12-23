
import { University, Major, Faculty } from '../types';

interface ImportResult {
  uniCount: number;
  majorCount: number;
}

export const processAcademicCSV = async (
  file: File,
  currentUniversities: University[],
  addUniversity: (u: University) => void,
  updateUniversity: (u: University) => void,
  addMajor: (m: Major) => void
): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) throw new Error("Fichier vide ou corrompu.");

        const firstLine = lines[0];
        const delimiter = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';
        const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase());
        
        let uniCount = 0;
        let majorCount = 0;
        const tempUnis = [...currentUniversities];

        for (let i = 1; i < lines.length; i++) {
          const rowData = lines[i].split(delimiter);
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = rowData[index]?.trim();
          });

          if (!row.sigle_inst || !row.nom_filiere) continue;

          // 1. Université/École
          let uni = tempUnis.find(u => u.acronym.toLowerCase() === row.sigle_inst.toLowerCase());
          if (!uni) {
            uni = {
              id: 'uni-' + Math.random().toString(36).substr(2, 9),
              name: row.nom_inst || row.sigle_inst,
              acronym: row.sigle_inst,
              location: row.ville || 'Bénin',
              type: row.statut_inst?.toLowerCase().includes('priv') ? 'Privé' : 'Public',
              isStandaloneSchool: row.type_inst?.toUpperCase() === 'E',
              logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100',
              cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
              description: "Établissement importé via Super Console.",
              stats: { students: 'N/A', majors: 0, founded: '2024', ranking: 'N/A' },
              faculties: []
            };
            addUniversity(uni);
            tempUnis.push(uni);
            uniCount++;
          }

          // 2. Faculté
          const facName = row.nom_faculte || 'Général';
          let fac = uni.faculties.find(f => f.name.toLowerCase() === facName.toLowerCase());
          if (!fac) {
            fac = {
              id: 'fac-' + Math.random().toString(36).substr(2, 5),
              name: facName,
              description: 'Département académique',
              levels: [row.cycle || 'Licence']
            };
            uni.faculties.push(fac);
            updateUniversity(uni);
          }

          // 3. Filière
          const major: Major = {
            id: 'maj-' + Math.random().toString(36).substr(2, 9),
            name: row.nom_filiere,
            universityId: uni.id,
            universityName: uni.acronym,
            facultyName: fac.name,
            domain: row.domaine || 'Académique',
            level: (['Licence', 'Master', 'Doctorat'].includes(row.cycle) ? row.cycle : 'Licence') as any,
            duration: row.duree || '3 Ans',
            fees: row.frais || 'N/A',
            location: uni.location,
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
            careerProspects: row.debouche ? row.debouche.split('|').map((d: string) => ({ title: d.trim(), icon: 'work' })) : [],
            requiredDiplomas: row.diplome ? row.diplome.split('|').map((d: string) => ({ name: d.trim(), icon: 'school' })) : []
          };
          addMajor(major);
          majorCount++;
        }
        resolve({ uniCount, majorCount });
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
