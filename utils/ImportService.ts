
import { University, Major, Faculty } from '../types';

interface ImportResult {
  uniCount: number;
  majorCount: number;
}

// Fix: Updated signature to match API-based functions from CMSContext.
export const processAcademicCSV = async (
  file: File,
  currentUniversities: University[],
  addUniversity: (formData: FormData) => Promise<any>,
  updateUniversity: (id: string, data: any) => Promise<void>,
  addMajor: (major: any) => Promise<void>
): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // Fix: Made the onload handler async to handle API calls with await.
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

        // Fix: Use for...of loop for proper async/await handling.
        for (const line of lines.slice(1)) {
          const rowData = line.split(delimiter);
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
            // Fix: Create FormData for the API call.
            const apiPayload = new FormData();
            apiPayload.append('name', row.nom_inst || row.sigle_inst);
            apiPayload.append('acronym', row.sigle_inst);
            apiPayload.append('city', row.ville || 'Bénin');
            apiPayload.append('type', row.statut_inst === 'Privé' ? 'privé' : 'public');
            apiPayload.append('is_standalone', row.type_inst?.toUpperCase() === 'E' ? '1' : '0');

            const result = await addUniversity(apiPayload);
            // Fix: Extract the new ID from the API result.
            const newId = (result?.id || result?.data?.id || result?.university?.id || result?.institution?.id)?.toString();
            
            if (!newId) continue; // Safety check

            uni = {
              id: newId,
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
            // Fix: Use the correct API parameters for updateUniversity.
            await updateUniversity(uni.id, { faculties: uni.faculties });
          }

          // 3. CRÉATION DE LA FILIÈRE (MAJOR)
          // Fix: Preparation of the payload for the addMajor API call.
          await addMajor({
            university_id: parseInt(uni.id),
            faculty_id: fac.id.startsWith('fac-') ? null : parseInt(fac.id), // Only send real IDs
            name: row.nom_filiere,
            domain: row.domaine || 'Général',
            level: (['Licence', 'Master', 'Doctorat'].includes(row.cycle) ? row.cycle : 'Licence') as any,
            duration: row.duree || '3 Ans',
            fees: row.frais || 'N/A',
            location: uni.location,
            career_prospects: row.debouches ? row.debouches.split('|').map((d: string) => d.trim()) : [],
            required_diplomas: row.diplome_requis ? row.diplome_requis.split('|').map((d: string) => d.trim()) : []
          });

          majorCount++;
        }

        resolve({ uniCount, majorCount });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier."));
    reader.readAsText(file);
  });
};
