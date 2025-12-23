
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../CMSContext';

interface SchoolDisplay {
  id: string;
  name: string;
  parentName: string;
  parentAcronym: string;
  parentId: string;
  parentStatus: 'Public' | 'Privé';
  type: string;
  isStandalone: boolean;
  location: string;
  levels: string[];
}

const ITEMS_PER_PAGE = 4;

const Schools: React.FC = () => {
  const { universities } = useCMS();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Standalone' | 'Affiliated'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Public' | 'Privé'>('All');
  const [currentPage, setCurrentPage] = useState(1);

  const allSchools = useMemo(() => {
    let list: SchoolDisplay[] = [];
    
    universities.forEach(uni => {
      if (uni.isStandaloneSchool) {
        list.push({
          id: uni.id,
          name: uni.acronym,
          parentName: uni.name,
          parentAcronym: uni.acronym,
          parentId: uni.id,
          parentStatus: uni.type,
          type: 'École / Institut',
          isStandalone: true,
          location: uni.location,
          levels: Array.from(new Set(uni.faculties.flatMap(f => f.levels)))
        });
      } else {
        uni.faculties.forEach(fac => {
          list.push({
            id: fac.id,
            name: fac.name,
            parentName: uni.name,
            parentAcronym: uni.acronym,
            parentId: uni.id,
            parentStatus: uni.type,
            type: fac.type || 'Faculté / Institut',
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
      const query = search.toLowerCase().trim();
      
      // Recherche étendue : Nom, Sigle, Nom Parent ou Sigle Parent
      const matchesSearch = 
        s.name.toLowerCase().includes(query) || 
        s.parentName.toLowerCase().includes(query) ||
        s.parentAcronym.toLowerCase().includes(query);
      
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
      {/* Header avec Barre de Recherche Optimisée */}
      <div className="bg-background-dark py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] bg-primary/10 px-6 py-2 rounded-full border border-primary/20">Annuaire des Établissements</span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
              Écoles & Instituts <br /><span className="text-primary italic">spécialisés</span>
            </h1>
          </div>
          
          <div className="max-w-2xl mx-auto relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-2xl">search</span>
            <input 
              type="text"
              placeholder="Rechercher par Nom ou Sigle (ex: FASEG, UAC...)"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white/10 border-white/10 text-white pl-16 pr-6 py-6 rounded-[32px] focus:ring-4 focus:ring-primary/20 outline-none backdrop-blur-md font-bold text-lg transition-all placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 flex flex-col lg:flex-row gap-16">
        {/* Barre Latérale de Filtres */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-8">
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-premium space-y-10">
            {/* Filtre : Type d'Établissement */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">account_tree</span>
                Appartenance
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'All', label: 'Tout voir' },
                  { id: 'Standalone', label: 'Écoles autonomes' },
                  { id: 'Affiliated', label: 'Facultés affiliées' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setFilterType(t.id as any); setCurrentPage(1); }}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                      filterType === t.id 
                      ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10' 
                      : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                    }`}
                  >
                    {t.label}
                    {filterType === t.id && <span className="material-symbols-outlined text-sm">check_circle</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtre : Secteur d'Activité */}
            <div className="space-y-6 pt-4 border-t border-gray-50 dark:border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">verified</span>
                Secteur
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'All', label: 'Tous les secteurs' },
                  { id: 'Public', label: 'Public' },
                  { id: 'Privé', label: 'Privé' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setFilterStatus(s.id as any); setCurrentPage(1); }}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                      filterStatus === s.id 
                      ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10' 
                      : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                    }`}
                  >
                    {s.label}
                    {filterStatus === s.id && <span className="material-symbols-outlined text-sm">check_circle</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 bg-background-dark rounded-[40px] text-white space-y-6 relative overflow-hidden shadow-2xl">
             <div className="absolute -top-10 -right-10 size-32 bg-primary/10 rounded-full blur-2xl"></div>
             <h4 className="text-xl font-black leading-tight relative z-10">Guide Interactif</h4>
             <p className="text-sm font-medium text-gray-400 relative z-10">Trouvez l'institut qui correspond à votre projet professionnel.</p>
             <Link to="/contact" className="block w-full py-4 bg-primary text-black text-center rounded-2xl font-black text-[10px] uppercase tracking-widest relative z-10 hover:scale-105 transition-all">Besoin d'aide ?</Link>
          </div>
        </aside>

        {/* Grille de Résultats */}
        <div className="flex-1 space-y-10">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-[11px] font-black dark:text-white tracking-[0.2em] uppercase text-gray-500">
               {filtered.length} Établissement(s) <span className="text-primary italic">identifié(s)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pagedData.map((school) => (
              <div key={school.id} className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative animate-fade-in">
                <div className={`h-1.5 w-full ${school.parentStatus === 'Public' ? 'bg-primary' : 'bg-amber-400'}`}></div>
                <div className="p-8 md:p-10 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-white/10">
                        {school.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        school.parentStatus === 'Public' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                      }`}>
                        {school.parentStatus}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0f1a13] dark:text-white leading-tight group-hover:text-primary transition-colors tracking-tighter">
                      {school.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                      <p className="text-sm font-bold">{school.location}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Institution parente</p>
                    <p className="text-sm font-black dark:text-white italic line-clamp-1">{school.parentName} ({school.parentAcronym})</p>
                  </div>
                </div>
                
                <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800">
                  <Link 
                    to={`/majors?search=${encodeURIComponent(school.name)}`} 
                    className="w-full flex items-center justify-center gap-3 py-4 bg-background-dark dark:bg-white/5 text-white dark:text-white hover:bg-primary hover:text-black transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/5"
                  >
                    Parcourir les filières
                    <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24 bg-white dark:bg-surface-dark rounded-[40px] border border-dashed border-gray-200 dark:border-white/10 animate-fade-in">
               <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
               <h3 className="text-xl font-black dark:text-white mb-2">Aucun résultat</h3>
               <p className="text-gray-400">Aucun établissement ne correspond au sigle ou au nom recherché.</p>
            </div>
          )}

          {/* Pagination : Max 4 par page */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16 animate-fade-in">
              <button 
                onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo(0, 300); }}
                disabled={currentPage === 1}
                className="size-14 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-white/10 disabled:opacity-20 hover:border-primary hover:text-primary transition-all text-gray-400"
              >
                <span className="material-symbols-outlined font-black">west</span>
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 300); }}
                    className={`size-14 rounded-2xl font-black text-xs transition-all border ${currentPage === i + 1 ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-white/5 dark:text-white border-gray-100 dark:border-white/10 hover:border-primary'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo(0, 300); }}
                disabled={currentPage === totalPages}
                className="size-14 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-white/10 disabled:opacity-20 hover:border-primary hover:text-primary transition-all text-gray-400"
              >
                <span className="material-symbols-outlined font-black">east</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schools;
