import React from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

type LegalPageKey = 'mentions-legales' | 'confidentialite' | 'cgv';

interface LegalPageProps {
  page: LegalPageKey;
}

interface LegalSection {
  heading: string;
  body: string;
  /** Section content that is explicitly incomplete — a real gap, not invented. */
  pending?: boolean;
}

interface LegalContent {
  title: string;
  intro: string;
  sections: LegalSection[];
}

// Tout le contenu ci-dessous ne reprend que des faits déjà présents ailleurs
// sur le site (adresse, téléphone, domaine, champs réellement collectés par
// le formulaire de contact — voir server/routes/contact.ts). Les quelques
// informations juridiques que nous n'avons pas (forme juridique, numéro
// d'immatriculation, hébergeur) sont marquées explicitement "à compléter"
// plutôt qu'inventées.
const CONTENT: Record<LegalPageKey, Record<'fr' | 'en', LegalContent>> = {
  'mentions-legales': {
    fr: {
      title: 'Mentions légales',
      intro: 'Informations relatives à l\'éditeur de ce site, conformément aux usages en vigueur.',
      sections: [
        {
          heading: 'Éditeur du site',
          body: 'Thiaguil Multi-Services — Service d\'emballage et d\'expédition de colis à l\'international.\nAdresse : Carrefour Concasseur, Hamdallaye, Commune de Ratoma, Conakry, Guinée.\nTéléphone / WhatsApp : +224 611 83 56 83\nSite : colisthiaguil.com',
        },
        {
          heading: 'Statut juridique et immatriculation',
          body: 'Forme juridique et numéro d\'immatriculation (RCCM / NIF) : à compléter par l\'entreprise. Ces informations n\'ont pas encore été communiquées et seront ajoutées dès qu\'elles seront disponibles.',
          pending: true,
        },
        {
          heading: 'Hébergement du site',
          body: 'Nom et coordonnées de l\'hébergeur : à compléter.',
          pending: true,
        },
        {
          heading: 'Directeur de la publication',
          body: 'Thiaguil Multi-Services.',
        },
        {
          heading: 'Propriété intellectuelle',
          body: 'L\'ensemble des contenus présents sur ce site (textes, logo, mise en page) est la propriété de Thiaguil Multi-Services, sauf mention contraire. Toute reproduction sans autorisation préalable est interdite.',
        },
        {
          heading: 'Contact',
          body: 'Pour toute question relative au site, utilisez le formulaire de contact ou joignez-nous par téléphone/WhatsApp au +224 611 83 56 83.',
        },
      ],
    },
    en: {
      title: 'Legal Notice',
      intro: 'Information about the publisher of this website.',
      sections: [
        {
          heading: 'Website publisher',
          body: 'Thiaguil Multi-Services — International parcel packaging and shipping service.\nAddress: Carrefour Concasseur, Hamdallaye, Ratoma District, Conakry, Guinea.\nPhone / WhatsApp: +224 611 83 56 83\nWebsite: colisthiaguil.com',
        },
        {
          heading: 'Legal status and registration',
          body: 'Legal form and registration number (RCCM / NIF): to be completed by the company. This information has not yet been provided and will be added once available.',
          pending: true,
        },
        {
          heading: 'Website hosting',
          body: 'Hosting provider name and contact details: to be completed.',
          pending: true,
        },
        {
          heading: 'Publication director',
          body: 'Thiaguil Multi-Services.',
        },
        {
          heading: 'Intellectual property',
          body: 'All content on this site (text, logo, layout) is the property of Thiaguil Multi-Services unless stated otherwise. Reproduction without prior authorization is prohibited.',
        },
        {
          heading: 'Contact',
          body: 'For any question about this website, use the contact form or reach us by phone/WhatsApp at +224 611 83 56 83.',
        },
      ],
    },
  },
  confidentialite: {
    fr: {
      title: 'Politique de confidentialité',
      intro: 'Ce que nous collectons via ce site, pourquoi, et comment vous pouvez exercer vos droits.',
      sections: [
        {
          heading: 'Données collectées',
          body: 'Lorsque vous utilisez le formulaire de contact, nous collectons : votre nom complet, votre numéro de téléphone, votre adresse email (si vous la renseignez), l\'agence de dépôt choisie, la destination et le message que vous rédigez.',
        },
        {
          heading: 'Utilisation de vos données',
          body: 'Ces informations servent uniquement à traiter votre demande d\'expédition et à vous recontacter. Elles sont transmises par email à notre équipe et ne sont pas enregistrées dans une base de données sur ce site.',
        },
        {
          heading: 'Cookies',
          body: 'Notre espace de gestion interne dépose un cookie technique (thg_admin_session), strictement nécessaire à l\'authentification de notre équipe et jamais utilisé à des fins de suivi publicitaire. Aucun cookie de mesure d\'audience ou publicitaire tiers n\'est actif sur le site à ce jour ; cette page sera mise à jour si cela change.',
        },
        {
          heading: 'Durée de conservation',
          body: 'Durée précise de conservation des demandes reçues par email : à préciser par l\'entreprise. Non formellement définie à ce jour.',
          pending: true,
        },
        {
          heading: 'Vos droits',
          body: 'Vous pouvez demander l\'accès, la rectification ou la suppression de vos données en nous contactant via le formulaire de contact ou par téléphone/WhatsApp au +224 611 83 56 83.',
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      intro: 'What we collect through this website, why, and how you can exercise your rights.',
      sections: [
        {
          heading: 'Data we collect',
          body: 'When you use the contact form, we collect: your full name, phone number, email address (if provided), the chosen drop-off branch, the destination, and the message you write.',
        },
        {
          heading: 'How your data is used',
          body: 'This information is used only to process your shipping request and get back to you. It is sent by email to our team and is not stored in a database on this site.',
        },
        {
          heading: 'Cookies',
          body: 'Our internal management area sets one technical cookie (thg_admin_session), strictly necessary for our team\'s authentication and never used for advertising tracking. No third-party analytics or advertising cookie is active on the site today; this page will be updated if that changes.',
        },
        {
          heading: 'Retention period',
          body: 'Exact retention period for requests received by email: to be specified by the company. Not formally defined at this time.',
          pending: true,
        },
        {
          heading: 'Your rights',
          body: 'You may request access to, correction of, or deletion of your data by contacting us via the contact form or by phone/WhatsApp at +224 611 83 56 83.',
        },
      ],
    },
  },
  cgv: {
    fr: {
      title: 'Conditions générales de vente',
      intro: 'Modalités de la prestation de transport et d\'expédition de colis proposée par Thiaguil Multi-Services.',
      sections: [
        {
          heading: 'Objet',
          body: 'Les présentes conditions décrivent les modalités de la prestation de transport et d\'expédition de colis proposée par Thiaguil Multi-Services entre la Guinée et les destinations internationales desservies.',
        },
        {
          heading: 'Tarification',
          body: 'Les tarifs indicatifs sont accessibles via le simulateur d\'envoi du site. Le tarif définitif est confirmé lors du dépôt du colis en agence, après pesée certifiée.',
        },
        {
          heading: 'Modalités de paiement',
          body: 'En Guinée : Orange Money, MTN Mobile Money, virement bancaire et espèces au guichet de nos agences. À l\'international : Zelle (USA), Interac e-Transfer (Canada) et virement bancaire direct.',
        },
        {
          heading: 'Délais',
          body: 'Les délais annoncés (3 à 5 jours ouvrés par fret aérien, 25 à 35 jours par fret maritime) sont indicatifs et peuvent varier selon les rotations et les formalités douanières.',
        },
        {
          heading: 'Colis perdu ou endommagé',
          body: 'Chaque signalement est étudié au cas par cas — voir la question dédiée dans notre FAQ. Nous ne disposons pas à ce jour d\'une police d\'assurance formalisée sur les envois.',
        },
        {
          heading: 'Réclamations',
          body: 'Toute réclamation doit être adressée à l\'agence de dépôt ou via notre service WhatsApp au +224 611 83 56 83, dans les meilleurs délais suivant la constatation du problème.',
        },
      ],
    },
    en: {
      title: 'Terms of Service',
      intro: 'Terms of the parcel transport and shipping service offered by Thiaguil Multi-Services.',
      sections: [
        {
          heading: 'Purpose',
          body: 'These terms describe the parcel transport and shipping service offered by Thiaguil Multi-Services between Guinea and the international destinations it serves.',
        },
        {
          heading: 'Pricing',
          body: 'Indicative rates are available through the site\'s shipping calculator. The final rate is confirmed when the parcel is dropped off at a branch, after certified weighing.',
        },
        {
          heading: 'Payment methods',
          body: 'In Guinea: Orange Money, MTN Mobile Money, bank transfer, and cash at our branches. Internationally: Zelle (USA), Interac e-Transfer (Canada), and direct bank transfer.',
        },
        {
          heading: 'Delivery times',
          body: 'Announced timeframes (3 to 5 business days by air freight, 25 to 35 days by sea freight) are indicative and may vary depending on flight/shipping schedules and customs procedures.',
        },
        {
          heading: 'Lost or damaged parcels',
          body: 'Every report is reviewed case by case — see the dedicated question in our FAQ. We do not currently have a formal insurance policy on shipments.',
        },
        {
          heading: 'Complaints',
          body: 'Any complaint should be addressed to the drop-off branch or via our WhatsApp support at +224 611 83 56 83, as soon as possible after the issue is noticed.',
        },
      ],
    },
  },
};

const NAV_ITEMS: { key: LegalPageKey; fr: string; en: string }[] = [
  { key: 'mentions-legales', fr: 'Mentions légales', en: 'Legal Notice' },
  { key: 'confidentialite', fr: 'Confidentialité', en: 'Privacy Policy' },
  { key: 'cgv', fr: 'CGV', en: 'Terms of Service' },
];

export const LegalPage: React.FC<LegalPageProps> = ({ page }) => {
  const { language, setCurrentView } = useApp();
  const content = CONTENT[page][language];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setCurrentView('public')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? "Retour à l'accueil" : 'Back to homepage'}</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {content.title}
        </h1>
        <p className="text-slate-600 text-sm mb-10">{content.intro}</p>

        <div className="space-y-8">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-extrabold text-sm text-slate-900 mb-2">{section.heading}</h2>
              {section.pending && (
                <div className="inline-flex items-center gap-1.5 mb-2 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wide">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{language === 'fr' ? 'Information à compléter' : 'Pending information'}</span>
                </div>
              )}
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-slate-200 flex flex-wrap gap-4">
          {NAV_ITEMS.filter((item) => item.key !== page).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setCurrentView(item.key);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-brand hover:underline cursor-pointer"
            >
              {language === 'fr' ? item.fr : item.en}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
