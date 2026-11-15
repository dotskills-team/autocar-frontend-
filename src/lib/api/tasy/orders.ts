import "server-only";

import { siteConfig } from "@/lib/constants/site";
import { tasyCreateOrder } from "./client";
import type { TasyAddress, TasyCreateOrderResponse } from "./types";

// Sends the tyre lines of a PAID order to TASY, which ships them directly to the customer.
// Call it from the payment confirmation (e.g. payment provider webhook), never from the browser.
// Non-tyre lines of the cart are handled by the other supplier.

export interface TyreOrderInput {
  /** Our order number, sent as reference_id */
  orderNumber: string;
  email: string;
  phone: string;
  shipping: { firstName: string; lastName: string; address: string; postalCode: string; city: string; country?: string };
  billing?: TyreOrderInput["shipping"];
  /** Tyre lines only: TASY product id + quantity */
  lines: { tasyId: string; quantity: number }[];
  note?: string;
}

const toAddress = (a: TyreOrderInput["shipping"]): TasyAddress => ({
  recipient: `${a.firstName} ${a.lastName}`.trim(),
  street: a.address,
  city: a.city,
  postcode: a.postalCode,
  country: a.country ?? siteConfig.tyres.shippingCountry,
});

export async function sendTyreOrderToTasy(input: TyreOrderInput): Promise<TasyCreateOrderResponse> {
  if (!input.lines.length) return { success: true, order_nr: "", errors: [] };
  return tasyCreateOrder({
    reference_id: input.orderNumber,
    order_time_stamp: new Date().toISOString(),
    email: input.email,
    phone: input.phone,
    shipping_address: toAddress(input.shipping),
    billing_address: toAddress(input.billing ?? input.shipping),
    products: input.lines.map((l) => ({ product_id: l.tasyId, amount: l.quantity })),
    order_note: input.note,
  });
}
