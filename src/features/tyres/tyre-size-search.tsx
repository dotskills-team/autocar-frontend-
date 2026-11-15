"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Info, Search } from "lucide-react";
import type { TyreSeason } from "@/types";
import { Button } from "@/components/ui/button";
import { HeroSelect } from "@/components/ui/dropdown-select";
import { useRouter } from "@/i18n/navigation";

type Size = [number, number, number];

/** Width → profile → diameter (+ season) selector. Each list only offers sizes that exist. */
export function TyreSizeSearch({
  sizes,
  initial,
  header,
  footer,
}: {
  sizes: Size[];
  initial?: { width?: number; profile?: number; diameter?: number; season?: TyreSeason };
  /** Optional title row above the fields */
  header?: React.ReactNode;
  /** Replaces the default size help line */
  footer?: React.ReactNode;
}) {
  const t = useTranslations("tyres");
  const router = useRouter();
  const [width, setWidth] = useState(initial?.width ? String(initial.width) : "");
  const [profile, setProfile] = useState(initial?.profile ? String(initial.profile) : "");
  const [diameter, setDiameter] = useState(initial?.diameter ? String(initial.diameter) : "");
  const [season, setSeason] = useState<string>(initial?.season ?? "");

  const opts = (values: number[], fmt = (v: number) => String(v)) =>
    Array.from(new Set(values))
      .sort((a, b) => a - b)
      .map((v) => ({ value: String(v), label: fmt(v) }));

  const widths = useMemo(() => opts(sizes.map((s) => s[0])), [sizes]);
  const profiles = useMemo(() => opts(sizes.filter((s) => String(s[0]) === width).map((s) => s[1])), [sizes, width]);
  const diameters = useMemo(
    () => opts(sizes.filter((s) => String(s[0]) === width && String(s[1]) === profile).map((s) => s[2]), (v) => `R${v}`),
    [sizes, width, profile],
  );
  const seasons = (["summer", "winter", "all_season"] as const).map((s) => ({ value: s, label: t(`seasons.${s}`) }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (width) q.set("largeur", width);
    if (profile) q.set("hauteur", profile);
    if (diameter) q.set("diametre", diameter);
    if (season) q.set("saison", season);
    router.push(`/pneus${q.size ? `?${q}` : ""}`);
  }

  return (
    <form onSubmit={submit} className="rounded-xl bg-white p-3 shadow-[var(--shadow-card-hover)] sm:p-4">
      {header}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <HeroSelect id="ty-width" label={t("width")} placeholder="205" filterPlaceholder={t("width")} value={width} options={widths}
          onChange={(v) => { setWidth(v); setProfile(""); setDiameter(""); }} />
        <HeroSelect id="ty-profile" label={t("profile")} placeholder="55" filterPlaceholder={t("profile")} value={profile} options={profiles} disabled={!width}
          onChange={(v) => { setProfile(v); setDiameter(""); }} />
        <HeroSelect id="ty-diameter" label={t("diameter")} placeholder="R16" filterPlaceholder={t("diameter")} value={diameter} options={diameters} disabled={!profile}
          onChange={setDiameter} />
        <HeroSelect id="ty-season" label={t("season")} placeholder={t("allSeasons")} filterPlaceholder={t("season")} value={season}
          options={[{ value: "", label: t("allSeasons") }, ...seasons]} onChange={setSeason} />
        <Button type="submit" className="col-span-2 h-12 text-base lg:col-span-1 lg:px-8">
          <Search className="h-5 w-5" aria-hidden /> {t("search")}
        </Button>
      </div>
      {footer ?? (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted">
          <Info className="h-3.5 w-3.5 shrink-0" aria-hidden /> {t("sizeHelp")}
        </p>
      )}
    </form>
  );
}
