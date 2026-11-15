import { CloudSun, Snowflake, Sun, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TyreSeason } from "@/types";
import { cn } from "@/lib/utils";

const seasonStyle: Record<TyreSeason, { icon: typeof Sun; className: string }> = {
  summer: { icon: Sun, className: "bg-amber-50 text-amber-700 ring-amber-200" },
  winter: { icon: Snowflake, className: "bg-sky-50 text-sky-700 ring-sky-200" },
  all_season: { icon: CloudSun, className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

export function SeasonBadge({ season, className }: { season: TyreSeason | null; className?: string }) {
  const t = useTranslations("tyres.seasons");
  if (!season) return null;
  const s = seasonStyle[season];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1", s.className, className)}>
      <s.icon className="h-3.5 w-3.5" aria-hidden /> {t(season)}
    </span>
  );
}

// EU label colours, A (best) → E
const gradeColor: Record<string, string> = {
  A: "bg-[#00a651]",
  B: "bg-[#8dc63f]",
  C: "bg-[#f7d117] text-ink",
  D: "bg-[#f7941d]",
  E: "bg-[#ed1c24]",
};

function Grade({ value }: { value: string }) {
  return (
    <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded text-[11px] font-black text-white", gradeColor[value?.toUpperCase()] ?? "bg-muted")}>
      {value?.toUpperCase() || "–"}
    </span>
  );
}

/** EU tyre label: fuel efficiency, wet grip, noise. "compact" for cards. */
export function EuLabel({
  label,
  compact,
}: {
  label: { rollingResistance: string; wetGrip: string; noiseClass: string; noiseDb: number | null };
  compact?: boolean;
}) {
  const t = useTranslations("tyres");
  const fuel = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3M7 7h5v4H7z" />
    </svg>
  );
  const rain = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 16a5 5 0 1 1 1-9.9A6 6 0 0 1 19 9a4 4 0 0 1-1 7.9M8 19l-1 2M12 19l-1 2M16 19l-1 2" />
    </svg>
  );
  const items = [
    { icon: fuel, label: t("fuel"), value: <Grade value={label.rollingResistance} /> },
    { icon: rain, label: t("wetGrip"), value: <Grade value={label.wetGrip} /> },
    {
      icon: <Volume2 className="h-4 w-4" aria-hidden />,
      label: t("noise"),
      value: (
        <span className="text-xs font-bold text-ink">
          {label.noiseDb ? `${label.noiseDb} dB` : ""} <span className="text-muted">{label.noiseClass}</span>
        </span>
      ),
    },
  ];

  if (compact)
    return (
      <ul className="flex items-center gap-3 text-muted" aria-label={t("euLabel")}>
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-1" title={i.label}>
            {i.icon} {i.value}
          </li>
        ))}
      </ul>
    );

  return (
    <dl className="grid gap-2 rounded-lg border border-line p-3">
      <p className="text-xs font-bold tracking-wide text-muted uppercase">{t("euLabel")}</p>
      {items.map((i) => (
        <div key={i.label} className="flex items-center justify-between gap-3 text-sm">
          <dt className="flex items-center gap-2 text-ink-700">{i.icon} {i.label}</dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
