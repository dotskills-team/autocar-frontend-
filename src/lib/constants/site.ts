// Central site configuration. Business values (delivery, contact, etc.) live here
// so they can be changed without touching components.
// User-facing wording lives in messages/<locale>.json — only keys are referenced here.

export const siteConfig = {
  name: "MAPIECEAUTO",
  url: "https://www.mapieceauto.com",
  contact: {
    phone: "+33 6 82 62 40 83",
    address: "12 rue d’Alsace, 67140 Barr",
    email: "contact@mapieceauto.com",
  },
  /** Partner workshop for fitting and balancing. */
  workshop: {
    name: "BMK Autocolor",
    address: "12 rue d’Alsace, 67140 Barr",
    directions: "Au fond de la cour, box 4 et 5",
  },
  returns: {
    days: 14,
  },
  // Tyres from the TASY dropshipping API (prices from TASY are without VAT).
  tyres: {
    /** Delivery country sent to TASY (prices, stock and shipping depend on it). */
    shippingCountry: "FR",
    /** Our margin on TASY's price, in %. TODO: confirm with the client. */
    marginPercent: 25,
    vatRate: 0.2,
    /** Add TASY's shipping + dropship fee into the displayed price ("livraison incluse"). */
    includeShippingInPrice: true,
    /** TASY "SeasonType" enum ids. TODO: verify with POST /v3.0/Enum/get { enum_name: "SeasonType" }. */
    seasonIds: { 1: "summer", 2: "winter", 3: "all_season" } as Record<number, "summer" | "winter" | "all_season">,
  },
} as const;

/** Header links — labels come from messages "nav.<key>". */
export const mainNav = [
  { key: "tyres", href: "/pneus" },
  { key: "brands", href: "/marques" },
  { key: "fitting", href: "/#montage" },
  { key: "guide", href: "/#guide" },
] as const;

/** Most searched sizes, shown as shortcuts under the size search. */
export const popularSizes = ["195/65 R15", "205/55 R16", "225/45 R17"] as const;

/** Footer links — labels come from messages "footer.links.<key>". */
export const footerLinks = {
  shop: [
    { key: "search", href: "/pneus" },
    { key: "brands", href: "/marques" },
    { key: "workshop", href: "/#montage" },
    { key: "guide", href: "/#guide" },
    { key: "contact", href: "/contact" },
  ],
  legal: [
    { key: "delivery", href: "/livraison" },
    { key: "cgv", href: "/cgv" },
    { key: "legal", href: "/mentions-legales" },
    { key: "privacy", href: "/confidentialite" },
  ],
} as const;
