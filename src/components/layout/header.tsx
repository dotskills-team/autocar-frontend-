"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, Phone, ShoppingCart, User, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Link, usePathname } from "@/i18n/navigation";
import { cartCount, useCart } from "@/features/cart/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { mainNav, siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

const tel = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

function SiteLogo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label={siteConfig.name} className="shrink-0">
      <Image src="/logo.jpeg" alt={siteConfig.name} width={935} height={311} priority className={cn("h-10 w-auto rounded-md object-contain md:h-11", className)} />
    </Link>
  );
}

function TopBar() {
  const t = useTranslations("header");
  return (
    <div className="bg-ink text-white">
      <div className="container-page flex h-8 items-center justify-center gap-3 text-[11px] font-medium sm:text-xs">
        <span>{t("topDelivery")}</span>
        <span className="h-1 w-1 rounded-full bg-brand" aria-hidden />
        <span>{t("topFitting")}</span>
        <Suspense><LanguageSwitcher className="absolute right-4 hidden scale-90 md:flex" /></Suspense>
      </div>
    </div>
  );
}

export function Header() {
  const t = useTranslations("header");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const count = hydrated ? cartCount(items) : 0;

  // Lock page scroll and close on Escape while the mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      <div className="relative"><TopBar /></div>
      <div className="border-b border-line bg-white">
        <div className="container-page flex h-16 items-center gap-4">
          <button className="-ml-2 p-2 lg:hidden" aria-label={t("openMenu")} onClick={() => setMobileOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <SiteLogo />
          <nav aria-label={t("categoriesNav")} className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-7 text-sm font-semibold text-ink">
              {mainNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative py-2 transition hover:text-brand",
                      isActive(item.href) && "text-brand after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-brand",
                    )}
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-1 sm:gap-3 lg:ml-0">
            <a href={tel} className="hidden items-center gap-2 text-sm font-semibold text-ink hover:text-brand md:flex">
              <Phone className="h-4 w-4" /> {t("callWorkshop")}
            </a>
            <Link href="/compte" aria-label={t("account")} className="p-2 text-ink hover:text-brand">
              <User className="h-5 w-5" />
            </Link>
            <button onClick={openCart} className="relative p-2 text-ink hover:text-brand" aria-label={t("cartAria", { count })}>
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{count}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t("menu")}>
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <SiteLogo className="h-9" />
              <button onClick={() => setMobileOpen(false)} aria-label={t("closeMenu")} className="p-2 text-ink">
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto py-2">
              {mainNav.map((item) => (
                <li key={item.key}>
                  <Link onClick={() => setMobileOpen(false)} href={item.href} className="block border-b border-line px-5 py-3.5 font-semibold text-ink hover:text-brand">
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-line p-4">
              <a href={tel} className="flex items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-bold text-white">
                <Phone className="h-4 w-4" /> {t("callWorkshop")}
              </a>
              <Suspense><LanguageSwitcher tone="light" className="mx-auto" /></Suspense>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
