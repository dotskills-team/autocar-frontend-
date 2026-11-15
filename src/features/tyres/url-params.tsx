"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Updates URL search params (filters, sort, page) without scrolling. Resets the page unless it is updated. */
export function useUpdateParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (!("page" in updates)) next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };
}

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const update = useUpdateParams();
  const t = useTranslations("results");
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1 || (page <= 3 && p <= 5),
  );
  const btn = "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-semibold transition";
  return (
    <nav aria-label={t("pagination")} className="mt-8 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <button onClick={() => update({ page: String(page - 1) })} aria-label={t("previous")} className={cn(btn, "text-ink hover:text-brand")}>
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
          <button
            onClick={() => update({ page: String(p) })}
            aria-current={p === page ? "page" : undefined}
            className={cn(btn, p === page ? "bg-brand text-white" : "text-ink hover:bg-surface")}
          >
            {p}
          </button>
        </span>
      ))}
      {page < totalPages && (
        <button onClick={() => update({ page: String(page + 1) })} aria-label={t("next")} className={cn(btn, "text-ink hover:text-brand")}>
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
}
