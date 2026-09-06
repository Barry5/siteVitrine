import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Phone,
  ShieldCheck,
  Plane,
  Clock,
  CreditCard,
  PackageCheck,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

interface FAQItem {
  id: string;
  category: 'delays' | 'customs' | 'payment' | 'packaging';
  questionFr: string;
  questionEn: string;
  answerFr: string;
  answerEn: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'delais-vols',
    category: 'delays',
    questionFr: 'Quels sont les délais réels d’acheminement vers New York et Montréal ?',
    questionEn: 'What are the actual transit times to New York and Montreal?',
    answerFr:
      'Par fret aérien régulier, le délai moyen est de 3 à 5 jours ouvrés à compter du décollage du vol international depuis Conakry. Pour le fret maritime économique (conteneurs et gros volumes), comptez entre 25 et 35 jours selon les rotations portuaires. Chaque colis fait l’objet d’un suivi digital avec statut en direct.',
    answerEn:
      'Via regular air freight, average delivery takes 3 to 5 business days from the scheduled flight departure in Conakry. For economical ocean cargo (heavy boxes and commercial containers), expect 25 to 35 days depending on port calls. Every shipment has real-time digital tracking.',
  },
  {
    id: 'retrait-destination',
    category: 'delays',
    questionFr: 'Comment et où mon destinataire récupère-t-il le colis à l’arrivée ?',
    questionEn: 'How and where does my recipient collect the package on arrival?',
    answerFr:
      'Dès le dédouanement validé, votre destinataire reçoit un SMS et une notification WhatsApp avec l’adresse exacte du bureau de distribution (ex: notre hub du Bronx à New York ou notre antenne de Montréal). Le retrait s’effectue sur présentation d’une pièce d’identité en cours de validité et du numéro de bordereau THG.',
    answerEn:
      'Once customs clearance is completed, your recipient receives an SMS and WhatsApp notification with the exact pickup hub address (e.g., our Bronx hub in New York or Jean-Talon location in Montreal). Pickup requires a valid government-issued ID and the THG tracking number.',
  },
  {
    id: 'articles-interdits',
    category: 'customs',
    questionFr: 'Quels sont les produits interdits ou soumis à restriction ?',
    questionEn: 'Which items are prohibited or subject to restrictions?',
    answerFr:
      'Sont strictement prohibés : les liquides inflammables, batteries lithium non intégrées, aérosols sous pression, armes, contrefaçons et stupéfiants. Les produits vivriers locaux (feuilles de manioc séchées, soumbara, café) sont autorisés s’ils sont scellés et conditionnés sous vide certifié en agence.',
    answerEn:
      'Strictly prohibited: flammable liquids, standalone lithium batteries, pressurized aerosols, weapons, counterfeit goods, and narcotics. Dry local agricultural foods (dried cassava leaves, soumbara, ground coffee) are accepted when sealed and properly vacuum-packed at our branches.',
  },
  {
    id: 'emballage-securite',
    category: 'packaging',
    questionFr: 'Comment se passe l’emballage et le cerclage en agence ?',
    questionEn: 'How does packaging, weighing, and tamper-proofing work at the branch?',
    answerFr:
      'Chaque dépôt fait l’objet d’une pesée certifiée sur balance électronique étalonnée en présence de l’expéditeur. Nos équipes procèdent ensuite au cerclage renforcé, à la pose d’un film thermique inviolable et à l’étiquetage code-barres unique qui garantit l’intégrité du contenu.',
    answerEn:
      'Every parcel is weighed on a certified calibrated digital scale in front of the customer. Our logistics team then applies heavy-duty strapping, tamper-evident security wrap, and a unique barcode tracking sticker to guarantee zero tampering.',
  },
  {
    id: 'moyens-paiement',
    category: 'payment',
    questionFr: 'Quels sont les modes de règlement acceptés ?',
    questionEn: 'What payment methods are accepted?',
    answerFr:
      'En Guinée : Orange Money, MTN Mobile Money, virement bancaire et espèces au guichet de nos agences (Hamdallaye, Bentouraya, Kindia, Coyah, Kipé). À l’international (pour un paiement à la réception ou depuis la diaspora) : virements Zelle (USA), Interac (Canada) et virement bancaire direct.',
    answerEn:
      'In Guinea: Orange Money, MTN Mobile Money, bank transfer, and cash at all branches (Hamdallaye, Bentouraya, Kindia, Coyah, Kipé). Internationally (for diaspora or receiver payment): Zelle (USA), Interac e-Transfer (Canada), and standard wire transfers.',
  },
  {
    id: 'agences-interieur',
    category: 'packaging',
    questionFr: 'Puis-je déposer un colis depuis Kindia ou Coyah pour les USA ou le Canada ?',
    questionEn: 'Can I drop off a package from Kindia or Coyah for the USA or Canada?',
    answerFr:
      'Absolument. Nos agences régionales de Kindia (Gare Routière) et de Coyah (Carrefour Somayah) disposent de navettes quotidiennes sécurisées qui acheminent directement vos colis vers notre centre logistique de Conakry à temps pour le vol international programmé.',
    answerEn:
      'Yes, absolutely. Our regional branches in Kindia (Central Bus Station) and Coyah (Somayah Junction) run daily secure shuttles connecting directly to our Conakry flight consolidation hub in time for scheduled international departures.',
  },
  {
    id: 'achats-usa-guinee',
    category: 'delays',
    questionFr: 'Faites-vous également l’envoi dans le sens inverse (USA/Canada vers la Guinée) ?',
    questionEn: 'Do you also ship parcels in the reverse direction (USA/Canada to Guinea)?',
    answerFr:
      'Oui, nous assurons des arrivages réguliers en provenance d’Amérique du Nord vers la Guinée. Vous pouvez faire livrer vos commandes en ligne (Amazon, eBay, etc.) à nos entrepôts de New York ou de Montréal, et nous nous chargeons de leur transfert sécurisé jusqu’à Conakry.',
    answerEn:
      'Yes! We operate regular incoming freight from North America to Guinea. You can also ship your online orders (Amazon, eBay, suppliers) to our warehouses in New York or Montreal, and we handle safe transport and clearance to Conakry.',
  },
];

export const FAQSection: React.FC = () => {
  const { language } = useApp();
  const t = translations[language].faq;
  const [openId, setOpenId] = useState<string>('delais-vols');
  const [activeFilter, setActiveFilter] = useState<'all' | 'delays' | 'customs' | 'payment'>('all');

  const filteredItems = FAQ_DATA.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="faq" className="py-20 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] font-bold text-xs uppercase tracking-wider border border-red-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'fr' ? 'Toutes les questions' : 'All questions'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('delays')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'delays'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'fr' ? 'Délais & Réception' : 'Transit & Pickup'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('customs')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'customs'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'fr' ? 'Articles & Douanes' : 'Customs & Items'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('payment')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'payment'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'fr' ? 'Tarifs & Paiement' : 'Pricing & Payment'}
            </button>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  isOpen
                    ? 'border-[#C8102E]/40 bg-slate-50/60 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {language === 'fr' ? item.questionFr : item.questionEn}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-red-50 text-[#C8102E] rotate-180'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 pt-3 animate-fadeIn">
                    {language === 'fr' ? item.answerFr : item.answerEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Prompt Box with Secondary CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-[#FAF9F6] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-sm text-slate-900">
              {t.helpPrompt}
            </h4>
            <p className="text-xs text-slate-600">
              {language === 'fr'
                ? 'Nos conseillers logistiques vous répondent directement 7j/7 sur WhatsApp.'
                : 'Our logistics specialists answer 7 days a week directly on WhatsApp.'}
            </p>
          </div>

          <a
            href="https://wa.me/224611835683?text=Bonjour,%20j'ai%20une%20question%20sur%20les%20envois%20internationaux"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>{t.contactSupport}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
