
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../CMSContext';

const AdminDashboard: React.FC = () => {
  const { 
    applications, universities, majors, deleteUniversity, addUniversity, refreshData, logout, user, isLoading
  } = useCMS();
  
  const [activeTab, setActiveTab] = useState<'universities' | 'applications'>('applications');
  const [showAddUni, setShowAddUni] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role === 'student') navigate('/login');
    else refreshData();
  }, [user]);

  const handleAddUniversity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await addUniversity({
      name: fd.get('name'),
      acronym: fd.get('acronym'),
      location: fd.get('city'),
      type: fd.get('type'),
      description: fd.get('desc')
    });
    setShowAddUni(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-background-dark font-display flex flex-col">
      <header className="bg-white dark:bg-surface-dark px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-black font-black">AD</div>
            <h1 className="text-xl font-black dark:text-white uppercase tracking-tighter">Console Admin</h1>
         </div>
         <div className="flex gap-4">
           <button onClick={() => { logout(); navigate('/login'); }} className="text-red-500 font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-red-50 dark:hover:bg-white/5 rounded-xl transition-all">Déconnexion</button>
         </div>
      </header>

      <main className="p-8 lg:p-12 space-y-10">
        <div className="flex gap-4 p-1.5 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/10 w-fit">
          <button onClick={() => setActiveTab('applications')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-primary text-black' : 'text-gray-400'}`}>Candidatures</button>
          <button onClick={() => setActiveTab('universities')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'universities' ? 'bg-primary text-black' : 'text-gray-400'}`}>Établissements</button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-widest animate-pulse">
            <span className="material-symbols-outlined animate-spin">refresh</span>
            Mise à jour du catalogue...
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 gap-4">
             {applications.map(app => (
               <div key={app.id} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">#{app.id}</p>
                    <h4 className="text-lg font-black dark:text-white">{app.studentName || 'Candidat'}</h4>
                    <p className="text-xs font-bold text-gray-500">{app.majorName} • {app.universityName}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase ${app.status === 'Validé' ? 'bg-primary/10 text-primary' : 'bg-amber-400/10 text-amber-500'}`}>{app.status}</span>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'universities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Établissements ({universities.length})</h2>
               <button onClick={() => setShowAddUni(true)} className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Ajouter un établissement</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {universities.map(uni => (
                 <div key={uni.id} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="size-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center p-2 border border-gray-100 dark:border-white/10">
                         <img src={uni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=100'} className="max-w-full max-h-full object-contain opacity-50" alt="" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-black dark:text-white">{uni.acronym}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{uni.location}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteUniversity(uni.id)} className="size-10 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all">
                       <span className="material-symbols-outlined">delete</span>
                    </button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>

      {showAddUni && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
           <form onSubmit={handleAddUniversity} className="bg-[#162a1f] w-full max-w-xl rounded-[40px] p-10 space-y-8 border border-white/5 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-2xl font-black text-white tracking-tight">Nouvel établissement</h3>
              <div className="space-y-4">
                 <input name="name" required placeholder="Nom complet" className="w-full bg-white/5 border-none p-4 rounded-xl text-white font-bold" />
                 <input name="acronym" required placeholder="Acronyme (ex: UAC)" className="w-full bg-white/5 border-none p-4 rounded-xl text-white font-bold" />
                 <input name="city" required placeholder="Ville (ex: Cotonou)" className="w-full bg-white/5 border-none p-4 rounded-xl text-white font-bold" />
                 <select name="type" className="w-full bg-white/5 border-none p-4 rounded-xl text-white font-bold appearance-none">
                    <option value="public" className="bg-[#162a1f]">Public</option>
                    <option value="privé" className="bg-[#162a1f]">Privé</option>
                 </select>
                 <textarea name="desc" placeholder="Description courte" className="w-full bg-white/5 border-none p-4 rounded-xl text-white font-bold h-32 resize-none" />
              </div>
              <div className="flex gap-4">
                 <button type="button" onClick={() => setShowAddUni(false)} className="flex-1 py-4 text-gray-400 font-black uppercase text-xs">Annuler</button>
                 <button type="submit" className="flex-1 py-4 bg-primary text-black font-black rounded-xl uppercase text-xs shadow-xl shadow-primary/20">Enregistrer</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
