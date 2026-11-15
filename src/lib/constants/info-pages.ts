import type { Locale } from "@/i18n/routing";
import { siteConfig } from "./site";

// Content of informational & legal pages, per locale.
// IMPORTANT: legal texts (CGV, mentions légales, confidentialité, cookies) must be
// written or validated by the client's legal advisor before launch.
// To add a page: add its slug to `infoPageSlugs` and its content in every locale below.

export interface InfoSection {
  /** Optional anchor, e.g. "retours" -> /livraison#retours */
  id?: string;
  heading: string;
  body: string[];
}

export interface InfoPage {
  title: string;
  description: string;
  sections: InfoSection[];
  legal?: boolean;
}

export const infoPageSlugs = ["a-propos", "contact", "faq", "livraison", "cgv", "mentions-legales", "confidentialite", "cookies"] as const;
export type InfoPageSlug = (typeof infoPageSlugs)[number];

const { name, contact, workshop, returns } = siteConfig;

const pendingFr = "Contenu à fournir par le client (rédigé ou validé par son conseiller juridique).";
const pendingEn = "Content to be provided by the client (written or approved by their legal advisor).";

const fr: Record<InfoPageSlug, InfoPage> = {
  "a-propos": {
    title: "À propos",
    description: `${name}, votre boutique de pneus en ligne.`,
    sections: [
      {
        heading: "Notre mission",
        body: [
          `${name} propose des pneus été, hiver et 4 saisons des grandes marques et de marques à petit prix, livrés partout en France métropolitaine.`,
          "Notre recherche par dimension (largeur, hauteur, diamètre) vous aide à trouver les bons pneus, du premier coup.",
          `Vous pouvez faire monter et équilibrer vos pneus chez notre atelier partenaire ${workshop.name}, à Barr.`,
        ],
      },
    ],
  },
  contact: {
    title: "Nous contacter",
    description: "Une question sur un pneu ou une commande ? Notre équipe vous répond.",
    sections: [
      { heading: "Service client", body: [`Téléphone : ${contact.phone}`, `E-mail : ${contact.email}`, `Adresse : ${contact.address}`, "Du lundi au vendredi, 9h – 18h"] },
      { heading: "Montage à Barr", body: [workshop.name, workshop.address, workshop.directions] },
      { heading: "Avant de nous écrire", body: ["Merci d'indiquer votre numéro de commande et la dimension de vos pneus (par ex. 205/55 R16)."] },
    ],
  },
  faq: {
    title: "Questions fréquentes",
    description: "Les réponses aux questions les plus fréquentes sur nos pneus, la livraison et le montage.",
    sections: [
      { heading: "Où lire la dimension de mon pneu ?", body: ["Sur le flanc du pneu, par exemple 205/55 R16 91V : 205 = largeur (mm), 55 = hauteur du flanc (% de la largeur), R16 = diamètre de jante (pouces), 91 = indice de charge, V = indice de vitesse."] },
      { heading: "Combien de pneus dois-je changer ?", body: ["Idéalement par paire sur un même essieu, ou les 4 en même temps pour un comportement homogène."] },
      { heading: "Où faire monter mes pneus ?", body: [`Chez notre atelier partenaire ${workshop.name}, ${workshop.address}, ou dans le garage de votre choix.`] },
      { heading: "Puis-je retourner des pneus ?", body: [`Oui, vous disposez de ${returns.days} jours pour exercer votre droit de rétractation, pour des pneus non montés.`] },
    ],
  },
  livraison: {
    title: "Livraison & retours",
    description: "Délais, frais de livraison et conditions de retour.",
    sections: [
      { heading: "Livraison", body: ["Livraison à domicile partout en France métropolitaine. Le prix affiché pour chaque pneu inclut la livraison.", "Le délai d'expédition est indiqué sur chaque fiche pneu, selon le stock disponible."] },
      { id: "retours", heading: "Retours", body: [`Vous disposez de ${returns.days} jours à compter de la réception pour retourner des pneus non montés.`, pendingFr] },
    ],
  },
  cgv: { title: "Conditions générales de vente", description: "Conditions générales de vente.", legal: true, sections: [{ heading: "Conditions générales de vente", body: [pendingFr] }] },
  "mentions-legales": {
    title: "Mentions légales",
    description: "Mentions légales du site.",
    legal: true,
    sections: [
      { heading: "Éditeur du site", body: ["Raison sociale, adresse du siège, SIRET, numéro de TVA intracommunautaire, directeur de la publication.", pendingFr] },
      { heading: "Hébergeur", body: ["Nom, adresse et téléphone de l'hébergeur."] },
      { heading: "Médiateur de la consommation", body: ["Nom et coordonnées du médiateur de la consommation."] },
    ],
  },
  confidentialite: { title: "Politique de confidentialité", description: "Protection de vos données personnelles (RGPD).", legal: true, sections: [{ heading: "Données personnelles", body: [pendingFr] }] },
  cookies: { title: "Politique de cookies", description: "Utilisation des cookies sur le site.", legal: true, sections: [{ heading: "Cookies", body: [pendingFr] }] },
};

const en: Record<InfoPageSlug, InfoPage> = {
  "a-propos": {
    title: "About us",
    description: `${name}, your online tyre shop.`,
    sections: [
      {
        heading: "Our mission",
        body: [
          `${name} offers summer, winter and all-season tyres from top brands and budget brands, delivered across mainland France.`,
          "Our search by size (width, profile, diameter) helps you find the right tyres, first time.",
          `You can have your tyres fitted and balanced at our partner workshop ${workshop.name} in Barr.`,
        ],
      },
    ],
  },
  contact: {
    title: "Contact us",
    description: "A question about a tyre or an order? Our team is here to help.",
    sections: [
      { heading: "Customer service", body: [`Phone: ${contact.phone}`, `Email: ${contact.email}`, `Address: ${contact.address}`, "Monday to Friday, 9am – 6pm"] },
      { heading: "Fitting in Barr", body: [workshop.name, workshop.address, workshop.directions] },
      { heading: "Before writing to us", body: ["Please include your order number and your tyre size (e.g. 205/55 R16)."] },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    description: "Answers to the most common questions about our tyres, delivery and fitting.",
    sections: [
      { heading: "Where do I find my tyre size?", body: ["On the tyre sidewall, e.g. 205/55 R16 91V: 205 = width (mm), 55 = sidewall height (% of width), R16 = rim diameter (inches), 91 = load index, V = speed index."] },
      { heading: "How many tyres should I replace?", body: ["Ideally in pairs on the same axle, or all 4 at once for consistent handling."] },
      { heading: "Where can I get my tyres fitted?", body: [`At our partner workshop ${workshop.name}, ${workshop.address}, or at the garage of your choice.`] },
      { heading: "Can I return tyres?", body: [`Yes, you have ${returns.days} days to exercise your right of withdrawal, for unfitted tyres.`] },
    ],
  },
  livraison: {
    title: "Delivery & returns",
    description: "Delivery times, shipping costs and return conditions.",
    sections: [
      { heading: "Delivery", body: ["Home delivery anywhere in mainland France. The price shown for each tyre includes delivery.", "The shipping time is shown on each tyre page, depending on available stock."] },
      { id: "retours", heading: "Returns", body: [`You have ${returns.days} days from receipt to return unfitted tyres.`, pendingEn] },
    ],
  },
  cgv: { title: "Terms and conditions of sale", description: "Terms and conditions of sale.", legal: true, sections: [{ heading: "Terms and conditions of sale", body: [pendingEn] }] },
  "mentions-legales": {
    title: "Legal notice",
    description: "Legal notice for this website.",
    legal: true,
    sections: [
      { heading: "Website publisher", body: ["Company name, registered office address, SIRET, EU VAT number, publication director.", pendingEn] },
      { heading: "Hosting provider", body: ["Name, address and phone number of the hosting provider."] },
      { heading: "Consumer mediator", body: ["Name and contact details of the consumer mediator."] },
    ],
  },
  confidentialite: { title: "Privacy policy", description: "Protection of your personal data (GDPR).", legal: true, sections: [{ heading: "Personal data", body: [pendingEn] }] },
  cookies: { title: "Cookie policy", description: "How cookies are used on this website.", legal: true, sections: [{ heading: "Cookies", body: [pendingEn] }] },
};

const pages: Record<Locale, Record<InfoPageSlug, InfoPage>> = { fr, en };

export function getInfoPage(slug: string, locale: Locale): InfoPage | undefined {
  return (infoPageSlugs as readonly string[]).includes(slug) ? pages[locale][slug as InfoPageSlug] : undefined;
}
