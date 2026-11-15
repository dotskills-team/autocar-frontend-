"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import type { Tyre } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/store";
import { cn } from "@/lib/utils";

type CartTyre = Pick<Tyre, "id" | "slug" | "name" | "ean" | "priceTTC">;

const toItem = (t: CartTyre) => ({
  productId: `tasy:${t.id}`,
  slug: t.slug,
  href: `/pneus/${t.slug}`,
  name: t.name,
  reference: t.ean,
  priceTTC: t.priceTTC,
  categorySlug: "pneus",
});

/** Card button: adds 4 tyres at once (the usual purchase), 2 on narrow cards is not worth a choice. */
export function AddTyreButton({ tyre, quantity = 4 }: { tyre: CartTyre; quantity?: number }) {
  const add = useCart((s) => s.add);
  const t = useTranslations("tyres");
  return (
    <button
      onClick={() => add(toItem(tyre), quantity)}
      aria-label={`${t("addToCart")} – ${tyre.name} ×${quantity}`}
      className="flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-brand px-3 text-xs font-bold text-white transition hover:bg-brand-600"
    >
      <ShoppingCart className="h-4 w-4" /> ×{quantity}
    </button>
  );
}

/** Quantity selector (default 4) + main CTA for the tyre page. */
export function AddTyrePanel({ tyre, maxQuantity, className }: { tyre: CartTyre; maxQuantity: number; className?: string }) {
  const add = useCart((s) => s.add);
  const t = useTranslations("tyres");
  const max = Math.max(1, Math.min(99, maxQuantity || 99));
  const [qty, setQty] = useState(Math.min(4, max));
  const [added, setAdded] = useState(false);

  return (
    <div className={cn("flex gap-3", className)}>
      <div className="flex h-11 shrink-0 items-center rounded-md border border-line bg-white" role="group" aria-label={t("quantity")}>
        <button aria-label="−" className="px-3 text-muted hover:text-ink" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-sm font-semibold">{qty}</span>
        <button aria-label="+" className="px-3 text-muted hover:text-ink" onClick={() => setQty((q) => Math.min(max, q + 1))}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        className="h-11 flex-1"
        onClick={() => {
          add(toItem(tyre), qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        }}
      >
        {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />} {added ? t("added") : t("addToCart")}
      </Button>
    </div>
  );
}
