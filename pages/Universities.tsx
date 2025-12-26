
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const ITEMS_PER_PAGE = 4;

const Universities: React.FC = () => {
  const { universities } = useCMS();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return universities.filter(u => 
      (u.name.toLowerCase().includes(search.toLowerCase()) || u.acronym.toLowerCase().includes(search.toLowerCase())) &&
      (typeFilter === 'All' || u.type?.toLowerCase() === typeFilter.toLowerCase())
    );
  }, [search, typeFilter, universities]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pagedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Header */}
      <div className="w-full bg-background-dark py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-[1000px] mx-auto flex flex-col items-center text-center gap-10 relative z-10">
          <div className="space-y-4">
             <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] bg-primary/10 px-6 py-2 rounded-full border border-primary/20">Institutions Accréditées</span>
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1]">Découvrez nos <br /><span className="text-primary">Universités</span></h1>
             <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">Trouvez l'établissement idéal parmi les universités publiques et privées reconnues par l'État Béninois.</p>
          </div>
          
          <div className="w-full max-w-[700px] bg-white dark:bg-surface-dark p-2 rounded-[32px] shadow-2xl flex flex-col sm:flex-row gap-2 transition-all focus-within:ring-4 focus-within:ring-primary/20">
              <div className="flex items-center flex-1 px-6 border-gray-100 dark:border-white/5">
                <span className="material-symbols-outlined text-primary text-2xl">search</span>
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="flex-1 bg-transparent border-none text-text-main dark:text-white placeholder:text-gray-400 focus:ring-0 text-lg font-bold py-5 px-4" 
                  placeholder="Rechercher une université..." 
                />
              </div>
              <button className="bg-primary hover:bg-green-400 text-black font-black rounded-[24px] px-10 py-5 transition-all text-sm uppercase tracking-widest shadow-xl shadow-primary/20">
                Rechercher
              </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] px-6 md:px-12 py-20 flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-10">
          <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-premium">
            <div className="flex items-center gap-4 mb-8">
               <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><span className="material-symbols-outlined font-bold">verified</span></div>
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Filtrer par Statut</h3>
            </div>
            <div className="flex flex-col gap-3">
              {['All', 'Public', 'Privé'].map(type => (
                <button
                  key={type}
                  onClick={() => { setTypeFilter(type); setCurrentPage(1); }}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                    typeFilter === type 
                    ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10' 
                    : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                  }`}
                >
                  {type === 'All' ? 'Tout' : type}
                  {typeFilter === type && <span className="material-symbols-outlined text-sm font-bold">check_circle</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="p-10 bg-background-dark rounded-[40px] text-white space-y-6 relative overflow-hidden shadow-2xl">
             <div className="absolute -top-10 -left-10 size-32 bg-primary/10 rounded-full blur-2xl"></div>
             <h4 className="text-xl font-black leading-tight relative z-10">Orientation Personnalisée</h4>
             <p className="text-sm font-medium text-gray-400 relative z-10">Nos conseillers vous accompagnent dans votre choix stratégique.</p>
             <Link to="/contact" className="block w-full py-4 bg-primary text-black text-center rounded-2xl font-black text-[10px] uppercase tracking-widest relative z-10 hover:scale-105 transition-all">Prendre RDV</Link>
          </div>
        </aside>

        {/* Results List */}
        <div className="flex-1 flex flex-col gap-10">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-2xl font-black dark:text-white tracking-tight leading-none uppercase text-sm tracking-[0.2em]">
               {filtered.length} Établissement(s) <span className="text-gray-400">identifié(s)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {pagedData.map(uni => (
              <div key={uni.id} className="group bg-white dark:bg-surface-dark rounded-[50px] border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-premium transition-all duration-700 flex flex-col hover:-translate-y-2">
                <div className="relative h-40 overflow-hidden">
                  <img src={uni.cover} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" alt={uni.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-surface-dark via-transparent to-transparent"></div>
                  <div className="absolute -bottom-8 left-10 p-1.5 bg-white dark:bg-surface-dark rounded-[24px] border border-gray-100 dark:border-white/10 shadow-xl">
                    <img alt={uni.name} className="size-16 rounded-[20px] object-cover" src={uni.logo} />
                  </div>
                  <span className="absolute top-6 right-6 inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase text-white tracking-widest border border-white/20">
                    {uni.type}
                  </span>
                </div>
                <div className="pt-14 px-10 pb-10 flex flex-col flex-1 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black group-hover:text-primary transition-colors dark:text-white tracking-tighter leading-none">{uni.name} ({uni.acronym})</h3>
                    <p className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                      <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                      {uni.location}
                    </p>
                  </div>
                  <div className="mt-auto space-y-8">
                    <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                      <div className="text-center">
                        <span className="text-xl font-black dark:text-white leading-none block">{uni.stats.majors}</span>
                        <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest mt-1 block">Filières</span>
                      </div>
                      <div className="h-8 w-px bg-gray-200 dark:bg-white/10"></div>
                      <div className="text-center">
                        <span className="text-xl font-black dark:text-white leading-none block">{uni.stats.ranking}</span>
                        <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest mt-1 block">Rang</span>
                      </div>
                    </div>
                    <Link to={`/university/${uni.id}`} className="flex items-center justify-center w-full py-5 bg-background-dark dark:bg-primary text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-xl transition-all shadow-primary/10 group/btn">
                      Consulter les programmes
                      <span className="material-symbols-outlined text-lg ml-2 group-hover/btn:translate-x-1 transition-transform">east</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16">
              <button 
                onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo(0, 400); }}
                disabled={currentPage === 1}
                className="size-14 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-white/10 disabled:opacity-20 hover:border-primary hover:text-primary transition-all text-gray-400"
              >
                <span className="material-symbols-outlined font-black">west</span>
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 400); }}
                    className={`size-14 rounded-2xl font-black text-xs transition-all border ${currentPage === i + 1 ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-white/5 dark:text-white border-gray-100 dark:border-white/10 hover:border-primary'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo(0, 400); }}
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

export default Universities;
