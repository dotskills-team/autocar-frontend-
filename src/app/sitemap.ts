import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllTyreSlugs } from "@/lib/api/tyres";
import { infoPageSlugs } from "@/lib/constants/info-pages";
import { siteConfig } from "@/lib/constants/site";

/** One entry per page, in the default locale, with hreflang alternates for every locale. */
function entry(href: string, lastModified: Date, priority: number): MetadataRoute.Sitemap[number] {
  const url = (locale: (typeof routing.locales)[number]) => `${siteConfig.url}${getPathname({ href, locale })}`;
  return {
    url: url(routing.defaultLocale),
    lastModified,
    priority,
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, url(l)])) },
  };
}

// For a very large catalogue, split into several sitemaps with generateSitemaps().
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllTyreSlugs();
  const now = new Date();
  return [
    entry("/", now, 1),
    entry("/pneus", now, 0.9),
    entry("/marques", now, 0.8),
    ...slugs.map((slug) => entry(`/pneus/${slug}`, now, 0.6)),
    ...infoPageSlugs.map((p) => entry(`/${p}`, now, 0.3)),
  ];
}
