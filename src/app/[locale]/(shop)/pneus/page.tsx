import type { Metadata } from "next";
import { Suspense } from "react";
import { Info } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EmptyState } from "@/components/shared";
import { PageBanner } from "@/components/shared/page-banner";
import { Pagination } from "@/features/tyres/url-params";
import { TyreCard } from "@/features/tyres/tyre-card";
import { TyreFilters, TyreSort } from "@/features/tyres/tyre-filters";
import { TyreSizeSearch } from "@/features/tyres/tyre-size-search";
import { alternatesFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getTyreSizes, parseTyreParams, searchTyres, tyresAreDemo } from "@/lib/api/tyres";
import { images } from "@/lib/constants/images";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tyres" });
  return { title: t("metaTitle"), description: t("metaDescription"), alternates: alternatesFor("/pneus", locale) };
}

export default async function TyresPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filters = parseTyreParams(await searchParams);
  const [t, result, sizes] = await Promise.all([getTranslations("tyres"), searchTyres(filters), getTyreSizes()]);

  return (
    <>
      <PageBanner title={t("title")} text={t("bannerText")} image={images.hero} breadcrumbs={[{ label: t("title") }]} />

      <section className="container-page relative z-10 -mt-4 sm:-mt-6">
        <h2 className="sr-only">{t("searchTitle")}</h2>
        <TyreSizeSearch
          key={`${filters.width}-${filters.profile}-${filters.diameter}-${filters.season}`}
          sizes={sizes}
          initial={filters}
        />
      </section>

      <div className="container-page grid gap-6 py-8 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block">
          <Suspense><TyreFilters facets={result.facets} /></Suspense>
        </aside>

        <section>
          {tyresAreDemo && (
            <p className="mb-4 flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {t("demo")}
            </p>
          )}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">{t("results", { count: result.total })}</p>
            <Suspense><TyreSort /></Suspense>
          </div>
          <details className="mb-4 rounded-lg border border-line p-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-bold">{t("filters")}</summary>
            <div className="mt-3"><Suspense><TyreFilters facets={result.facets} /></Suspense></div>
          </details>

          {result.items.length ? (
            <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3">
              {result.items.map((tyre) => (
                <li key={tyre.id}><TyreCard tyre={tyre} /></li>
              ))}
            </ul>
          ) : (
            <EmptyState title={t("noResults")} text={t("sizeHelp")} />
          )}
          <Suspense><Pagination page={result.page} totalPages={result.totalPages} /></Suspense>
        </section>
      </div>
    </>
  );
}
