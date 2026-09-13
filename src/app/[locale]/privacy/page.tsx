import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import LegalPageContent from "@/components/LegalPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.legal.privacy.title,
    description: dict.legal.privacy.intro,
    alternates: { canonical: `/${locale}/privacy`, languages: { ar: "/ar/privacy", en: "/en/privacy" } },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);
  return <LegalPageContent page={dict.legal.privacy} />;
}
