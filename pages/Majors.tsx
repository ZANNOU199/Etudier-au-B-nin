
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const ITEMS_PER_PAGE = 6;

const Majors: React.FC = () => {
  const { majors, universities } = useCMS();
  const [searchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cityFilter, setCityFilter] = useState('Toutes les villes');
  const [domainFilter, setDomainFilter] = useState('Tous les domaines');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extraction dynamique des villes (depuis les universités pour être exhaustif)
  const cities = useMemo(() => {
    const allCities = universities.map(u => u.location);
    return ['Toutes les villes', ...Array.from(new Set(allCities))].sort();
  }, [universities]);

  // Extraction dynamique des domaines d'études
  const domains = useMemo(() => {
    const allDomains = majors.map(m => m.domain);
    return ['Tous les domaines', ...Array.from(new Set(allDomains))].sort();
  }, [majors]);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearch(urlSearch);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return majors.filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(query) || 
        m.facultyName.toLowerCase().includes(query) || 
        m.universityName.toLowerCase().includes(query) ||
        m.domain.toLowerCase().includes(query);
      
      const matchesCity = cityFilter === 'Toutes les villes' || m.location === cityFilter;
      const matchesDomain = domainFilter === 'Tous les domaines' || m.domain === domainFilter;
      
      return matchesSearch && matchesCity && matchesDomain;
    });
  }, [search, cityFilter, domainFilter, majors]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pagedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col w-full min-h-screen font-display bg-[#f8faf9] dark:bg-background-dark">
      {/* Hero Header */}
      <div className="bg-[#0f1a13] py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 relative z-10">
          <div className="text-center space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] bg-primary/10 px-6 py-2 rounded-full border border-primary/20">Catalogue National</span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Nos <span className="text-primary">Filières</span> d'Avenir</h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl">Explorez les opportunités académiques et trouvez votre voie vers le succès.</p>
          </div>
          
          <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2">
             <div className="flex-1 flex items-center h-16 px-6 bg-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-primary font-bold">search</span>
                <input 
                  className="bg-transparent border-none text-white focus:ring-0 flex-1 font-bold px-4 placeholder:text-gray-500" 
                  placeholder="Rechercher une formation, un domaine..." 
                  value={search} 
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
                />
             </div>
             <button className="h-16 px-10 bg-primary text-black font-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
               Rechercher
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1450px] mx-auto w-full px-6 md:px-12 py-16 flex flex-col lg:flex-row gap-16">
        
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="lg:hidden flex items-center justify-center gap-3 w-full py-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 font-black text-xs uppercase tracking-widest"
        >
          <span className="material-symbols-outlined">filter_list</span>
          {isMobileFilterOpen ? 'Fermer les filtres' : 'Affiner la recherche'}
        </button>

        {/* Sidebar Filters */}
        <aside className={`${isMobileFilterOpen ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 flex-col gap-8 flex-shrink-0 animate-fade-in`}>
          
          {/* Filter by City */}
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-premium space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-white/5 pb-4">
               <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl font-bold">location_on</span>
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Par Ville</h3>
            </div>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => { setCityFilter(city); setCurrentPage(1); }}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                    cityFilter === city 
                    ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10' 
                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                  }`}
                >
                  {city}
                  {cityFilter === city && <span className="material-symbols-outlined text-sm font-bold">check_circle</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Domain */}
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-premium space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-white/5 pb-4">
               <div className="size-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined text-xl font-bold">category</span>
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Par Domaine</h3>
            </div>
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {domains.map(domain => (
                <button
                  key={domain}
                  onClick={() => { setDomainFilter(domain); setCurrentPage(1); }}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                    domainFilter === domain 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/10' 
                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                  }`}
                >
                  <span className="truncate pr-2">{domain}</span>
                  {domainFilter === domain && <span className="material-symbols-outlined text-sm font-bold">check_circle</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1a13] p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl group">
             <div className="absolute -top-10 -right-10 size-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
             <div className="relative z-10 space-y-6">
                <h4 className="text-xl font-black leading-tight">Besoin d'un conseil ?</h4>
                <p className="text-sm font-medium text-gray-400">Nos experts vous orientent gratuitement selon votre profil.</p>
                <Link to="/contact" className="block w-full py-4 bg-primary text-black text-center rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">Prendre rendez-vous</Link>
             </div>
          </div>
        </aside>

        {/* Results Content */}
        <div className="flex-1 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-4">
            <div className="space-y-1">
               <h2 className="text-2xl font-black dark:text-white tracking-tight leading-none uppercase text-sm tracking-[0.2em]">
                  {filtered.length} Résultat(s) <span className="text-gray-400">trouvé(s)</span>
               </h2>
               <div className="flex gap-2 mt-2">
                 {cityFilter !== 'Toutes les villes' && (
                   <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">Ville: {cityFilter}</span>
                 )}
                 {domainFilter !== 'Tous les domaines' && (
                   <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20">Domaine: {domainFilter}</span>
                 )}
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trier par</p>
               <select className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Pertinence</option>
                  <option>Prix croissant</option>
                  <option>Plus récent</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
            {pagedData.map(major => (
              <div key={major.id} className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[50px] overflow-hidden hover:shadow-premium transition-all duration-500 flex flex-col hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <img className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" src={major.image} alt={major.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-4 py-2 bg-primary text-black text-[9px] font-black uppercase tracking-widest rounded-2xl shadow-xl">{major.level}</span>
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-2xl border border-white/20">{major.duration}</span>
                  </div>
                  
                  <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{major.domain}</p>
                     <h3 className="text-2xl font-black leading-tight tracking-tighter group-hover:text-primary transition-colors">{major.name}</h3>
                  </div>
                </div>
                
                <div className="p-10 flex flex-col flex-1 gap-8">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                        <div className="size-10 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
                           <span className="material-symbols-outlined text-xl">account_balance</span>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Établissement</p>
                           <p className="text-sm font-black dark:text-white leading-none mt-1">{major.universityName}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                        <div className="size-10 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center text-blue-500 shadow-sm">
                           <span className="material-symbols-outlined text-xl">payments</span>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Scolarité</p>
                           <p className="text-sm font-black dark:text-white leading-none mt-1">{major.fees}</p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-gray-50 dark:border-gray-800">
                    <Link to={`/major/${major.id}`} className="w-full flex items-center justify-center gap-3 py-5 bg-background-dark dark:bg-primary text-white dark:text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:shadow-2xl transition-all group/btn shadow-lg shadow-black/5">
                      Détails de l'offre académique
                      <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">east</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-32 bg-white dark:bg-surface-dark rounded-[60px] border border-dashed border-gray-200 dark:border-white/10 animate-fade-in">
               <div className="size-24 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-8">
                  <span className="material-symbols-outlined text-6xl text-gray-200">search_off</span>
               </div>
               <h3 className="text-3xl font-black dark:text-white tracking-tight mb-3">Aucun résultat trouvé</h3>
               <p className="text-gray-500 max-w-md mx-auto font-medium">Nous n'avons trouvé aucune formation correspondant à vos critères de recherche actuels.</p>
               <button 
                onClick={() => { setSearch(''); setCityFilter('Toutes les villes'); setDomainFilter('Tous les domaines'); }}
                className="mt-10 px-10 py-4 bg-primary/10 text-primary font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-primary hover:text-black transition-all border border-primary/20"
               >
                 Réinitialiser tous les filtres
               </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16 animate-fade-in">
              <button 
                onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo(0, 400); }}
                disabled={currentPage === 1}
                className="size-14 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-white/10 disabled:opacity-20 hover:border-primary hover:text-primary transition-all text-gray-400 bg-white dark:bg-white/5"
              >
                <span className="material-symbols-outlined font-black">west</span>
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 400); }} 
                    className={`size-14 rounded-2xl font-black text-xs transition-all border ${
                      currentPage === i + 1 
                      ? 'bg-primary border-primary text-black shadow-xl shadow-primary/20 scale-110 z-10' 
                      : 'bg-white dark:bg-white/5 dark:text-white border-gray-100 dark:border-gray-800 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo(0, 400); }}
                disabled={currentPage === totalPages}
                className="size-14 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-white/10 disabled:opacity-20 hover:border-primary hover:text-primary transition-all text-gray-400 bg-white dark:bg-white/5"
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

export default Majors;
