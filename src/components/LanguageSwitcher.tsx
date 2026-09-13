"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

const LOCALE_COOKIE = "lumen_locale";

export default function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const targetLocale: Locale = locale === "ar" ? "en" : "ar";

  const handleSwitch = () => {
    const rest = pathname.replace(/^\/(ar|en)/, "") || "/";
    const nextPath = `/${targetLocale}${rest === "/" ? "" : rest}`;
    document.cookie = `${LOCALE_COOKIE}=${targetLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.push(nextPath);
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
    >
      {label}
    </button>
  );
}
