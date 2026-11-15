import "server-only";

import { mockTasyCreateOrder, mockTasyProductIds, mockTasyProducts } from "@/lib/mock/tasy";
import type {
  TasyAuthTest,
  TasyCreateOrderRequest,
  TasyCreateOrderResponse,
  TasyProductIds,
  TasyProductList,
  TasyShallowProductList,
} from "./types";

// Server-only client for the TASY dropshipping API v3.0 (Basic auth).
// Credentials come from .env.local — see .env.example. Without them, every call
// returns the mock data in lib/mock/tasy.ts, so the storefront works before the client
// provides access. Never import this file from a client component.

const baseUrl = (process.env.TASY_API_URL ?? "https://api.tasy.cz").replace(/\/$/, "");
const username = process.env.TASY_USERNAME;
const password = process.env.TASY_PASSWORD;

/** True once real credentials are configured. */
export const tasyEnabled = Boolean(username && password);
/** Orders are sent with test: true unless TASY_TEST_MODE=false. */
export const tasyTestMode = process.env.TASY_TEST_MODE !== "false";

/** Product list cache (seconds). TASY prices/stock change often, keep it short. */
const REVALIDATE = 600;

async function tasyFetch<T>(path: string, init: { method?: "GET" | "POST"; body?: unknown; cache?: boolean } = {}): Promise<T> {
  const res = await fetch(`${baseUrl}/v3.0${path}`, {
    method: init.method ?? "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    ...(init.cache ? { next: { revalidate: REVALIDATE, tags: ["tasy"] } } : { cache: "no-store" }),
  });
  if (!res.ok) throw new Error(`TASY ${path} failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

/** GET /authentication/test */
export async function tasyTestCredentials(): Promise<TasyAuthTest> {
  if (!tasyEnabled) return { success: false, errorMessage: "TASY_USERNAME / TASY_PASSWORD are not set" };
  return tasyFetch<TasyAuthTest>("/authentication/test", { method: "GET" });
}

/** POST /Product/getids — every product available to the account for a country. */
export async function tasyGetProductIds(shippingCountry: string): Promise<TasyProductIds> {
  if (!tasyEnabled) return mockTasyProductIds;
  return tasyFetch<TasyProductIds>("/Product/getids", { body: { product_ids: [], test: tasyTestMode, shipping_country: shippingCountry }, cache: true });
}

/** POST /Product/getl — full product details. Empty `productIds` = the whole catalogue. */
export async function tasyGetProducts(shippingCountry: string, productIds: string[] = []): Promise<TasyProductList> {
  if (!tasyEnabled) {
    const prds = productIds.length ? mockTasyProducts.prds.filter((p) => productIds.includes(p.id)) : mockTasyProducts.prds;
    return { ...mockTasyProducts, prds, prds_c: prds.length };
  }
  return tasyFetch<TasyProductList>("/Product/getl", { body: { product_ids: productIds, amount: 0, shipping_country: shippingCountry }, cache: true });
}

/** POST /Product/getsl — prices and stock only (for refreshing before checkout). */
export async function tasyGetPrices(shippingCountry: string, productIds: string[]): Promise<TasyShallowProductList> {
  if (!tasyEnabled) return tasyGetProducts(shippingCountry, productIds);
  return tasyFetch<TasyShallowProductList>("/Product/getsl", { body: { product_ids: productIds, amount: 0, shipping_country: shippingCountry } });
}

/** POST /Enum/get — lookup lists ("SeasonType", "ProductType", "Brand"…). Response shape is not documented. */
export async function tasyGetEnum(enumName: string): Promise<unknown> {
  if (!tasyEnabled) return null;
  return tasyFetch<unknown>("/Enum/get", { body: { enum_name: enumName }, cache: true });
}

/** POST /Order/create — TASY ships the order directly to the customer. */
export async function tasyCreateOrder(order: Omit<TasyCreateOrderRequest, "test" | "username">): Promise<TasyCreateOrderResponse> {
  if (!tasyEnabled) return mockTasyCreateOrder();
  return tasyFetch<TasyCreateOrderResponse>("/Order/create", { body: { ...order, test: tasyTestMode, username } });
}

/** POST /Order/get — order detail / status. Response shape is not documented. */
export async function tasyGetOrder(orderNr: string): Promise<unknown> {
  if (!tasyEnabled) return null;
  return tasyFetch<unknown>("/Order/get", { body: { order_nr: orderNr } });
}
