import { Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Tyre } from "@/types";
import { PriceTag, StockBadge } from "@/components/shared";
import { Link } from "@/i18n/navigation";
import { AddTyreButton } from "./add-tyre-to-cart";
import { EuLabel, SeasonBadge } from "./tyre-bits";
import { TyreImage } from "./tyre-image";

export function TyreCard({ tyre }: { tyre: Tyre }) {
  const t = useTranslations("tyres");
  return (
    <article className="group flex h-full flex-col rounded-lg border border-line bg-white p-2 transition sm:p-3 hover:border-brand hover:shadow-[var(--shadow-card-hover)]">
      <Link href={`/pneus/${tyre.slug}`} className="relative block">
        <TyreImage src={tyre.image} alt={tyre.name} className="transition group-hover:scale-[1.02]" />
        <SeasonBadge season={tyre.season} className="absolute top-2 left-2" />
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs font-black tracking-wide text-brand uppercase">{tyre.brand}</p>
        <Link href={`/pneus/${tyre.slug}`} className="mt-0.5 line-clamp-1 font-bold text-ink hover:text-brand">{tyre.pattern}</Link>
        <p className="text-sm text-ink-700">
          {tyre.size} <span className="text-muted">{tyre.loadIndex}{tyre.speedIndex}</span>
          {tyre.markings.map((m) => <span key={m} className="ml-1.5 rounded bg-surface px-1 text-[10px] font-bold text-ink">{m}</span>)}
        </p>
        <div className="mt-2.5 hidden min-[420px]:block"><EuLabel label={tyre.euLabel} compact /></div>
        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
            <StockBadge status={tyre.stock} />
            {tyre.deliveryDays !== null && (
              <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5" aria-hidden /> {t("deliveryIncluded")}</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
            <div>
              <PriceTag value={tyre.priceTTC} />
              <p className="text-[11px] text-muted">{t("perTyre")}</p>
            </div>
            <AddTyreButton tyre={tyre} />
          </div>
        </div>
      </div>
    </article>
  );
}
