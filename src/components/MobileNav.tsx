"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span className={`block h-0.5 w-5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`block h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-bg px-6 py-6 shadow-lg">
          <nav className="flex flex-col gap-4">
            {dict.nav.links.map((link) => (
              <Link
                key={link.label}
                href={`/${locale}${link.href}`}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/${locale}/consultations`}
              onClick={() => setOpen(false)}
              className="rounded-full border border-line px-4 py-2.5 text-center text-sm font-medium text-ink"
            >
              {dict.nav.bookConsultation}
            </Link>
            <Link
              href={`/${locale}/start-project`}
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              {dict.nav.startProject}
            </Link>
            <div className="pt-2">
              <LanguageSwitcher locale={locale} label={dict.nav.languageToggle} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
