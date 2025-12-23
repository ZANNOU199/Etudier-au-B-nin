
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../CMSContext';

interface SchoolDisplay {
  id: string;
  name: string;
  parentName: string;
  parentId: string;
  parentStatus: 'Public' | 'Privé';
  type: string;
  isStandalone: boolean;
  location: string;
  cities?: string[];
  levels: string[];
}

const ITEMS_PER_PAGE = 6;

const Schools: React.FC = () => {
  const { universities } = useCMS();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const allSchools = useMemo(() => {
    let list: SchoolDisplay[] = [];
    
    universities.forEach(uni => {
      if (uni.isStandaloneSchool) {
        list.push({
          id: uni.id,
          name: uni.acronym,
          parentName: uni.name,
          parentId: uni.id,
          parentStatus: uni.type,
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
            parentStatus: uni.type,
            type: fac.type || 'Etablissement',
            isStandalone: false,
            location: uni.location,
            levels: fac.levels
          });
        });
      }
    });
    
    return list;
  }, [universities]);

  const filtered = useMemo(() => {
    return allSchools.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                            s.parentName.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = filterType === 'All' || 
                          (filterType === 'Standalone' && s.isStandalone) ||
                          (filterType === 'Affiliated' && !s.isStandalone);
      
      const matchesStatus = filterStatus === 'All' || s.parentStatus === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allSchools, search, filterType, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pagedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col w-full min-h-screen font-display bg-[#f8faf9] dark:bg-background-dark">
      <div className="bg-background-dark py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Écoles & Instituts spécialisés
            </h1>
          </div>
          
          <div className="max-w-3xl mx-auto relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-2xl">search</span>
            <input 
              type="text"
              placeholder="Rechercher une école..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white/10 border-white/10 text-white pl-16 pr-6 py-6 rounded-[32px] focus:ring-4 focus:ring-primary/20 outline-none backdrop-blur-md font-bold text-lg transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-12 flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pagedData.map((school) => (
              <div key={school.id} className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative">
                <div className={`h-1.5 w-full ${school.parentStatus === 'Public' ? 'bg-primary' : 'bg-amber-400'}`}></div>
                <div className="p-8 md:p-10 space-y-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-[#0f1a13] dark:text-white leading-tight group-hover:text-primary transition-colors">
                    {school.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-bold">{school.parentName}</p>
                </div>
                <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800">
                  <Link to={`/majors?search=${school.name}`} className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-primary">
                    Voir les filières
                    <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schools;
