
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UNIVERSITIES } from '../constants';

interface SchoolDisplay {
  id: string;
  name: string;
  parentName: string;
  parentId: string;
  type: string;
  isStandalone: boolean;
  location: string;
  cities?: string[];
  levels: string[];
}

const ITEMS_PER_PAGE = 6;

const Schools: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const allSchools = useMemo(() => {
    let list: SchoolDisplay[] = [];
    
    UNIVERSITIES.forEach(uni => {
      if (uni.isStandaloneSchool) {
        list.push({
          id: uni.id,
          name: uni.acronym,
          parentName: uni.name,
          parentId: uni.id,
          type: 'Ecole de Management',
          isStandalone: true,
          location: uni.location,
          cities: uni.cities,
          levels: Array.from(new Set(uni.faculties.flatMap(f => f.levels)))
        });
      } else {
        uni.faculties.forEach(fac => {
          list.push({
            id: fac.id,
            name: fac.name,
            parentName: uni.name,
            parentId: uni.id,
            type: fac.type || 'Etablissement',
            isStandalone: false,
            location: uni.location,
            levels: fac.levels
          });
        });
      }
    });
    
    return list;
  }, []);

  const filtered = useMemo(() => {
    return allSchools.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                            s.parentName.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'All' || 
                          (filterType === 'Standalone' && s.isStandalone) ||
                          (filterType === 'Affiliated' && !s.isStandalone);
      return matchesSearch && matchesType;
    });
  }, [allSchools, search, filterType]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pagedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="bg-background-dark py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Écoles & Instituts de Formation
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">
            Découvrez toutes les écoles du Bénin, qu'elles soient autonomes ou rattachées à une grande université.
          </p>
          
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 mt-8">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                type="text"
                placeholder="Rechercher une école (ex: EPAC, HECM...)"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white/10 border-white/20 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary outline-none backdrop-blur-md font-medium"
              />
            </div>
            <select 
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="bg-white/10 border-white/20 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary outline-none backdrop-blur-md font-bold"
            >
              <option value="All" className="text-black">Tous les types</option>
              <option value="Standalone" className="text-black">Écoles Autonomes</option>
              <option value="Affiliated" className="text-black">Écoles Rattachées</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pagedData.map((school) => (
            <div key={school.id} className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="p-8 space-y-4 flex-1">
                <div className="flex justify-between items-start">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${school.isStandalone ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                    {school.isStandalone ? 'Établissement Autonome' : 'Membre d\'Université'}
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#0f1a13] dark:text-white leading-tight group-hover:text-primary transition-colors">
                  {school.name}
                </h3>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">account_balance</span>
                    {school.isStandalone ? 'Siège social' : 'Rattaché à'} : {school.parentName}
                  </p>
                  <p className="text-sm text-gray-400 flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                    {school.location}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {school.levels.slice(0, 3).map(level => (
                    <span key={level} className="text-[9px] font-black bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 px-2 py-1 rounded-lg text-gray-500 uppercase tracking-widest">{level}</span>
                  ))}
                  {school.levels.length > 3 && <span className="text-[9px] font-black text-primary uppercase pt-1">+{school.levels.length - 3}</span>}
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800">
                <Link 
                  to="/majors" 
                  className="w-full flex items-center justify-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Découvrir les filières
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="size-12 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-800 disabled:opacity-30 hover:border-primary transition-all text-gray-400"
            >
              <span className="material-symbols-outlined font-bold">chevron_left</span>
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`size-12 rounded-2xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-primary text-black' : 'bg-white dark:bg-surface-dark dark:text-white border border-gray-100 dark:border-gray-800 hover:border-primary'}`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="size-12 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-800 disabled:opacity-30 hover:border-primary transition-all text-gray-400"
            >
              <span className="material-symbols-outlined font-bold">chevron_right</span>
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-800">
             <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">school</span>
             <h3 className="text-xl font-bold dark:text-white">Aucune école trouvée</h3>
             <p className="text-gray-500">Essayez d'autres mots-clés ou filtres.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schools;
