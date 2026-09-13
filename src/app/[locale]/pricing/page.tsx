import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import PricingCategory from "@/components/PricingCategory";
import PricingConsulting from "@/components/PricingConsulting";
import PricingPostLaunch from "@/components/PricingPostLaunch";
import CtaSection from "@/components/CtaSection";
import { CONTACT_EMAIL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.pricing.headline,
    description: dict.pricing.metaDescription,
    alternates: { canonical: `/${locale}/pricing`, languages: { ar: "/ar/pricing", en: "/en/pricing" } },
  };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);
  const p = dict.pricing;

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-28">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{p.headline}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">{p.subtitle}</p>
      </section>

      {p.categories.map((category, i) => (
        <PricingCategory key={category.slug} locale={typedLocale} category={category} alt={i % 2 === 1} />
      ))}

      <PricingConsulting locale={typedLocale} dict={dict} />
      <PricingPostLaunch locale={typedLocale} dict={dict} />

      <div className="mx-auto max-w-3xl px-6 py-10 text-center lg:px-10">
        <p className="text-sm text-muted">{p.note}</p>
      </div>

      <CtaSection
        headline={p.finalCta.headline}
        subtitle={p.finalCta.subtitle}
        primaryLabel={p.finalCta.primary}
        primaryHref={`/${typedLocale}/start-project`}
        secondaryLabel={p.finalCta.secondary}
        secondaryHref={`mailto:${CONTACT_EMAIL}`}
      />
    </>
  );
}
