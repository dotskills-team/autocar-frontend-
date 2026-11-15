import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageBanner } from "@/components/shared/page-banner";
import { alternatesFor } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getTyreBrands } from "@/lib/api/tyres";
import { images } from "@/lib/constants/images";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brandsPage" });
  return { title: t("metaTitle"), description: t("metaDescription"), alternates: alternatesFor("/marques", locale) };
}

export default async function BrandsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, brands] = await Promise.all([getTranslations("brandsPage"), getTyreBrands()]);

  return (
    <>
      <PageBanner title={t("title")} text={t("text")} image={images.hero} breadcrumbs={[{ label: t("title") }]} />
      <section className="container-page py-8">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {brands.map((b) => (
            <li key={b.name}>
              <Link
                href={`/pneus?marque=${encodeURIComponent(b.name)}`}
                className="group flex h-full flex-col items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 py-6 text-center transition hover:border-brand hover:shadow-[var(--shadow-card)]"
              >
                <span className="font-display text-lg leading-none font-black tracking-tight text-ink uppercase italic transition group-hover:text-brand">{b.name}</span>
                <span className="text-xs text-muted">{t("count", { count: b.count })}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
