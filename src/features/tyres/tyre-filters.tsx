"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import type { TyreSearchResult } from "@/types";
import { useUpdateParams } from "@/features/tyres/url-params";
import { cn } from "@/lib/utils";

function Option({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!count && !active}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition disabled:opacity-40",
        active ? "bg-brand-50 font-bold text-brand" : "text-ink-700 hover:bg-surface",
      )}
    >
      <span className="truncate">{label}</span>
      <span className="text-xs text-muted">{count}</span>
    </button>
  );
}

export function TyreFilters({ facets }: { facets: TyreSearchResult["facets"] }) {
  const t = useTranslations("tyres");
  const params = useSearchParams();
  const update = useUpdateParams();
  const season = params.get("saison");
  const brand = params.get("marque");

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-ink">{t("season")}</legend>
        {facets.seasons.map((s) => (
          <Option key={s.value} label={t(`seasons.${s.value as "summer"}`)} count={s.count} active={season === s.value}
            onClick={() => update({ saison: season === s.value ? undefined : s.value })} />
        ))}
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-ink">{t("brand")}</legend>
        <div className="max-h-72 overflow-y-auto">
          {facets.brands.map((b) => (
            <Option key={b.value} label={b.label} count={b.count} active={brand === b.value}
              onClick={() => update({ marque: brand === b.value ? undefined : b.value })} />
          ))}
        </div>
      </fieldset>
      {(season || brand) && (
        <button type="button" onClick={() => update({ saison: undefined, marque: undefined })} className="text-sm font-semibold text-brand hover:underline">
          {t("reset")}
        </button>
      )}
    </div>
  );
}

export function TyreSort() {
  const t = useTranslations("tyres");
  const params = useSearchParams();
  const update = useUpdateParams();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">{t("sort")}</span>
      <select
        value={params.get("tri") ?? ""}
        onChange={(e) => update({ tri: e.target.value || undefined })}
        className="h-9 rounded-md border border-line bg-white px-2 text-sm font-semibold text-ink focus:border-brand focus:outline-none"
      >
        <option value="">{t("sortRelevance")}</option>
        <option value="price_asc">{t("sortPriceAsc")}</option>
        <option value="price_desc">{t("sortPriceDesc")}</option>
        <option value="brand">{t("sortBrand")}</option>
      </select>
    </label>
  );
}
