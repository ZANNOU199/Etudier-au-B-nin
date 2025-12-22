
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UNIVERSITIES } from '../constants';

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
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
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
  }, []);

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
      {/* Search Header */}
      <div className="bg-background-dark py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Écoles & Instituts spécialisés
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Explorez les établissements d'excellence, publics ou privés, pour une formation de pointe.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-2xl">search</span>
            <input 
              type="text"
              placeholder="Rechercher une école, un institut (ex: EPAC, ENEAM...)"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white/10 border-white/10 text-white pl-16 pr-6 py-6 rounded-[32px] focus:ring-4 focus:ring-primary/20 outline-none backdrop-blur-md font-bold text-lg transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 space-y-8 shrink-0">
          {/* Status Filter */}
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm font-bold">verified</span>
              Statut
            </h3>
            <div className="flex flex-col gap-3">
              {['All', 'Public', 'Privé'].map(status => (
                <button
                  key={status}
                  onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                    filterStatus === status 
                    ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10 scale-[1.02]' 
                    : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  {status === 'All' ? 'Tout' : status}
                  {filterStatus === status && <span className="material-symbols-outlined text-sm font-bold">check_circle</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm font-bold">account_balance</span>
              Type
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { id: 'All', label: 'Tout' },
                { id: 'Standalone', label: 'Autonome' },
                { id: 'Affiliated', label: 'Rattaché' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => { setFilterType(type.id); setCurrentPage(1); }}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                    filterType === type.id 
                    ? 'bg-black dark:bg-primary text-white dark:text-black border-black dark:border-primary shadow-lg scale-[1.02]' 
                    : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  {type.label}
                  {filterType === type.id && <span className="material-symbols-outlined text-sm font-bold">check_circle</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Content */}
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black dark:text-white tracking-tight">
              {filtered.length} Établissement(s) <span className="text-gray-400 text-lg">disponible(s)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pagedData.map((school) => (
              <div key={school.id} className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative">
                {/* Visual indicator bar */}
                <div className={`h-1.5 w-full ${school.parentStatus === 'Public' ? 'bg-primary' : 'bg-amber-400'}`}></div>
                
                <div className="p-8 md:p-10 space-y-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                      school.parentStatus === 'Public' 
                      ? 'bg-primary/10 text-primary-dark border-primary/20' 
                      : 'bg-amber-400/10 text-amber-600 border-amber-400/20'
                    }`}>
                      {school.parentStatus}
                    </span>
                    <span className="px-4 py-1.5 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-gray-100 dark:border-gray-800">
                      {school.isStandalone ? 'Autonome' : 'Affilié'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-[#0f1a13] dark:text-white leading-tight group-hover:text-primary transition-colors">
                      {school.name}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-500 font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-gray-300">location_city</span>
                        {school.isStandalone ? 'Siège' : 'Membre de'} : {school.parentName}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-2 font-medium">
                        <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                        {school.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 mt-auto">
                    {school.levels.map(level => (
                      <span key={level} className="text-[9px] font-black bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 px-3 py-1.5 rounded-xl text-gray-500 uppercase tracking-widest transition-colors group-hover:border-primary/30 group-hover:text-primary">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center group/btn">
                  <Link 
                    to={`/majors?search=${school.name}`} 
                    className="text-[10px] font-black text-[#0f1a13] dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    Voir les filières
                    <span className="material-symbols-outlined text-sm font-bold group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                  <div className="size-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-xs">info</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-12">
              <button 
                onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo(0, 300); }}
                disabled={currentPage === 1}
                className="size-14 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-800 disabled:opacity-30 hover:border-primary hover:text-primary transition-all text-gray-400"
              >
                <span className="material-symbols-outlined font-bold">west</span>
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 300); }}
                    className={`size-14 rounded-2xl font-black text-sm transition-all border ${
                      currentPage === i + 1 
                      ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' 
                      : 'bg-white dark:bg-surface-dark dark:text-white border-gray-100 dark:border-gray-800 hover:border-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo(0, 300); }}
                disabled={currentPage === totalPages}
                className="size-14 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-800 disabled:opacity-30 hover:border-primary hover:text-primary transition-all text-gray-400"
              >
                <span className="material-symbols-outlined font-bold">east</span>
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-24 bg-white dark:bg-surface-dark rounded-[48px] border-2 border-dashed border-gray-100 dark:border-gray-800">
               <div className="size-24 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
                 <span className="material-symbols-outlined text-5xl text-gray-300">school</span>
               </div>
               <h3 className="text-2xl font-black dark:text-white tracking-tight">Aucun établissement trouvé</h3>
               <p className="text-gray-500 mt-2 max-w-xs mx-auto">Essayez d'ajuster vos filtres ou de modifier votre recherche.</p>
               <button 
                onClick={() => { setSearch(''); setFilterType('All'); setFilterStatus('All'); }}
                className="mt-8 px-8 py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[10px]"
               >
                 Réinitialiser tout
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schools;
