import React, { useState } from 'react';
import {
  Lock,
  LogOut,
  LayoutDashboard,
  Megaphone,
  Globe2,
  Building2,
  Coins,
  MessageSquareHeart,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCcw,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Agency, DepartureAnnouncement, Destination, PricingRule, Testimonial } from '../types';

export const AdminPortal: React.FC = () => {
  const {
    isAdminAuthenticated,
    isAdminAuthChecking,
    loginAdmin,
    logoutAdmin,
    setCurrentView,
    announcements,
    agencies,
    destinations,
    pricingRules,
    testimonials,
    trackingItems,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementActive,
    addAgency,
    updateAgency,
    deleteAgency,
    addDestination,
    updateDestination,
    deleteDestination,
    updatePricingRule,
    addTestimonial,
    deleteTestimonial,
    resetAllData,
  } = useApp();

  // Auth form state
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'announcements' | 'destinations' | 'agencies' | 'pricing' | 'testimonials'
  >('dashboard');

  // Modal forms states
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [newAnn, setNewAnn] = useState({
    title: '',
    destination: 'New York (USA)',
    destinationCity: 'New York',
    departureDate: '2026-09-15',
    departureDayLabel: 'MARDI 15 SEPTEMBRE',
    badge: 'VOL CONFIRMÉ • DÉPÔTS OUVERTS',
    urgencyNote: 'Dépôts acceptés dans toutes nos agences de Conakry, Coyah & Kindia.',
    localOffices: ['Hamdallaye', 'Bentouraya', 'Kindia', 'Kipé'],
    isActive: true,
  });

  const [isAddingAgency, setIsAddingAgency] = useState(false);
  const [newAgency, setNewAgency] = useState({
    name: '',
    city: 'Conakry',
    address: '',
    landmark: '',
    phones: ['+224 6XX XX XX XX'],
    whatsapp: '+224 611 83 56 83',
    isInternational: false,
    hours: 'Lun - Sam : 08h00 - 18h00',
  });

  const [isAddingDest, setIsAddingDest] = useState(false);
  const [newDest, setNewDest] = useState({
    name: '',
    country: '',
    countryCode: 'US',
    flagEmoji: '✈️',
    estimatedAirDays: '3 à 5 jours',
    estimatedSeaDays: '25 à 30 jours',
    localContactName: '',
    localAddress: '',
    localPhone: '',
    nextScheduledFlight: 'Hebdomadaire',
    active: true,
  });

  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [newTest, setNewTest] = useState({
    author: '',
    city: '',
    destination: 'Guinée ➔ International',
    rating: 5,
    comment: '',
    // Non coché par défaut : ne cocher "vérifié" que si l'avis est
    // confirmé authentique (client réel, envoi retrouvé/tracé).
    verified: false,
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const result = await loginAdmin(passwordInput);
    setIsLoggingIn(false);
    if (result.success) {
      setAuthError(null);
      setPasswordInput('');
    } else {
      setAuthError(result.error || 'Mot de passe incorrect.');
    }
  };

  // Submit announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.departureDayLabel) return;
    addAnnouncement(newAnn);
    setIsAddingAnnouncement(false);
    setNewAnn({
      title: '',
      destination: 'New York (USA)',
      destinationCity: 'New York',
      departureDate: '2026-09-15',
      departureDayLabel: 'MARDI 15 SEPTEMBRE',
      badge: 'VOL CONFIRMÉ • DÉPÔTS OUVERTS',
      urgencyNote: 'Dépôts acceptés dans nos agences de Conakry, Coyah & Kindia.',
      localOffices: ['Hamdallaye', 'Bentouraya', 'Kindia', 'Kipé'],
      isActive: true,
    });
  };

  // Submit agency
  const handleCreateAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgency.name || !newAgency.address) return;
    addAgency(newAgency);
    setIsAddingAgency(false);
    setNewAgency({
      name: '',
      city: 'Conakry',
      address: '',
      landmark: '',
      phones: ['+224 6XX XX XX XX'],
      whatsapp: '+224 611 83 56 83',
      isInternational: false,
      hours: 'Lun - Sam : 08h00 - 18h00',
    });
  };

  // Submit destination
  const handleCreateDest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDest.name || !newDest.country) return;
    addDestination(newDest);
    setIsAddingDest(false);
    setNewDest({
      name: '',
      country: '',
      countryCode: 'XX',
      flagEmoji: '✈️',
      estimatedAirDays: '3 à 5 jours',
      estimatedSeaDays: '25 à 30 jours',
      localContactName: '',
      localAddress: '',
      localPhone: '',
      nextScheduledFlight: 'Hebdomadaire',
      active: true,
    });
  };

  // Submit testimonial
  const handleCreateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTest.author || !newTest.comment) return;
    addTestimonial(newTest);
    setIsAddingTestimonial(false);
    setNewTest({
      author: '',
      city: '',
      destination: 'Guinée ➔ International',
      rating: 5,
      comment: '',
      verified: false,
    });
  };

  // 0. Vérification de la session en cours auprès du backend
  if (isAdminAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <span className="text-xs text-slate-400">Vérification de la session…</span>
      </div>
    );
  }

  // 1. If not authenticated, show modern login view
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Logo variant="dark" size="lg" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800">
              <Lock className="w-3.5 h-3.5" />
              <span>Espace Restreint Gestionnaire</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Administration Thiaguil
            </h2>
            <p className="text-xs text-slate-300">
              Gérez les départs de vols, les tarifs du simulateur, les agences et les destinations en temps réel.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Mot de passe d'administration
              </label>
              <input
                id="admin-password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Entrez votre mot de passe..."
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-700 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-brand hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {isLoggingIn ? 'Connexion en cours...' : "Se connecter à l'espace admin"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={() => setCurrentView('public')}
              type="button"
              className="w-full text-center text-xs text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retourner au site vitrine public</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo variant="dark" size="sm" />
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                Console Admin
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('public')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voir le Site Public</span>
              </button>

              <button
                onClick={logoutAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold transition-colors cursor-pointer border border-red-800"
                title="Fermer la session admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-slate-950 border-t border-slate-800 px-4 sm:px-8 overflow-x-auto">
          <div className="flex items-center space-x-1 sm:space-x-2 py-2 min-w-max text-xs font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-brand text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Tableau de bord</span>
            </button>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'announcements' ? 'bg-brand text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Annonces & Départs ({announcements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('destinations')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'destinations' ? 'bg-brand text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Destinations ({destinations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('agencies')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'agencies' ? 'bg-brand text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Agences ({agencies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pricing' ? 'bg-brand text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Tarifs Simulateur ({pricingRules.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'testimonials' ? 'bg-brand text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>Témoignages ({testimonials.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* =========================================================================
            TAB 1: DASHBOARD OVERVIEW
           ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Annonces de Départs Actives
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-brand font-display">
                    {announcements.filter((a) => a.isActive).length}
                  </span>
                  <span className="text-xs text-slate-600">Sur {announcements.length} total</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Agences & Bureaux
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-display">
                    {agencies.length}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">6 locales + 2 intl</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Destinations Desservies
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-display">
                    {destinations.length}
                  </span>
                  <span className="text-xs text-slate-600">USA, Canada, Europe</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Recherches de Suivi ce Mois
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-blue-600 font-display">
                    1 428
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">+18% vs m-1</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Announcement Publisher */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-brand" />
                    <span>Derniers départs programmés sur le site</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    Gérer tout ➔
                  </button>
                </div>

                <div className="space-y-2.5">
                  {announcements.slice(0, 3).map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {ann.departureDayLabel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ann.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {ann.isActive ? 'Affiché sur le site' : 'Masqué'}
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium truncate max-w-md">
                          {ann.title} • {ann.destination}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleAnnouncementActive(ann.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          ann.isActive
                            ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {ann.isActive ? 'Masquer' : 'Activer'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance & Reset Tool */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-2">
                    Synchronisation Locale
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Toutes les modifications saisies ici (tarifs, agences, départs) sont enregistrées immédiatement dans votre navigateur et s'affichent instantanément sur le site vitrine.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous restaurer les données d\'origine ?')) {
                        resetAllData();
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <RefreshCcw className="w-3.5 h-3.5 text-brand" />
                    <span>Réinitialiser aux valeurs d'origine</span>
                  </button>

                  <p className="text-[10px] text-slate-600 text-center">
                    Utile pour réinitialiser la démo avec les affiches Facebook réelles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ANNOUNCEMENTS & DEPARTURES (Like the Facebook posters)
           ========================================================================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Gestion des Annonces de Départs Spéciaux
                </h3>
                <p className="text-xs text-slate-600">
                  Publiez directement les départs (New York, Montréal, etc.) comme sur vos affiches Facebook. Ces annonces s'affichent dans la barre supérieure et dans la Hero section.
                </p>
              </div>

              <button
                onClick={() => setIsAddingAnnouncement(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Créer un avis de départ</span>
              </button>
            </div>

            {/* Creation Modal / Inline Drawer */}
            {isAddingAnnouncement && (
              <div className="bg-white p-6 rounded-3xl border-2 border-brand shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Nouveau Départ Programmé
                  </h4>
                  <button
                    onClick={() => setIsAddingAnnouncement(false)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Titre de l'annonce *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: ENVOI DE COLIS À NEW YORK"
                        value={newAnn.title}
                        onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Jour de départ affiché en grand (ex: MARDI 01 SEPTEMBRE) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: JEUDI 27 AOÛT"
                        value={newAnn.departureDayLabel}
                        onChange={(e) => setNewAnn({ ...newAnn, departureDayLabel: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Ville de destination
                      </label>
                      <input
                        type="text"
                        required
                        value={newAnn.destinationCity}
                        onChange={(e) => setNewAnn({ ...newAnn, destinationCity: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Date ISO
                      </label>
                      <input
                        type="date"
                        value={newAnn.departureDate}
                        onChange={(e) => setNewAnn({ ...newAnn, departureDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Badge d'urgence
                      </label>
                      <input
                        type="text"
                        value={newAnn.badge}
                        onChange={(e) => setNewAnn({ ...newAnn, badge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Note informative / Agences concernées
                    </label>
                    <input
                      type="text"
                      value={newAnn.urgencyNote}
                      onChange={(e) => setNewAnn({ ...newAnn, urgencyNote: e.target.value })}
                      placeholder="Ex: Dépôts acceptés à Hamdallaye, Bentouraya, Kindia..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAnnouncement(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold cursor-pointer"
                    >
                      Publier l'avis de départ
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of Announcements */}
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-5 rounded-3xl bg-white border transition-all ${
                    ann.isActive ? 'border-slate-300 shadow-sm' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900">
                          {ann.departureDayLabel}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            ann.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {ann.isActive ? 'En ligne' : 'Masqué'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-50 text-brand text-[10px] font-bold">
                          {ann.destinationCity}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-800">{ann.title}</h4>
                      <p className="text-xs text-slate-600">{ann.urgencyNote}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleAnnouncementActive(ann.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          ann.isActive
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {ann.isActive ? 'Masquer' : 'Activer'}
                      </button>

                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Supprimer cette annonce"
                        aria-label="Supprimer cette annonce"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: DESTINATIONS
           ========================================================================= */}
        {activeTab === 'destinations' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Gestion des Villes & Destinations Internationales
                </h3>
                <p className="text-xs text-slate-600">
                  Configurez les villes desservies, les délais moyens et les coordonnées des points de retrait locaux.
                </p>
              </div>

              <button
                onClick={() => setIsAddingDest(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une destination</span>
              </button>
            </div>

            {/* Add Destination Form */}
            {isAddingDest && (
              <div className="bg-white p-6 rounded-3xl border-2 border-brand shadow-xl space-y-4 animate-fadeIn text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Ajouter une nouvelle destination
                  </h4>
                  <button
                    onClick={() => setIsAddingDest(false)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateDest} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Nom de la ville *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Philadelphie"
                        value={newDest.name}
                        onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Pays *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: États-Unis"
                        value={newDest.country}
                        onChange={(e) => setNewDest({ ...newDest, country: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Emoji Drapeau
                      </label>
                      <input
                        type="text"
                        placeholder="🇺🇸"
                        value={newDest.flagEmoji}
                        onChange={(e) => setNewDest({ ...newDest, flagEmoji: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-center text-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Délai estimé Aérien
                      </label>
                      <input
                        type="text"
                        value={newDest.estimatedAirDays}
                        onChange={(e) => setNewDest({ ...newDest, estimatedAirDays: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Contact / Téléphone local
                      </label>
                      <input
                        type="text"
                        value={newDest.localPhone}
                        onChange={(e) => setNewDest({ ...newDest, localPhone: e.target.value })}
                        placeholder="+1 (XXX) XXX-XXXX"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingDest(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold cursor-pointer"
                    >
                      Enregistrer la destination
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of Destinations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dest.flagEmoji}</span>
                        <div>
                          <h4 className="font-extrabold text-base text-slate-900">{dest.name}</h4>
                          <span className="text-xs text-slate-600 font-medium">{dest.country}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteDestination(dest.id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Supprimer cette destination"
                        aria-label="Supprimer cette destination"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Délai Aérien :</span>
                        <span className="font-bold text-slate-900">{dest.estimatedAirDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Délai Maritime :</span>
                        <span className="font-bold text-slate-900">{dest.estimatedSeaDays}</span>
                      </div>
                      {dest.localPhone && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Téléphone local :</span>
                          <span className="font-bold text-emerald-700 font-mono">{dest.localPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: AGENCIES
           ========================================================================= */}
        {activeTab === 'agencies' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Gestion des Agences & Points de Dépôt
                </h3>
                <p className="text-xs text-slate-600">
                  Gérez les coordonnées, horaires et numéros directs des agences de Conakry, Kindia, Coyah et de l'international.
                </p>
              </div>

              <button
                onClick={() => setIsAddingAgency(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une agence</span>
              </button>
            </div>

            {/* Agency Form */}
            {isAddingAgency && (
              <div className="bg-white p-6 rounded-3xl border-2 border-brand shadow-xl space-y-4 animate-fadeIn text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Ajouter une agence
                  </h4>
                  <button
                    onClick={() => setIsAddingAgency(false)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateAgency} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Nom de l'agence *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Agence Dixinn"
                        value={newAgency.name}
                        onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Ville / Zone *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Conakry"
                        value={newAgency.city}
                        onChange={(e) => setNewAgency({ ...newAgency, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Adresse complète & Repère
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carrefour terrasse, en face de la pharmacie"
                      value={newAgency.address}
                      onChange={(e) => setNewAgency({ ...newAgency, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Numéro(s) de téléphone
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+224 6XX XX XX XX"
                        value={newAgency.phones[0]}
                        onChange={(e) => setNewAgency({ ...newAgency, phones: [e.target.value] })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Horaires d'ouverture
                      </label>
                      <input
                        type="text"
                        value={newAgency.hours}
                        onChange={(e) => setNewAgency({ ...newAgency, hours: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAgency(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold cursor-pointer"
                    >
                      Enregistrer l'agence
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of Agencies */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencies.map((agency) => (
                <div
                  key={agency.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">{agency.name}</span>
                      <button
                        onClick={() => deleteAgency(agency.id)}
                        className="p-1 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Supprimer cette agence"
                        aria-label="Supprimer cette agence"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-slate-600">{agency.address}</p>
                    <div className="font-mono text-slate-900 font-bold">
                      {agency.phones.join(' / ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: PRICING & SIMULATOR
           ========================================================================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-5 rounded-3xl border border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">
                Grille Tarifaire du Simulateur
              </h3>
              <p className="text-xs text-slate-600">
                Ajustez le prix par kilogramme (Fret Aérien et Fret Maritime) ainsi que le forfait enveloppe. Ces montants sont immédiatement pris en compte par le simulateur public.
              </p>
            </div>

            <div className="space-y-4">
              {pricingRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand"></span>
                      Ligne : {rule.destinationName}
                    </h4>
                    <span className="text-[11px] font-bold text-slate-600">
                      Modifiable en direct
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">
                        Forfait Enveloppe / Documents
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="10000"
                          value={rule.envelopePriceGnf}
                          onChange={(e) =>
                            updatePricingRule(rule.id, { envelopePriceGnf: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                        />
                        <span className="font-bold text-slate-600 text-[11px]">GNF</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">
                        Prix au Kg (Fret Aérien)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="5000"
                          value={rule.pricePerKgAirGnf}
                          onChange={(e) =>
                            updatePricingRule(rule.id, { pricePerKgAirGnf: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-brand"
                        />
                        <span className="font-bold text-slate-600 text-[11px]">GNF/kg</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">
                        Prix au Kg (Fret Maritime)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="5000"
                          value={rule.pricePerKgSeaGnf}
                          onChange={(e) =>
                            updatePricingRule(rule.id, { pricePerKgSeaGnf: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-cyan-700"
                        />
                        <span className="font-bold text-slate-600 text-[11px]">GNF/kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: TESTIMONIALS
           ========================================================================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Modération des Témoignages & Avis Clients
                </h3>
                <p className="text-xs text-slate-600">
                  Ajoutez les retours d'expérience positifs reçus sur WhatsApp ou Facebook pour enrichir la crédibilité du site.
                </p>
              </div>

              <button
                onClick={() => setIsAddingTestimonial(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un avis</span>
              </button>
            </div>

            {/* Testimonial Form */}
            {isAddingTestimonial && (
              <div className="bg-white p-6 rounded-3xl border-2 border-brand shadow-xl space-y-4 animate-fadeIn text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Ajouter un avis client
                  </h4>
                  <button
                    onClick={() => setIsAddingTestimonial(false)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateTestimonial} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Nom de l'auteur *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Thierno Diallo"
                        value={newTest.author}
                        onChange={(e) => setNewTest({ ...newTest, author: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Ville de l'auteur
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Montréal (QC)"
                        value={newTest.city}
                        onChange={(e) => setNewTest({ ...newTest, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Témoignage du client *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Commentaire du client..."
                      value={newTest.comment}
                      onChange={(e) => setNewTest({ ...newTest, comment: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Note donnée par le client
                      </label>
                      <select
                        value={newTest.rating}
                        onChange={(e) => setNewTest({ ...newTest, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                      >
                        <option value={5}>5 étoiles — Excellent</option>
                        <option value={4}>4 étoiles — Très bien</option>
                        <option value={3}>3 étoiles — Correct</option>
                        <option value={2}>2 étoiles — Décevant</option>
                        <option value={1}>1 étoile — Insatisfaisant</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTest.verified}
                        onChange={(e) => setNewTest({ ...newTest, verified: e.target.checked })}
                        className="w-4 h-4 accent-brand cursor-pointer"
                      />
                      <span className="font-bold text-slate-700 normal-case text-[11px] leading-tight">
                        Avis vérifié — à cocher uniquement si le client et son envoi sont confirmés authentiques
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingTestimonial(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold cursor-pointer"
                    >
                      Publier l'avis
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((test) => (
                <div
                  key={test.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between text-xs space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">{test.author}</span>
                      <button
                        onClick={() => deleteTestimonial(test.id)}
                        className="p-1 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Supprimer ce témoignage"
                        aria-label="Supprimer ce témoignage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-600 block">{test.city}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">{'★'.repeat(test.rating)}{'☆'.repeat(5 - test.rating)}</span>
                      {test.verified ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Vérifié
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          Non vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 italic">« {test.comment} »</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
