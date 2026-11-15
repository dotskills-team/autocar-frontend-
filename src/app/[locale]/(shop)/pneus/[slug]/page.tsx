import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, Info, Truck } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs, PriceTag, StockBadge } from "@/components/shared";
import { AddTyrePanel } from "@/features/tyres/add-tyre-to-cart";
import { EuLabel, SeasonBadge } from "@/features/tyres/tyre-bits";
import { TyreImage } from "@/features/tyres/tyre-image";
import { alternatesFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getTyre } from "@/lib/api/tyres";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tyre = await getTyre(slug);
  if (!tyre) return {};
  return { title: tyre.name, description: `${tyre.brand} ${tyre.pattern} ${tyre.size} ${tyre.loadIndex}${tyre.speedIndex}`, alternates: alternatesFor(`/pneus/${tyre.slug}`, locale) };
}

export default async function TyrePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, tyre] = await Promise.all([getTranslations("tyres"), getTyre(slug)]);
  if (!tyre) notFound();

  const specs: [string, string][] = [
    [t("specSize"), tyre.size],
    [t("specLoad"), tyre.loadIndex],
    [t("specSpeed"), tyre.speedIndex],
    ...(tyre.season ? ([[t("specSeason"), t(`seasons.${tyre.season}`)]] as [string, string][]) : []),
    [t("specPattern"), tyre.pattern],
    ...(tyre.markings.length ? ([[t("specMarkings"), tyre.markings.join(", ")]] as [string, string][]) : []),
    ...(tyre.weightKg ? ([[t("specWeight"), `${tyre.weightKg.toFixed(1)} kg`]] as [string, string][]) : []),
    ...(tyre.dot ? ([[t("specDot"), tyre.dot]] as [string, string][]) : []),
    [t("specEan"), tyre.ean],
  ];

  return (
    <div className="container-page py-4 sm:py-6">
      <Breadcrumbs items={[{ label: t("title"), href: "/pneus" }, { label: tyre.name }]} />

      <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="relative">
          <TyreImage src={tyre.image} alt={tyre.name} priority className="p-10" />
          <SeasonBadge season={tyre.season} className="absolute top-3 left-3 text-xs" />
          {!tyre.image && <p className="mt-2 text-center text-xs text-muted">{t("illustration")}</p>}
        </div>

        <div>
          <p className="text-sm font-black tracking-wide text-brand uppercase">{tyre.brand}</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink sm:text-3xl">{tyre.pattern}</h1>
          <p className="mt-1 text-lg text-ink-700">
            {tyre.size} <span className="font-semibold">{tyre.loadIndex}{tyre.speedIndex}</span>
            {tyre.markings.map((m) => <span key={m} className="ml-2 rounded bg-surface px-1.5 text-xs font-bold">{m}</span>)}
          </p>

          <div className="mt-5 rounded-lg bg-surface p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <PriceTag value={tyre.priceTTC} size="lg" />
                <p className="text-xs text-muted">{t("perTyre")} · {t("deliveryIncluded")}</p>
              </div>
              <div className="text-right text-xs">
                <StockBadge status={tyre.stock} />
                {tyre.deliveryDays !== null && (
                  <p className="mt-1 inline-flex items-center gap-1 text-muted"><Truck className="h-3.5 w-3.5" aria-hidden /> {t("deliveryDays", { days: tyre.deliveryDays })}</p>
                )}
              </div>
            </div>
            <AddTyrePanel tyre={tyre} maxQuantity={tyre.quantity} className="mt-4" />
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><Info className="h-3.5 w-3.5 shrink-0" aria-hidden /> {t("buy4")}</p>
          </div>

          <div className="mt-5"><EuLabel label={tyre.euLabel} /></div>
          {tyre.eprelUrl && (
            <a href={tyre.eprelUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              {t("eprel")} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <h2 className="mt-6 mb-2 font-bold text-ink">{t("specs")}</h2>
          <dl className="divide-y divide-line rounded-lg border border-line text-sm">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-3 py-2">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
