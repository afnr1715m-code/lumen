import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import "../globals.css";
import { dirFor, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.title, template: `%s · ${dict.nav.brand}` },
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      siteName: dict.nav.brand,
      url: `/${locale}`,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`/${locale}/opengraph-image`],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: dict.nav.brand,
    description: dict.meta.description,
    url: `${SITE_URL}/${typedLocale}`,
    areaServed: "SA",
    address: { "@type": "PostalAddress", addressCountry: "SA" },
  };

  return (
    <html lang={typedLocale} dir={dirFor(typedLocale)} className={`${tajawal.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SiteHeader locale={typedLocale} dict={dict} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={typedLocale} dict={dict} />
      </body>
    </html>
  );
}
