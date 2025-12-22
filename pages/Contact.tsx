
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulation d'envoi
    setTimeout(() => {
      setFormState('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="bg-background-dark py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary rounded-full blur-[80px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-primary font-black uppercase tracking-widest text-xs bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
            Support & Assistance
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Comment pouvons-nous <br /> vous aider ?
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            L'équipe de EDEN Communication et Services est à votre écoute pour vous accompagner dans votre projet d'études au Bénin.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4 -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="https://wa.me/22900000000" target="_blank" rel="noreferrer" className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group hover:border-primary transition-all hover:-translate-y-2">
            <div className="size-16 rounded-2xl bg-green-100 dark:bg-green-500/10 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl font-bold">chat</span>
            </div>
            <h3 className="text-xl font-black dark:text-white mb-2">WhatsApp</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Réponse instantanée pour vos questions urgentes.</p>
            <span className="text-primary font-bold">+229 XX XX XX XX</span>
          </a>

          <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group hover:border-primary transition-all hover:-translate-y-2">
            <div className="size-16 rounded-2xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl font-bold">mail</span>
            </div>
            <h3 className="text-xl font-black dark:text-white mb-2">Email</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Pour les demandes de partenariat ou dossiers complexes.</p>
            <span className="text-primary font-bold">contact@etudieraudbenin.com</span>
          </div>

          <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group hover:border-primary transition-all hover:-translate-y-2">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl font-bold">location_on</span>
            </div>
            <h3 className="text-xl font-black dark:text-white mb-2">Bureaux</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Situés au cœur de Cotonou pour vous recevoir.</p>
            <span className="text-primary font-bold">Cotonou, Bénin</span>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Info */}
      <section className="py-20 px-4 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-[#0f1a13] dark:text-white tracking-tight leading-tight">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                Remplissez ce formulaire et un expert en orientation de <span className="text-primary font-bold">EDEN Communication</span> vous recontactera sous 24h ouvrées.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="size-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">verified</span>
                </div>
                <div>
                  <h4 className="font-black dark:text-white">Expertise Reconnue</h4>
                  <p className="text-sm text-gray-500">Plus de 5 ans d'accompagnement académique au Bénin.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">lock</span>
                </div>
                <div>
                  <h4 className="font-black dark:text-white">Confidentialité</h4>
                  <p className="text-sm text-gray-500">Vos données personnelles sont protégées et sécurisées.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-surface-dark p-8 md:p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm relative">
            {formState === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-6 animate-fade-in">
                <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-5xl font-bold">check_circle</span>
                </div>
                <h3 className="text-2xl font-black dark:text-white">Message envoyé !</h3>
                <p className="text-gray-500">Merci de nous avoir contactés. Nous reviendrons vers vous très prochainement.</p>
                <button 
                  onClick={() => setFormState('idle')}
                  className="bg-primary text-black font-black px-8 py-3 rounded-xl hover:scale-105 transition-all"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nom Complet</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Jean Dupont"
                      className="w-full bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="jean@exemple.com"
                      className="w-full bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Sujet</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="Demande d'orientation"
                    className="w-full bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Dites-nous en plus sur votre projet..."
                    className="w-full bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  disabled={formState === 'submitting'}
                  type="submit"
                  className="w-full bg-primary hover:bg-green-400 disabled:opacity-50 text-[#0f1a13] font-black py-4 rounded-2xl text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {formState === 'submitting' ? (
                    <>
                      <span className="animate-spin size-5 border-2 border-black/20 border-t-black rounded-full"></span>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <span className="material-symbols-outlined">send</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
