import Image from "next/image";
import { ArrowRight, MapPin, Phone, Plus, ScanSearch, Snowflake, Sun, CloudSun, Truck, ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buttonClasses } from "@/components/ui/button";
import { TyreSizeSearch } from "@/features/tyres/tyre-size-search";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getTyreBrands, getTyreSizes } from "@/lib/api/tyres";
import { images } from "@/lib/constants/images";
import { popularSizes, siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

/** "205/55 R16" → /pneus?largeur=205&hauteur=55&diametre=16 */
const sizeHref = (size: string) => {
  const [, w, p, d] = size.match(/(\d+)\/(\d+) R(\d+)/) ?? [];
  return `/pneus?largeur=${w}&hauteur=${p}&diametre=${d}`;
};

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[11px] font-black tracking-[0.2em] text-brand uppercase", className)}>{children}</p>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tBrands, sizes, brands] = await Promise.all([getTranslations("home"), getTranslations("brandsPage"), getTyreSizes(), getTyreBrands()]);
  const workshop = siteConfig.workshop;
  const tel = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

  const features = [
    { icon: Truck, title: t("featDelivery"), text: t("featDeliveryText") },
    { icon: MapPin, title: t("featFitting"), text: t("featFittingText", { workshop: workshop.name }) },
    { icon: ScanSearch, title: t("featSearch"), text: t("featSearchText") },
  ];

  const seasons = [
    { key: "summer", icon: Sun, tone: "bg-amber-50 text-amber-600", title: t("summerTitle"), text: t("summerText"), link: t("summerLink") },
    { key: "winter", icon: Snowflake, tone: "bg-sky-50 text-sky-600", title: t("winterTitle"), text: t("winterText"), link: t("winterLink") },
    { key: "all_season", icon: CloudSun, tone: "bg-rose-50 text-brand", title: t("allSeasonTitle"), text: t("allSeasonText"), link: t("allSeasonLink") },
  ];

  const faq = [1, 2, 3].map((n) => ({ q: t(`faq${n}q` as "faq1q"), a: t(`faq${n}a` as "faq1a") }));

  return (
    <div className="bg-[#f4f2ee]">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-ink text-white">
        {images.hero && (
          <div className="absolute inset-y-0 right-0 w-full md:w-[55%]" aria-hidden>
            <Image src={images.hero} alt="" fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-cover opacity-60 md:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgb(227_6_19/0.35),transparent_60%)]" />
          </div>
        )}
        <div className="container-page relative pt-12 pb-28 sm:pt-16 lg:pt-20 lg:pb-36">
          <Eyebrow className="flex items-center gap-3"><span className="h-px w-6 bg-brand" aria-hidden /> {t("eyebrow")}</Eyebrow>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            {t("heroTitle1")}
            <span className="block text-brand">{t("heroTitle2")}</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/80 sm:text-base">{t("heroText")}</p>
        </div>
      </section>

      {/* ---------- SIZE SEARCH ---------- */}
      <section className="container-page relative z-10 -mt-20 lg:-mt-24">
        <div className="rounded-xl border-t-4 border-brand">
          <TyreSizeSearch
            sizes={sizes}
            header={
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 px-1">
                <h2 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">{t("searchTitle")}</h2>
                <a href="#guide" className="text-xs text-muted underline underline-offset-2 hover:text-brand">{t("whereSize")}</a>
              </div>
            }
            footer={
              <div className="mt-4 flex flex-wrap items-center gap-2 px-1 text-xs text-muted">
                <span className="mr-1">{t("popularSizes")}</span>
                {popularSizes.map((s) => (
                  <Link key={s} href={sizeHref(s)} className="rounded-md border border-line bg-white px-2.5 py-1 font-semibold text-ink transition hover:border-brand hover:text-brand">{s}</Link>
                ))}
              </div>
            }
          />
        </div>
        <ul className="grid gap-4 border-b border-line py-6 sm:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="flex items-start gap-3">
              <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="text-sm font-bold">{f.title}</p>
                <p className="text-xs text-muted">{f.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- BRANDS ---------- */}
      <section className="container-page pt-8">
        <div className="rounded-xl border-t-4 border-brand bg-white px-4 py-10 text-center sm:px-8">
          <Eyebrow>{t("brandsEyebrow")}</Eyebrow>
          <h2 className="mt-3 font-display text-3xl leading-tight font-black tracking-[-0.03em] sm:text-5xl">
            {t("brandsTitle1")}
            <span className="block text-brand">{t("brandsTitle2")}</span>
          </h2>
          <p className="mt-3 text-sm text-muted">{t("brandsText")}</p>
          <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {brands.slice(0, 24).map((b, i) => (
              <li key={b.name} className={cn(i >= 12 && "hidden sm:block")}>
                <Link
                  href={`/pneus?marque=${encodeURIComponent(b.name)}`}
                  className="group flex h-full flex-col items-center justify-center gap-1.5 rounded-md border border-line px-2 py-4 transition hover:border-brand hover:shadow-[var(--shadow-card)]"
                >
                  {/* Brand wordmark in text: no third-party logo files */}
                  <span className="font-display text-lg leading-none font-black tracking-tight text-ink uppercase italic transition group-hover:text-brand">{b.name}</span>
                  <span className="text-[11px] font-semibold text-muted">{tBrands("count", { count: b.count })}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/marques" className={buttonClasses("primary", "md", "mt-8")}>
            {t("allBrands")} <Plus className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-muted">{t("brandsNote")}</p>
        </div>
      </section>

      {/* ---------- SEASONS ---------- */}
      <section className="container-page pt-14">
        <Eyebrow>{t("seasonsEyebrow")}</Eyebrow>
        <h2 className="mt-2 font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">{t("seasonsTitle")}</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {seasons.map((s) => (
            <li key={s.key}>
              <Link href={`/pneus?saison=${s.key}`} className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white p-6 transition hover:border-brand hover:shadow-[var(--shadow-card-hover)]">
                <s.icon className="pointer-events-none absolute -top-4 -right-6 h-32 w-32 text-ink/[0.06] transition group-hover:rotate-12" aria-hidden />
                <span className={cn("flex h-9 w-9 items-center justify-center rounded-md", s.tone)}><s.icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-5 text-xl font-extrabold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">
                  {s.link} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- FITTING IN BARR ---------- */}
      <section id="montage" className="container-page scroll-mt-28 pt-14">
        <div className="grid overflow-hidden rounded-xl bg-ink text-white md:grid-cols-[1.6fr_1fr]">
          <div className="p-7 sm:p-10">
            <Eyebrow>{t("fittingEyebrow")}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight font-black tracking-[-0.03em] sm:text-5xl">{t("fittingTitle")}</h2>
            <p className="mt-4 text-sm text-white/75 sm:text-base">{t("fittingText", { workshop: workshop.name })}</p>
          </div>
          <div className="flex items-center bg-[repeating-linear-gradient(135deg,#ffffff08_0_2px,transparent_2px_14px)] p-7 sm:p-10">
            <address className="border-l-2 border-brand pl-5 text-sm leading-relaxed not-italic">
              <p className="text-base font-bold">{workshop.name}</p>
              <p className="text-white/75">{workshop.address}</p>
              <p className="text-white/75">{workshop.directions}</p>
              <a href={tel} className="mt-3 inline-flex items-center gap-1.5 font-semibold underline underline-offset-4 hover:text-brand">
                <Phone className="h-4 w-4" /> {t("callWorkshop")}
              </a>
            </address>
          </div>
        </div>
      </section>

      {/* ---------- GUIDE ---------- */}
      <section id="guide" className="container-page grid scroll-mt-28 gap-8 py-14 md:grid-cols-[1fr_1.4fr] md:py-20">
        <div>
          <Eyebrow>{t("guideEyebrow")}</Eyebrow>
          <h2 className="mt-2 font-display text-3xl leading-tight font-black tracking-[-0.03em] sm:text-5xl">{t("guideTitle")}</h2>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-bold text-ink [&::-webkit-details-marker]:hidden">
                <ChevronRight className="h-4 w-4 shrink-0 text-brand transition group-open:rotate-90" aria-hidden /> {f.q}
              </summary>
              <p className="mt-3 pl-6 text-sm leading-relaxed text-ink-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
