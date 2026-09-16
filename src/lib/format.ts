import type { Locale } from "@/lib/i18n/config";

export function formatCurrency(cents: number, currency: string, locale: Locale = "ar"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatRiyadhDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ar-SA", {
    timeZone: "Asia/Riyadh",
    dateStyle: "full",
    timeStyle: "short",
  });
}
