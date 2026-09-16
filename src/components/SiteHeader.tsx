import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNav from "./MobileNav";
import LumenMark from "./LumenMark";
import { buttonClass } from "./buttonStyles";

export default function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href={`/${locale}`} className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink">
          <LumenMark size={26} className="text-accent" />
          {dict.nav.brand}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {dict.nav.links.map((link) => (
            <Link
              key={link.label}
              href={`/${locale}${link.href}`}
              className="relative text-sm font-medium text-muted transition hover:text-ink after:absolute after:-bottom-1 after:start-0 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} label={dict.nav.languageToggle} />
          <Link href={`/${locale}/consultations`} className={buttonClass({ variant: "secondary", size: "sm" })}>
            {dict.nav.bookConsultation}
          </Link>
          <Link href={`/${locale}/start-project`} className={buttonClass({ variant: "primary", size: "sm" })}>
            {dict.nav.startProject}
          </Link>
        </div>

        <MobileNav locale={locale} dict={dict} />
      </div>
    </header>
  );
}
