
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UNIVERSITIES } from '../constants';

const ITEMS_PER_PAGE = 4;

const Universities: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return UNIVERSITIES.filter(u => 
      (u.name.toLowerCase().includes(search.toLowerCase()) || u.acronym.toLowerCase().includes(search.toLowerCase())) &&
      (typeFilter === 'All' || u.type === typeFilter)
    );
  }, [search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pagedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <div className="w-full bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark py-12 px-4 flex justify-center">
        <div className="max-w-[800px] w-full flex flex-col items-center text-center gap-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Découvrez les Universités du Bénin</h1>
          <p className="text-lg text-text-secondary dark:text-gray-300">Trouvez l'établissement idéal parmi les universités publiques et privées accréditées.</p>
          
          <div className="w-full max-w-[600px] mt-4 shadow-xl rounded-lg overflow-hidden">
            <div className="flex w-full h-14 md:h-16 items-stretch bg-white dark:bg-[#25382e] border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary">
              <div className="flex items-center justify-center pl-4 pr-2 text-text-secondary">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input 
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="flex-1 h-full bg-transparent border-none text-text-main dark:text-white placeholder:text-gray-400 focus:ring-0 text-base" 
                placeholder="Rechercher par nom, ville ou sigle..." 
              />
              <div className="p-2">
                <button className="h-full px-6 bg-primary hover:bg-primary-dark text-[#0d1b13] font-bold rounded text-sm transition-colors">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1280px] px-4 lg:px-10 py-10 flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full lg:w-[280px] flex-shrink-0 space-y-8">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified</span> Statut
            </h3>
            <div className="space-y-3">
              {['All', 'Public', 'Privé'].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="status"
                    checked={typeFilter === type}
                    onChange={() => { setTypeFilter(type); setCurrentPage(1); }}
                    className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-transparent" 
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                    {type === 'All' ? 'Tout' : type}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{filtered.length} Résultats trouvés</h2>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trier par:</span>
               <select className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm px-3 py-2 font-bold outline-none">
                 <option>Pertinence</option>
                 <option>Nom (A-Z)</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pagedData.map(uni => (
              <div key={uni.id} className="group bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="relative h-24 bg-gradient-to-r from-green-50 to-green-100 dark:from-[#152920] dark:to-[#1a2e22]">
                  <div className="absolute -bottom-8 left-6 p-1 bg-white dark:bg-surface-dark rounded-full border border-gray-100 dark:border-gray-800">
                    <img alt={uni.name} className="size-16 rounded-full object-cover" src={uni.logo} />
                  </div>
                  <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-green-800 dark:text-green-300 tracking-wider">
                    {uni.type}
                  </span>
                </div>
                <div className="pt-10 px-6 pb-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{uni.name} ({uni.acronym})</h3>
                    <div className="flex items-center gap-1 mt-2 text-text-secondary text-sm">
                      <span className="material-symbols-outlined text-lg">location_on</span>
                      <span>{uni.location}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark">
                    <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-600">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-text-main dark:text-white">{uni.stats.majors}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Filières</span>
                      </div>
                      <div className="h-8 w-px bg-border-light dark:border-border-dark"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-text-main dark:text-white">{uni.stats.ranking}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Classement</span>
                      </div>
                    </div>
                    <Link to={`/university/${uni.id}`} className="block w-full py-2.5 text-center rounded-lg border border-primary text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                      Voir les formations
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`size-10 rounded-lg font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-primary text-black' : 'bg-gray-50 dark:bg-white/5 dark:text-white border border-transparent hover:border-primary/50'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Universities;
