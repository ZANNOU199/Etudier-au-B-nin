
import { University, Major, Faculty } from '../types';

interface ImportResult {
  uniCount: number;
  majorCount: number;
}

// Updated processAcademicCSV to match CMSContext signatures and handle FormData
export const processAcademicCSV = async (
  file: File,
  currentUniversities: University[],
  addUniversity: (formData: FormData) => Promise<any>,
  updateUniversity: (id: string, uni: any) => Promise<void>,
  addMajor: (major: any) => Promise<void>
): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) throw new Error("Le fichier CSV est vide.");

        const firstLine = lines[0];
        // Détection automatique du séparateur (virgule ou point-virgule)
        const delimiter = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';
        const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase());
        
        let uniCount = 0;
        let majorCount = 0;
        
        // On travaille sur une copie locale pour éviter les collisions pendant l'import
        const tempUnis = [...currentUniversities];

        for (let i = 1; i < lines.length; i++) {
          const rowData = lines[i].split(delimiter);
          if (rowData.length < headers.length) continue;

          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = rowData[index]?.trim();
          });

          // Validation minimale : il faut au moins un sigle d'institution et un nom de filière
          if (!row.sigle_inst || !row.nom_filiere) continue;

          // 1. GESTION DE L'ÉTABLISSEMENT (Université ou École)
          let uni = tempUnis.find(u => u.acronym.toLowerCase() === row.sigle_inst.toLowerCase());
          
          if (!uni) {
            uni = {
              id: 'uni-' + Math.random().toString(36).substr(2, 9),
              name: row.nom_inst || row.sigle_inst,
              acronym: row.sigle_inst,
              location: row.ville || 'Bénin',
              type: row.statut_inst === 'Privé' ? 'Privé' : 'Public',
              description: row.description_inst || "Établissement importé.",
              isStandaloneSchool: row.type_inst?.toUpperCase() === 'E',
              logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100', // Logo par défaut
              cover: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
              stats: { students: 'N/A', majors: 0, founded: '2024', ranking: 'N/A' },
              faculties: []
            };
            
            // Construct FormData for the API call
            const fd = new FormData();
            fd.append('name', uni.name);
            fd.append('acronym', uni.acronym);
            fd.append('city', uni.location);
            fd.append('type', uni.type.toLowerCase());
            fd.append('is_standalone', uni.isStandaloneSchool ? '1' : '0');
            
            await addUniversity(fd);
            tempUnis.push(uni);
            uniCount++;
          }

          // 2. GESTION DE LA FACULTÉ / COMPOSANTE
          const facName = row.nom_faculte || 'Général';
          let fac = uni.faculties.find(f => f.name.toLowerCase() === facName.toLowerCase());
          
          if (!fac) {
            fac = {
              id: 'fac-' + Math.random().toString(36).substr(2, 5),
              name: facName,
              description: 'Composante académique',
              levels: [row.cycle || 'Licence'],
              type: uni.isStandaloneSchool ? 'Ecole' : 'Faculté'
            };
            uni.faculties.push(fac);
            // Updated to match async (id, data) signature
            await updateUniversity(uni.id, uni);
          }

          // 3. CRÉATION DE LA FILIÈRE (MAJOR)
          const major: Major = {
            id: 'maj-' + Math.random().toString(36).substr(2, 9),
            name: row.nom_filiere,
            universityId: uni.id,
            universityName: uni.acronym,
            facultyName: fac.name,
            domain: row.domaine || 'Général',
            level: (['Licence', 'Master', 'Doctorat'].includes(row.cycle) ? row.cycle : 'Licence') as any,
            duration: row.duree || '3 Ans',
            fees: row.frais || 'N/A',
            location: uni.location,
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
            careerProspects: row.debouches ? row.debouches.split('|').map((d: string) => ({ title: d.trim(), icon: 'work' })) : [],
            requiredDiplomas: row.diplome_requis ? row.diplome_requis.split('|').map((d: string) => ({ name: d.trim(), icon: 'school' })) : []
          };

          // Await major addition
          await addMajor(major);
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
