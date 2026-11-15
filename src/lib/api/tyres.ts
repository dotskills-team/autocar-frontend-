import "server-only";

import type { StockStatus, Tyre, TyreFilters, TyreSearchResult, TyreSeason } from "@/types";
import { siteConfig } from "@/lib/constants/site";
import { slugify } from "@/lib/utils";
import { tasyEnabled, tasyGetProducts } from "./tasy/client";
import type { TasyProduct, TasyProductList } from "./tasy/types";

// Tyre data access: TASY payloads → storefront `Tyre`. Pages use only these functions.

export const TYRE_PAGE_SIZE = 12;
/** True while no TASY credentials are set (mock catalogue). */
export const tyresAreDemo = !tasyEnabled;
const cfg = siteConfig.tyres;
const round2 = (n: number) => Math.round(n * 100) / 100;

function toTyre(p: TasyProduct, list: TasyProductList): Tyre {
  if (list.curr !== "EUR") console.warn(`TASY prices are in ${list.curr}, storefront expects EUR`);

  // Cheapest stock that has quantity; otherwise the cheapest one (orderable, slower)
  const available = p.ds_p.filter((s) => s.amnt > 0);
  const stocks = available.length ? available : p.ds_p;
  const best = stocks.reduce((a, b) => (b.ds_p < a.ds_p ? b : a), stocks[0]);
  const quantity = available.reduce((n, s) => n + s.amnt, 0);

  const shipping = cfg.includeShippingInPrice ? (p.shp_ps[cfg.shippingCountry] ?? 0) + list.dch : 0;
  const priceHT = ((best?.ds_p ?? p.strd_p) + shipping) * (1 + cfg.marginPercent / 100);
  const stock: StockStatus = quantity === 0 ? "out_of_stock" : quantity < 4 ? "low_stock" : "in_stock";

  return {
    id: p.id,
    slug: slugify(`${p.name}-${p.id}`),
    name: p.name,
    brand: p.brnd,
    pattern: p.pttrn,
    width: p.wi,
    profile: p.prof,
    diameter: p.diam,
    size: `${p.wi}/${p.prof} R${p.diam}`,
    loadIndex: p.li,
    speedIndex: p.si,
    season: cfg.seasonIds[p.ssn_t] ?? null,
    euLabel: { rollingResistance: p.rrc, wetGrip: p.wgc, noiseClass: p.nc, noiseDb: p.nl || null },
    markings: p.mrk ?? [],
    ean: p.ean,
    dot: p.dot,
    weightKg: p.wght || null,
    priceTTC: round2(priceHT * (1 + cfg.vatRate)),
    stock,
    quantity,
    deliveryDays: best?.dlvr ?? null,
    image: p.img_url || null,
    eprelUrl: p.epr_url || null,
  };
}

async function allTyres(): Promise<Tyre[]> {
  const list = await tasyGetProducts(cfg.shippingCountry);
  return list.prds.map((p) => toTyre(p, list));
}

export async function getTyre(slug: string): Promise<Tyre | undefined> {
  return (await allTyres()).find((t) => t.slug === slug);
}

const uniqueSorted = (values: number[]) => Array.from(new Set(values)).sort((a, b) => a - b);

export async function searchTyres(filters: TyreFilters): Promise<TyreSearchResult> {
  const tyres = await allTyres();

  // Size selects narrow each other: widths for any size, profiles for the chosen width, etc.
  const byWidth = tyres.filter((t) => !filters.width || t.width === filters.width);
  const byProfile = byWidth.filter((t) => !filters.profile || t.profile === filters.profile);
  const bySize = byProfile.filter((t) => !filters.diameter || t.diameter === filters.diameter);

  let items = bySize.filter((t) => (!filters.season || t.season === filters.season) && (!filters.brand || t.brand === filters.brand));
  if (filters.sort === "price_asc") items = [...items].sort((a, b) => a.priceTTC - b.priceTTC);
  if (filters.sort === "price_desc") items = [...items].sort((a, b) => b.priceTTC - a.priceTTC);
  if (filters.sort === "brand") items = [...items].sort((a, b) => a.brand.localeCompare(b.brand));

  const count = (values: string[]) => {
    const m = new Map<string, number>();
    for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
    return m;
  };
  const seasonCounts = count(bySize.filter((t) => !filters.brand || t.brand === filters.brand).flatMap((t) => (t.season ? [t.season] : [])));
  const brandCounts = count(bySize.filter((t) => !filters.season || t.season === filters.season).map((t) => t.brand));

  const page = Math.max(1, filters.page ?? 1);
  const total = items.length;
  return {
    items: items.slice((page - 1) * TYRE_PAGE_SIZE, page * TYRE_PAGE_SIZE),
    total,
    page,
    pageSize: TYRE_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / TYRE_PAGE_SIZE)),
    facets: {
      widths: uniqueSorted(tyres.map((t) => t.width)),
      profiles: uniqueSorted(byWidth.map((t) => t.profile)),
      diameters: uniqueSorted(byProfile.map((t) => t.diameter)),
      seasons: (["summer", "winter", "all_season"] as TyreSeason[]).map((value) => ({ value, label: value, count: seasonCounts.get(value) ?? 0 })),
      brands: Array.from(brandCounts.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, n]) => ({ value, label: value, count: n })),
    },
  };
}

export function parseTyreParams(params: Record<string, string | string[] | undefined>): TyreFilters {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const num = (v: string | string[] | undefined) => {
    const n = Number(first(v));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const season = first(params.saison);
  const sort = first(params.tri);
  return {
    width: num(params.largeur),
    profile: num(params.hauteur),
    diameter: num(params.diametre),
    season: season === "summer" || season === "winter" || season === "all_season" ? season : undefined,
    brand: first(params.marque) || undefined,
    sort: sort === "price_asc" || sort === "price_desc" || sort === "brand" ? sort : undefined,
    page: num(params.page),
  };
}

/** Every available size [width, profile, diameter], for the size selector. */
export async function getTyreSizes(): Promise<[number, number, number][]> {
  const seen = new Map<string, [number, number, number]>();
  for (const t of await allTyres()) seen.set(t.size, [t.width, t.profile, t.diameter]);
  return Array.from(seen.values()).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
}

/** Brands in the catalogue with their number of tyres, A→Z. */
export async function getTyreBrands(): Promise<{ name: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const t of await allTyres()) counts.set(t.brand, (counts.get(t.brand) ?? 0) + 1);
  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAllTyreSlugs(): Promise<string[]> {
  return (await allTyres()).map((t) => t.slug);
}
