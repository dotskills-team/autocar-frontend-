// Raw TASY dropshipping API v3.0 payloads, field names exactly as the API sends them.
// Source: https://api.tasy.cz/swagger/index.html (v3.0). Do not use these types in UI code:
// they are mapped to the storefront `Tyre` type in lib/api/tyres.ts.

/** Stock line of a product: one per warehouse. */
export interface TasyStock {
  /** Warehouse / stock identifier */
  stck: string;
  /** Quantity available */
  amnt: number;
  /** Delivery time in days */
  dlvr: number;
  /** Your price without VAT for this stock */
  ds_p: number;
}

export interface TasyShallowProduct {
  id: string;
  /** Product type (see enum "ProductType") */
  t: string;
  /** Brand name, or a "Brand" enum record id */
  brnd: string;
  ean: string;
  spplr_id: string;
  /** Standard price without VAT */
  strd_p: number;
  /** Your prices without VAT, per stock */
  ds_p: TasyStock[];
  /** Shipping price per country (ISO code → price without VAT, one item) */
  shp_ps: Record<string, number>;
}

export interface TasyProduct extends TasyShallowProduct {
  name: string;
  /** Rolling resistance class (EU label, A–E) */
  rrc: string;
  /** Wet grip class (EU label, A–E) */
  wgc: string;
  /** Noise class (EU label, A–C) */
  nc: string;
  /** Noise level in dB */
  nl: number;
  /** Product segment */
  seg: string;
  /** Season type (see enum "SeasonType") */
  ssn_t: number;
  /** Rim diameter in inches */
  diam: number;
  /** Profile (aspect ratio) */
  prof: number;
  /** Width in mm */
  wi: number;
  /** Load index */
  li: string;
  /** Speed index */
  si: string;
  /** Pattern name */
  pttrn: string;
  /** DOT code */
  dot: string;
  mdl: string;
  axl: number;
  /** Special markings (extra load, rim protector…) */
  mrk: string[];
  /** Package type (0 = pallet, 1 = one tyre per package…) */
  pckg_t: number;
  img_url: string;
  /** Weight in kg */
  wght: number;
  /** EPREL energy label link */
  epr_url: string;
}

interface TasyListBase {
  /** Currency of every price in the response */
  curr: string;
  /** Dropship fee per ordered item */
  dch: number;
  /** Cash-on-delivery price per country, charged once per order */
  cod_ps: Record<string, number>;
  prds_c: number;
}

export interface TasyProductList extends TasyListBase {
  prds: TasyProduct[];
}

export interface TasyShallowProductList extends TasyListBase {
  prds: TasyShallowProduct[];
}

export interface TasyProductIds {
  product_ids: string[];
  allowed_countries: string[];
}

export interface TasyAddress {
  recipient: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
}

export interface TasyCreateOrderRequest {
  test: boolean;
  username?: string;
  products: { product_id: string; amount: number }[];
  billing_address?: TasyAddress;
  billing_address_id?: number;
  shipping_address?: TasyAddress;
  shipping_address_id?: number;
  sender_label_address?: TasyAddress;
  email: string;
  phone: string;
  cash_on_delivery_curr?: string;
  cash_on_delivery?: number;
  order_time_stamp: string;
  order_note?: string;
  /** Our own order number, to find the order on both sides */
  reference_id: string;
  ExpectedDropshipFee?: number;
  ExpectedShipping?: number;
  payment_option_name?: string;
  total_tax?: number;
}

export interface TasyCreateOrderResponse {
  success: boolean;
  order_nr: string;
  errors: string[];
}

export interface TasyAuthTest {
  success: boolean;
  errorMessage: string;
}
