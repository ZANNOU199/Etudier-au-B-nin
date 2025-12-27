
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

  // Extraction dynamique des villes à partir des universités
  const cities = useMemo(() => {
    const allCities = universities.map(u => u.location).filter(Boolean);
    return ['Toutes les villes', ...Array.from(new Set(allCities))].sort();
  }, [universities]);

  // Extraction dynamique des domaines d'études à partir des filières
  const domains = useMemo(() => {
    const allDomains = majors.map(m => m.domain).filter(Boolean);
    return ['Tous les domaines', ...Array.from(new Set(allDomains))].sort();
  }, [majors]);

  // Synchronisation avec la recherche URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearch(urlSearch);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Logique de filtrage robuste
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return majors.filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(query) || 
        m.facultyName.toLowerCase().includes(query) || 
        m.universityName.toLowerCase().includes(query) ||
        m.domain.toLowerCase().includes(query);
      
      // On utilise 'location' qui est mappé depuis 'university.city' dans CMSContext
      const matchesCity = cityFilter === 'Toutes les villes' || m.location === cityFilter;
      const matchesDomain = domainFilter === 'Tous les domaines' || m.domain === domainFilter;
      
      return matchesSearch && matchesCity && matchesDomain;
    });
  }, [search, cityFilter, domainFilter, majors]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pagedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Calcul du nombre d'éléments par ville pour les badges
  const getCityCount = (city: string) => {
    if (city === 'Toutes les villes') return majors.length;
    return majors.filter(m => m.location === city).length;
  };

  return (
    <div className="flex flex-col w-full min-h-screen font-display bg-[#f8faf9] dark:bg-background-dark">
      {/* Hero Header avec Design Glassmorphism */}
      <div className="bg-[#0f1a13] py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-10 relative z-10 text-center">
          <div className="space-y-6">
            <span className="inline-block text-primary font-black uppercase tracking-[0.4em] text-[10px] bg-primary/10 backdrop-blur-md border border-primary/20 px-8 py-3 rounded-full">
              Orientation Académique
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
              Trouvez votre <span className="text-primary italic">Formation</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Explorez le catalogue national des filières accréditées et lancez votre carrière dès aujourd'hui.
            </p>
          </div>
          
          <div className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-2.5 rounded-[32px] shadow-2xl flex flex-col md:flex-row gap-3">
             <div className="flex-1 flex items-center h-16 px-6 bg-white/5 rounded-2xl border border-white/5 focus-within:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-primary font-bold">search</span>
                <input 
                  className="bg-transparent border-none text-white focus:ring-0 flex-1 font-bold px-4 placeholder:text-gray-500 text-lg" 
                  placeholder="Rechercher une formation (ex: Droit, Informatique...)" 
                  value={search} 
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
                />
             </div>
             <button className="h-16 px-12 bg-primary text-black font-black rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">
               Actualiser
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto w-full px-6 md:px-12 py-20 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Mobile Filter Trigger */}
        <button 
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="lg:hidden flex items-center justify-center gap-4 w-full py-5 bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-white/5 font-black text-xs uppercase tracking-widest shadow-premium"
        >
          <span className="material-symbols-outlined">{isMobileFilterOpen ? 'close' : 'filter_list'}</span>
          {isMobileFilterOpen ? 'Fermer les filtres' : 'Filtrer par Ville ou Domaine'}
        </button>

        {/* Sidebar de Filtrage Premium */}
        <aside className={`${isMobileFilterOpen ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 flex-col gap-10 flex-shrink-0 animate-fade-in`}>
          
          {/* Bloc de Filtre : Ville (Relation Université) */}
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-premium space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-50 dark:border-white/5 pb-5">
               <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl font-bold">location_on</span>
               </div>
               <div className="text-left">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Localisation</h3>
                  <p className="text-xs font-black dark:text-white leading-none mt-1">Par Ville</p>
               </div>
            </div>
            
            <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => { setCityFilter(city); setCurrentPage(1); }}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border text-left ${
                    cityFilter === city 
                    ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10' 
                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                  }`}
                >
                  <span className="truncate">{city}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${cityFilter === city ? 'bg-black/10' : 'bg-gray-100 dark:bg-white/10'}`}>
                    {getCityCount(city)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bloc de Filtre : Domaine d'étude */}
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-premium space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-50 dark:border-white/5 pb-5">
               <div className="size-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                  <span className="material-symbols-outlined text-2xl font-bold">category</span>
               </div>
               <div className="text-left">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Spécialité</h3>
                  <p className="text-xs font-black dark:text-white leading-none mt-1">Par Domaine</p>
               </div>
            </div>
            
            <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-left">
              {domains.map(domain => (
                <button
                  key={domain}
                  onClick={() => { setDomainFilter(domain); setCurrentPage(1); }}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border text-left ${
                    domainFilter === domain 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/10' 
                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                  }`}
                >
                  <span className="truncate pr-2">{domain}</span>
                  {domainFilter === domain && <span className="material-symbols-outlined text-sm font-bold">check_circle</span>}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Sidebar */}
          <div className="bg-[#0f1a13] p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl group border border-white/5">
             <div className="absolute -top-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
             <div className="relative z-10 space-y-6 text-left">
                <h4 className="text-2xl font-black leading-tight tracking-tighter">Besoin d'aide ?</h4>
                <p className="text-sm font-medium text-gray-400 leading-relaxed">Nos conseillers vous orientent gratuitement selon votre profil et vos ambitions.</p>
                <Link to="/contact" className="flex items-center justify-center w-full py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                  Parler à un conseiller
                </Link>
             </div>
          </div>
        </aside>

        {/* Zone de Contenu Principal (Grille de Résultats) */}
        <div className="flex-1 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-4">
            <div className="text-left">
               <h2 className="text-3xl font-black dark:text-white tracking-tighter leading-none flex items-center gap-4">
                  {filtered.length} <span className="text-gray-400">Offres disponibles</span>
               </h2>
               <div className="flex flex-wrap gap-2 mt-4">
                 {cityFilter !== 'Toutes les villes' && (
                   <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20 flex items-center gap-2 animate-fade-in">
                     <span className="material-symbols-outlined text-xs">location_on</span>
                     {cityFilter}
                   </span>
                 )}
                 {domainFilter !== 'Tous les domaines' && (
                   <span className="px-4 py-1.5 bg-blue-500/10 text-blue-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-2 animate-fade-in">
                     <span className="material-symbols-outlined text-xs">category</span>
                     {domainFilter}
                   </span>
                 )}
               </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white dark:bg-surface-dark px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trier par</p>
               <select className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest outline-none focus:ring-0 dark:text-white cursor-pointer">
                  <option className="text-black">Pertinence</option>
                  <option className="text-black">Frais (Cfa)</option>
                  <option className="text-black">A-Z</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
            {pagedData.map(major => (
              <div key={major.id} className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[50px] overflow-hidden hover:shadow-hover transition-all duration-500 flex flex-col hover:-translate-y-2 relative">
                <div className="relative h-72 overflow-hidden">
                  <img className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" src={major.image} alt={major.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                  
                  <div className="absolute top-8 left-8 flex gap-3">
                    <span className="px-5 py-2.5 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl">{major.level}</span>
                    <span className="px-5 py-2.5 bg-white/15 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/20">{major.duration}</span>
                  </div>

                  <div className="absolute top-8 right-8">
                     <div className="size-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-2xl font-bold">verified_user</span>
                     </div>
                  </div>
                  
                  <div className="absolute bottom-10 left-10 right-10 text-white space-y-3 text-left">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{major.domain}</p>
                     <h3 className="text-3xl font-black leading-none tracking-tighter group-hover:text-primary transition-colors">{major.name}</h3>
                  </div>
                </div>
                
                <div className="p-10 flex flex-col flex-1 gap-10 text-left">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors group/item">
                        <div className="size-11 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm border border-gray-100 dark:border-white/5 group-hover/item:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-2xl">account_balance</span>
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Établissement</p>
                           <p className="text-sm font-black dark:text-white leading-none mt-1 truncate">{major.universityName}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors group/item">
                        <div className="size-11 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center text-blue-500 shadow-sm border border-gray-100 dark:border-white/5 group-hover/item:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-2xl">payments</span>
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Scolarité</p>
                           <p className="text-sm font-black dark:text-white leading-none mt-1 truncate">{major.fees}</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 px-6 py-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <span className="material-symbols-outlined text-primary text-xl font-bold">location_on</span>
                    <p className="text-xs font-black dark:text-white uppercase tracking-widest">Ville de formation : <span className="text-primary">{major.location}</span></p>
                  </div>

                  <div className="mt-auto pt-10 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-6">
                    <Link to={`/major/${major.id}`} className="flex-1 flex items-center justify-center gap-4 py-5 bg-background-dark dark:bg-primary text-white dark:text-black font-black text-[11px] uppercase tracking-widest rounded-3xl hover:shadow-2xl transition-all group/btn">
                      Détails de l'offre
                      <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-2 transition-transform">east</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* État Vide (No Results) */}
          {filtered.length === 0 && (
            <div className="text-center py-40 bg-white dark:bg-surface-dark rounded-[60px] border border-dashed border-gray-200 dark:border-white/10 animate-fade-in shadow-sm">
               <div className="size-28 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <span className="material-symbols-outlined text-7xl text-gray-300">search_off</span>
               </div>
               <h3 className="text-4xl font-black dark:text-white tracking-tighter mb-4">Aucune formation trouvée</h3>
               <p className="text-gray-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
                 Nous n'avons trouvé aucun programme correspondant à vos critères à <span className="text-primary font-bold">{cityFilter}</span>.
               </p>
               <button 
                onClick={() => { setSearch(''); setCityFilter('Toutes les villes'); setDomainFilter('Tous les domaines'); }}
                className="mt-12 px-12 py-5 bg-primary/10 text-primary font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] hover:bg-primary hover:text-black transition-all border border-primary/20 shadow-xl shadow-primary/5"
               >
                 Réinitialiser la recherche
               </button>
            </div>
          )}

          {/* Pagination Interactive */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-5 mt-20 animate-fade-in">
              <button 
                onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                disabled={currentPage === 1}
                className="size-16 flex items-center justify-center rounded-[24px] border border-gray-100 dark:border-white/10 disabled:opacity-10 hover:border-primary hover:text-primary transition-all text-gray-400 bg-white dark:bg-white/5 shadow-sm"
              >
                <span className="material-symbols-outlined font-black text-3xl">west</span>
              </button>
              
              <div className="flex gap-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }} 
                    className={`size-16 rounded-[24px] font-black text-sm transition-all border ${
                      currentPage === i + 1 
                      ? 'bg-primary border-primary text-black shadow-2xl shadow-primary/30 scale-110 z-10' 
                      : 'bg-white dark:bg-white/5 dark:text-white border-gray-100 dark:border-gray-800 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                disabled={currentPage === totalPages}
                className="size-16 flex items-center justify-center rounded-[24px] border border-gray-100 dark:border-white/10 disabled:opacity-10 hover:border-primary hover:text-primary transition-all text-gray-400 bg-white dark:bg-white/5 shadow-sm"
              >
                <span className="material-symbols-outlined font-black text-3xl">east</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Majors;
