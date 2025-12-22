
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UNIVERSITIES, MAJORS } from '../constants';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('Toutes les villes');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const cities = useMemo(() => {
    const allCities = UNIVERSITIES.map(u => u.location);
    return ['Toutes les villes', ...Array.from(new Set(allCities))];
  }, []);

  const filteredUniversities = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query && cityFilter === 'Toutes les villes') {
      return UNIVERSITIES;
    }

    return UNIVERSITIES.filter(uni => {
      const matchesCity = cityFilter === 'Toutes les villes' || uni.location === cityFilter;
      if (!matchesCity) return false;
      if (!query) return true;

      const matchesUniName = uni.name.toLowerCase().includes(query) || 
                             uni.acronym.toLowerCase().includes(query);
      
      const matchesFaculty = uni.faculties?.some(f => 
        f.name.toLowerCase().includes(query) || 
        f.description.toLowerCase().includes(query)
      );
      
      const matchesMajor = MAJORS.some(m => 
        m.universityId === uni.id && m.name.toLowerCase().includes(query)
      );

      return matchesUniName || matchesFaculty || matchesMajor;
    });
  }, [searchQuery, cityFilter]);

  // On limite à 2 par défaut comme demandé
  const displayedUniversities = useMemo(() => {
    return filteredUniversities.slice(0, 2);
  }, [filteredUniversities]);

  const handleSearchClick = () => {
    setSearchPerformed(true);
    const resultsSection = document.getElementById('results-section');
    resultsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setSearchPerformed(true);
    const resultsSection = document.getElementById('results-section');
    resultsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full">
        <div 
          className="w-full min-h-[600px] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-20" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(18, 32, 24, 0.82), rgba(18, 32, 24, 0.7)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkQQ_D4dsN5t-vB4dnSyIT0D90X16bTMemXMzEkfav2Fu40te6xhIxbzXEp2XtbeTmz8LK4-vaRNRjPDzAd5szO2DjnuBAYlA-dencatakWD1ooVt4Um2RkLzGr4Rt2EI590V6HfLNB_i9tvQIhvJfFvKuv9R2zenhB8_jsXfO1C45k6JbyzktatFBQG7URZB1-MWkPmN-uQN3EAOJqjkdkKu-U8dga4pQGt6w6VwDhJiVey8OMxscBvAmqHtzYh4v0wGPLrB6QeA")` 
          }}
        >
          <div className="flex flex-col gap-6 text-center max-w-5xl mx-auto z-10 animate-fade-in">
            <div className="flex flex-col gap-4">
              <span className="text-primary font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs bg-primary/10 backdrop-blur-sm border border-primary/20 px-6 py-2 rounded-full self-center mb-2">
                Facilitateur d'inscriptions et préinscriptions universitaires
              </span>
              
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Trouvez votre voie <br className="hidden md:block" /> académique au Bénin
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium max-w-3xl mx-auto">
                La plateforme officielle pour comparer les offres de formation et réussir votre orientation.
              </p>
            </div>

            <div className="w-full max-w-3xl mx-auto mt-6">
              <div className="flex flex-col sm:flex-row w-full items-stretch rounded-2xl bg-white dark:bg-surface-dark p-2 shadow-2xl gap-2 transition-all focus-within:ring-2 focus-within:ring-primary/40">
                <div className="flex items-center flex-1 px-4 sm:border-r border-gray-100 dark:border-gray-800">
                  <span className="material-symbols-outlined text-primary font-bold">search</span>
                  <input 
                    className="w-full bg-transparent border-none text-[#0f1a13] dark:text-white placeholder:text-gray-500 focus:ring-0 text-base ml-2 font-medium" 
                    placeholder="Quelle filière ou université ?" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center sm:w-48 px-4">
                  <span className="material-symbols-outlined text-gray-400 mr-2 text-xl">location_on</span>
                  <select 
                    className="w-full bg-transparent border-none text-[#0f1a13] dark:text-white focus:ring-0 text-sm font-medium cursor-pointer"
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
                  className="bg-primary hover:bg-green-400 text-[#0f1a13] font-black rounded-xl px-8 py-4 transition-all"
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results-section" className="py-20 bg-background-light dark:bg-background-dark min-h-[400px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-[#0f1a13] dark:text-white tracking-tight">
                Nos recommandations
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-bold">
                {filteredUniversities.length} établissement(s) trouvé(s) pour votre recherche.
              </p>
            </div>
            <Link to="/universities" className="flex items-center text-primary font-black hover:underline gap-2 group text-lg">
              Voir tout le catalogue 
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2 font-bold">arrow_forward</span>
            </Link>
          </div>

          {displayedUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in">
              {displayedUniversities.map(uni => (
                <div key={uni.id} className="bg-white dark:bg-surface-dark rounded-[40px] p-8 md:p-10 border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 group relative">
                  <div className="flex flex-col h-full space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                         <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 w-fit px-3 py-1 rounded-full">
                           {uni.type}
                         </span>
                         <div className="flex items-center gap-1 text-gray-400 font-bold text-sm">
                           <span className="material-symbols-outlined text-sm">location_on</span>
                           {uni.location}
                         </div>
                      </div>
                      <div className="size-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center p-2 border border-gray-100 dark:border-gray-800">
                        <img src={uni.logo} alt={uni.acronym} className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl md:text-3xl font-black text-[#0f1a13] dark:text-white leading-tight group-hover:text-primary transition-colors">
                        {uni.name}
                      </h3>
                      <p className="text-xl font-bold text-gray-300 dark:text-gray-600 uppercase tracking-tighter">{uni.acronym}</p>
                    </div>

                    <div className="pt-4 mt-auto">
                      <Link to={`/university/${uni.id}`} className="inline-flex items-center justify-center w-full py-5 bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black dark:text-white dark:hover:text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all border border-gray-100 dark:border-gray-800 group-hover:border-primary">
                        Voir les formations
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-[40px] border border-dashed border-gray-200 dark:border-gray-800">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
              <h3 className="text-2xl font-black dark:text-white">Aucun résultat trouvé</h3>
              <p className="text-gray-500 mt-2">Essayez d'ajuster vos critères de recherche.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-[1200px] mx-auto rounded-[48px] bg-[#0f1a13] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">Prêt à façonner votre avenir ?</h2>
            <p className="text-gray-400 text-lg font-medium">Rejoignez les milliers d'étudiants qui nous font confiance pour leur réussite académique.</p>
          </div>
          <div className="relative z-10 mt-10 md:mt-0">
            <Link to="/register" className="bg-primary hover:bg-green-400 text-[#0f1a13] font-black py-5 px-12 rounded-2xl text-lg transition-transform hover:scale-105 shadow-xl shadow-primary/20 inline-block">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
