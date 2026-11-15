import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { footerLinks, siteConfig } from "@/lib/constants/site";

/** Card brand marks (simplified, no external assets). */
function PaymentMarks() {
  const badge = "flex h-7 w-11 items-center justify-center rounded bg-white";
  return (
    <>
      <li className={badge}><span className="rounded bg-[#1b3f8b] px-1 text-[9px] font-black text-white">CB</span></li>
      <li className={badge}><span className="text-[11px] font-black text-[#1a1f71] italic">VISA</span></li>
      <li className={badge}>
        <span className="flex" aria-label="Mastercard">
          <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
          <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#f79e1b]/90" />
        </span>
      </li>
      <li className={badge}><span className="text-[10px] font-black text-[#003087] italic">Pay<span className="text-[#009cde]">Pal</span></span></li>
    </>
  );
}

export function Footer() {
  const t = useTranslations();
  const { phone, address } = siteConfig.contact;
  const link = "transition hover:text-white";
  return (
    <footer className="bg-ink text-white">
      <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <Link href="/" aria-label={siteConfig.name} className="inline-block">
          <Image src="/logo.jpeg" alt={siteConfig.name} width={935} height={311} className="h-11 w-auto object-contain" />
        </Link>
        <nav aria-label={t("footer.shop")}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
            {footerLinks.shop.map((l) => (
              <li key={l.key}><Link href={l.href} className={link}>{t(`footer.links.${l.key}`)}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page grid gap-6 py-6 text-xs text-white/60 md:grid-cols-[1fr_auto_auto] md:items-center">
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0 text-brand" /> {address}</li>
            <li><a href={`tel:${phone.replace(/\s/g, "")}`} className={`flex items-center gap-2 ${link}`}><Phone className="h-3.5 w-3.5 shrink-0 text-brand" /> {phone}</a></li>
          </ul>
          <nav aria-label={t("footer.legalTitle")}>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {footerLinks.legal.map((l) => (
                <li key={l.key}><Link href={l.href} className={link}>{t(`footer.links.${l.key}`)}</Link></li>
              ))}
            </ul>
          </nav>
          <ul className="flex items-center gap-1.5" aria-label={t("footer.paymentMethods")}>
            <PaymentMarks />
          </ul>
        </div>
        <p className="container-page pb-6 text-xs text-white/40">{t("footer.rights", { year: new Date().getFullYear(), name: siteConfig.name })}</p>
      </div>
    </footer>
  );
}
