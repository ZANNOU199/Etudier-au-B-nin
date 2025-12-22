
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UNIVERSITIES, MAJORS } from '../constants';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('Toutes les villes');

  const cities = useMemo(() => {
    const allCities = UNIVERSITIES.map(u => u.location);
    return ['Toutes les villes', ...Array.from(new Set(allCities))];
  }, []);

  const filteredUniversities = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return UNIVERSITIES.filter(uni => {
      const matchesCity = cityFilter === 'Toutes les villes' || uni.location === cityFilter;
      if (!matchesCity) return false;
      if (!query) return true;
      return uni.name.toLowerCase().includes(query) || uni.acronym.toLowerCase().includes(query);
    }).slice(0, 2);
  }, [searchQuery, cityFilter]);

  const handleSearchClick = () => {
    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div 
          className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-cover bg-center relative px-6 py-32" 
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(13, 27, 19, 0.9), rgba(13, 27, 19, 0.7)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkQQ_D4dsN5t-vB4dnSyIT0D90X16bTMemXMzEkfav2Fu40te6xhIxbzXEp2XtbeTmz8LK4-vaRNRjPDzAd5szO2DjnuBAYlA-dencatakWD1ooVt4Um2RkLzGr4Rt2EI590V6HfLNB_i9tvQIhvJfFvKuv9R2zenhB8_jsXfO1C45k6JbyzktatFBQG7URZB1-MWkPmN-uQN3EAOJqjkdkKu-U8dga4pQGt6w6VwDhJiVey8OMxscBvAmqHtzYh4v0wGPLrB6QeA")` 
          }}
        >
          <div className="max-w-[1200px] mx-auto z-10 animate-fade-in flex flex-col gap-10 text-center">
            <div className="space-y-6">
              <span className="inline-block text-primary font-black uppercase tracking-[0.3em] text-[11px] bg-primary/10 backdrop-blur-md border border-primary/20 px-8 py-3 rounded-full mb-4">
                Portail National d'Orientation Académique
              </span>
              
              <h1 className="text-white text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                Ouvrez les portes <br /> de votre <span className="text-primary underline decoration-primary/20 underline-offset-[15px]">destinée</span>.
              </h1>
              <p className="text-gray-300 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
                Trouvez la formation idéale parmi les établissements d'excellence au Bénin et gérez vos préinscriptions en quelques clics.
              </p>
            </div>

            <div className="w-full max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-stretch rounded-[32px] bg-white dark:bg-surface-dark p-2.5 shadow-premium gap-2.5 transition-all focus-within:ring-4 focus-within:ring-primary/20">
                <div className="flex items-center flex-1 px-6 md:border-r border-gray-100 dark:border-white/5">
                  <span className="material-symbols-outlined text-primary font-bold text-2xl">search</span>
                  <input 
                    className="w-full bg-transparent border-none text-text-main dark:text-white placeholder:text-gray-400 focus:ring-0 text-lg ml-3 font-bold py-5" 
                    placeholder="Quelle filière ou université ?" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center md:w-64 px-6">
                  <span className="material-symbols-outlined text-gray-400 mr-3 text-2xl">location_on</span>
                  <select 
                    className="w-full bg-transparent border-none text-text-main dark:text-white focus:ring-0 text-sm font-black uppercase tracking-widest cursor-pointer"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  >
                    {cities.map(city => (
                      <option key={city} value={city} className="dark:bg-surface-dark">{city}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleSearchClick}
                  className="bg-primary hover:bg-green-400 text-black font-black rounded-[24px] px-12 py-5 transition-all hover:shadow-hover hover:scale-[1.02] active:scale-100 text-base shadow-xl shadow-primary/20"
                >
                  Explorer
                </button>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <span className="material-symbols-outlined text-white text-3xl">expand_more</span>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section id="results-section" className="py-32 bg-background-light dark:bg-background-dark">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-text-main dark:text-white tracking-tight leading-tight">
                Pôles d'Excellence <br /><span className="text-primary">recommandés</span>
              </h2>
              <div className="h-1.5 w-24 bg-primary rounded-full"></div>
            </div>
            <Link to="/universities" className="flex items-center text-primary font-black hover:underline gap-3 group text-lg uppercase tracking-widest text-xs">
              Catalogue Complet 
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2 font-bold">east</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map(uni => (
                <div key={uni.id} className="group bg-white dark:bg-surface-dark rounded-[50px] overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-premium transition-all duration-700 flex flex-col md:flex-row">
                  <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                    <img src={uni.cover} alt={uni.name} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-10 md:p-12 md:w-3/5 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                          {uni.type}
                        </span>
                        <div className="size-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center p-2.5 shadow-sm border border-gray-100 dark:border-white/10 group-hover:scale-110 transition-transform">
                          <img src={uni.logo} alt={uni.acronym} className="max-w-full max-h-full object-contain" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black text-text-main dark:text-white tracking-tighter leading-none group-hover:text-primary transition-colors">
                          {uni.name}
                        </h3>
                        <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                          {uni.location}
                        </p>
                      </div>
                    </div>
                    <div className="pt-8">
                      <Link to={`/university/${uni.id}`} className="flex items-center justify-center w-full py-5 bg-gray-50 dark:bg-white/10 hover:bg-primary hover:text-black dark:text-white dark:hover:text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all border border-transparent hover:shadow-lg shadow-primary/10">
                        Consulter les filières
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white dark:bg-surface-dark rounded-[50px] border-2 border-dashed border-gray-100 dark:border-white/5">
                <span className="material-symbols-outlined text-7xl text-gray-200 mb-6">search_off</span>
                <h3 className="text-3xl font-black dark:text-white">Aucun établissement trouvé</h3>
                <p className="text-gray-500 mt-3 font-medium text-lg">Essayez d'ajuster vos critères ou réinitialisez la recherche.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto rounded-[60px] bg-background-dark p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-5xl border border-white/5">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-2xl text-center md:text-left space-y-8">
            <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">Lancez votre futur <br /><span className="text-primary">aujourd'hui</span>.</h2>
            <p className="text-gray-400 text-lg md:text-2xl font-medium leading-relaxed">
              Rejoignez plus de 15,000 étudiants qui ont déjà trouvé leur voie grâce à notre plateforme d'orientation intelligente.
            </p>
          </div>
          <div className="relative z-10 mt-12 md:mt-0">
            <Link to="/register" className="bg-primary hover:bg-green-400 text-black font-black py-6 px-16 rounded-[24px] text-lg transition-all hover:scale-105 shadow-2xl shadow-primary/30 inline-flex items-center gap-4 group uppercase tracking-widest text-sm">
              Créer mon compte
              <span className="material-symbols-outlined font-bold group-hover:translate-x-2 transition-transform">east</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
