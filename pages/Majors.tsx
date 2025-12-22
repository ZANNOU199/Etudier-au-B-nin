
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MAJORS } from '../constants';

const ITEMS_PER_PAGE = 4;

const Majors: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cityFilter, setCityFilter] = useState('Toutes les villes');
  const [currentPage, setCurrentPage] = useState(1);

  const cities = useMemo(() => {
    const allCities = MAJORS.map(m => m.location);
    return ['Toutes les villes', ...Array.from(new Set(allCities))];
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearch(urlSearch);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return MAJORS.filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(query) || 
        m.facultyName.toLowerCase().includes(query) || 
        m.universityName.toLowerCase().includes(query) ||
        m.domain.toLowerCase().includes(query);
      const matchesCity = cityFilter === 'Toutes les villes' || m.location === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [search, cityFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pagedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col w-full min-h-screen font-display">
      <div className="bg-[#0f1a13] py-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Catalogue Interactif</h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl">Découvrez les parcours académiques accrédités par le Ministère.</p>
          </div>
          
          <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2">
             <div className="flex-1 flex items-center h-16 px-6 bg-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-primary font-bold">search</span>
                <input className="bg-transparent border-none text-white focus:ring-0 flex-1 font-bold px-4" placeholder="Rechercher une filière..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
             </div>
             <div className="md:w-64 flex items-center h-16 px-6 bg-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-gray-400">location_on</span>
                <select value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }} className="bg-transparent border-none text-white focus:ring-0 flex-1 font-black text-xs uppercase cursor-pointer">
                   {cities.map(c => <option key={c} value={c} className="bg-background-dark">{c}</option>)}
                </select>
             </div>
             <button className="h-16 px-10 bg-primary text-black font-black rounded-2xl hover:scale-105 transition-all">Rechercher</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
             <h2 className="text-2xl font-black dark:text-white tracking-tight">{filtered.length} Formations disponibles</h2>
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-400 border border-gray-100 dark:border-gray-800">Pagination: {ITEMS_PER_PAGE} par page</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {pagedData.map(major => (
              <div key={major.id} className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={major.image} alt={major.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl">{major.level}</span>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{major.domain}</p>
                     <h3 className="text-2xl font-black leading-tight mt-1">{major.name}</h3>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                     <div className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-2xl">account_balance</span>
                     </div>
                     <div>
                        <p className="text-xs font-black text-gray-600 dark:text-gray-300 leading-tight">{major.universityName}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{major.location}</p>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                    <Link to={`/major/${major.id}`} className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-white/5 text-[#0f1a13] dark:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black transition-all group/btn">
                      Détails de la formation
                      <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16">
              <button onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo(0, 400); }} disabled={currentPage === 1} className="size-12 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center disabled:opacity-20 hover:border-primary transition-all"><span className="material-symbols-outlined font-bold">chevron_left</span></button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 400); }} className={`size-12 rounded-2xl font-black text-xs transition-all border ${currentPage === i + 1 ? 'bg-primary border-primary text-black' : 'bg-white dark:bg-white/5 dark:text-white border-gray-100 dark:border-gray-800'}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo(0, 400); }} disabled={currentPage === totalPages} className="size-12 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center disabled:opacity-20 hover:border-primary transition-all"><span className="material-symbols-outlined font-bold">chevron_right</span></button>
            </div>
          )}
      </div>
    </div>
  );
};

export default Majors;
