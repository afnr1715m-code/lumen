"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import LanguageSwitcher from "./LanguageSwitcher";
import { buttonClass } from "./buttonStyles";

export default function MobileNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

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
        <>
          <div
            className="menu-backdrop-in fixed inset-0 z-40 bg-ink/40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="menu-panel-in absolute inset-x-0 top-full z-50 border-b border-line bg-bg px-6 py-6 shadow-lg">
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
                className={buttonClass({ variant: "secondary", size: "touch" })}
              >
                {dict.nav.bookConsultation}
              </Link>
              <Link
                href={`/${locale}/start-project`}
                onClick={() => setOpen(false)}
                className={buttonClass({ variant: "primary", size: "touch" })}
              >
                {dict.nav.startProject}
              </Link>
              <div className="pt-2">
                <LanguageSwitcher locale={locale} label={dict.nav.languageToggle} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
