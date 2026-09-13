import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { CONTACT_EMAIL } from "@/lib/site";
import LumenMark from "./LumenMark";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lumen-company-4a732a433" },
  { label: "TikTok", href: "https://www.tiktok.com/@lumen1469" },
  { label: "WhatsApp", href: "https://wa.me/966564126183" },
];

export default function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-dark text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <span className="flex items-center gap-2.5 text-xl font-extrabold text-white">
              <LumenMark size={24} className="text-accent" />
              {dict.nav.brand}
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">{dict.footer.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{dict.footer.linksHeadline}</h3>
            <ul className="mt-4 space-y-3">
              {dict.footer.links.map((link) => (
                <li key={link.label}>
                  <Link href={`/${locale}${link.href}`} className="text-sm transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{dict.footer.socialHeadline}</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm transition hover:text-white" dir="ltr">
                  {CONTACT_EMAIL}
                </a>
              </li>
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm transition hover:text-white"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs">
          <span>© {year} {dict.nav.brand}. {dict.footer.rights}.</span>
          <div className="flex flex-wrap gap-5">
            {dict.footer.legalLinks.map((link) => (
              <Link key={link.label} href={`/${locale}${link.href}`} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
