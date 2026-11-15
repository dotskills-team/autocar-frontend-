import type { TasyCreateOrderResponse, TasyProduct, TasyProductIds, TasyProductList } from "@/lib/api/tasy/types";

// Fake TASY responses, same shape as the real API (used while no credentials are configured).
// Prices are made up, without VAT, in EUR.

const brands = ["Hankook", "Kumho", "Kleber", "Tracmax", "Michelin", "Nokian Tyres", "Goodride", "Sailun", "Bridgestone", "Aplus", "Nexen", "Pirelli", "Continental", "Goodyear", "Maxxis", "Yokohama", "Nankang", "Vredestein", "Dunlop", "Landspider", "Falken", "Kratos", "Lanvigator", "Uniroyal"];
// Neutral model names (real model names belong to specific brands)
const patterns: Record<number, string[]> = {
  1: ["Eco Touring", "Sport Pro", "Comfort Drive", "Road Master", "Performance 2", "City Plus"],
  2: ["Winter Grip", "Snow Control", "Ice Pro", "Alpine Plus", "Winter Comfort", "Nordic 3"],
  3: ["All Weather", "4Season Plus", "Quatro Saisons", "Year Round", "Multi Climate", "All Season 2"],
};
const sizes: [number, number, number, string, string][] = [
  [195, 65, 15, "91", "H"],
  [205, 55, 16, "91", "V"],
  [205, 60, 16, "92", "H"],
  [215, 55, 17, "94", "W"],
  [225, 45, 17, "94", "Y"],
  [225, 40, 18, "92", "Y"],
  [235, 55, 18, "100", "V"],
  [185, 65, 15, "88", "T"],
];
const grades = ["A", "B", "C", "D"];

function makeProduct(i: number): TasyProduct {
  const season = (i % 3) + 1;
  const brand = brands[i % brands.length];
  const pattern = patterns[season][i % patterns[season].length];
  const [wi, prof, diam, li, si] = sizes[i % sizes.length];
  const base = 48 + diam * 3.2 + (wi - 180) * 0.35 + (i % 5) * 6.5;
  const inStock = i % 9 !== 4;
  return {
    id: `T${(100000 + i * 37).toString()}`,
    t: "1",
    brnd: brand,
    ean: `40${(3000000000 + i * 7919).toString().padStart(11, "0")}`,
    spplr_id: `SP-${2000 + i}`,
    strd_p: Math.round(base * 1.25 * 100) / 100,
    ds_p: [
      { stck: "CZ1", amnt: inStock ? 4 + ((i * 7) % 40) : 0, dlvr: 2 + (i % 2), ds_p: Math.round(base * 100) / 100 },
      { stck: "DE2", amnt: i % 4 === 0 ? 12 : 0, dlvr: 4, ds_p: Math.round((base + 3) * 100) / 100 },
    ],
    shp_ps: { FR: 9.9, BE: 9.9, DE: 7.5, CZ: 4.5 },
    name: `${brand} ${pattern} ${wi}/${prof} R${diam} ${li}${si}`,
    rrc: grades[i % 3],
    wgc: grades[(i + 1) % 3],
    nc: ["A", "B", "C"][i % 3],
    nl: 68 + (i % 6),
    seg: i % 4 === 0 ? "Premium" : "Standard",
    ssn_t: season,
    diam,
    prof,
    wi,
    li,
    si,
    pttrn: pattern,
    dot: `${(20 + (i % 6)).toString().padStart(2, "0")}25`,
    mdl: pattern,
    axl: 0,
    mrk: i % 5 === 0 ? ["XL"] : [],
    pckg_t: 1,
    img_url: "",
    wght: 7.5 + (diam - 15) * 1.4,
    epr_url: "",
  };
}

export const mockTasyProducts: TasyProductList = (() => {
  const prds = Array.from({ length: 96 }, (_, i) => makeProduct(i));
  return { curr: "EUR", dch: 1.5, cod_ps: { FR: 5, BE: 5, DE: 4 }, prds_c: prds.length, prds };
})();

export const mockTasyProductIds: TasyProductIds = {
  product_ids: mockTasyProducts.prds.map((p) => p.id),
  allowed_countries: ["FR", "BE", "DE", "CZ"],
};

export function mockTasyCreateOrder(): TasyCreateOrderResponse {
  return { success: true, order_nr: `TEST-${Date.now()}`, errors: [] };
}
