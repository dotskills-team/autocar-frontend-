// Domain types shared across the storefront.
// Tyres come from the TASY dropshipping API (raw payloads in lib/api/tasy/types.ts,
// mapped to these types in lib/api/tyres.ts), so UI code never depends on TASY field names.

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  reference: string;
  priceTTC: number;
  quantity: number;
  categorySlug: string;
  vehicleLabel?: string;
  /** Product page link when it isn't /produit/<slug> (e.g. tyres) */
  href?: string;
}

export interface FacetCount {
  value: string;
  label: string;
  count: number;
}

// ---------- Tyres (TASY dropshipping) ----------
export type TyreSeason = "summer" | "winter" | "all_season";

export interface Tyre {
  id: string; // TASY product id
  slug: string;
  name: string;
  brand: string;
  pattern: string;
  width: number;
  profile: number;
  diameter: number;
  /** "205/55 R16" */
  size: string;
  loadIndex: string;
  speedIndex: string;
  season: TyreSeason | null;
  /** EU tyre label */
  euLabel: { rollingResistance: string; wetGrip: string; noiseClass: string; noiseDb: number | null };
  markings: string[];
  ean: string;
  dot: string;
  weightKg: number | null;
  priceTTC: number; // EUR, VAT and delivery included
  stock: StockStatus;
  quantity: number;
  /** Delivery time in days (fastest stock) */
  deliveryDays: number | null;
  image: string | null;
  eprelUrl: string | null;
}

export type TyreSort = "price_asc" | "price_desc" | "brand";

export interface TyreFilters {
  width?: number;
  profile?: number;
  diameter?: number;
  season?: TyreSeason;
  brand?: string;
  sort?: TyreSort;
  page?: number;
}

export interface TyreSearchResult {
  items: Tyre[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: {
    widths: number[];
    profiles: number[];
    diameters: number[];
    seasons: FacetCount[];
    brands: FacetCount[];
  };
}
