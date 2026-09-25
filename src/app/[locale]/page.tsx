import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import WhyLumen from "@/components/WhyLumen";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Industries from "@/components/Industries";
import TechStack from "@/components/TechStack";
import CtaSection from "@/components/CtaSection";
import Faq from "@/components/Faq";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: dict.services.map((service, i) => ({
      "@type": "Service",
      position: i + 1,
      name: service.title,
      description: service.description,
      provider: { "@type": "ProfessionalService", name: dict.nav.brand, url: `${SITE_URL}/${typedLocale}` },
      areaServed: "SA",
      url: `${SITE_URL}/${typedLocale}/#services`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <Hero locale={typedLocale} dict={dict} />
      <ServicesGrid dict={dict} />
      <WhyLumen dict={dict} />
      <Process dict={dict} />
      <Portfolio dict={dict} />
      <Industries dict={dict} />
      <TechStack dict={dict} />
      <Faq dict={dict} />
      <CtaSection
        headline={dict.cta.headline}
        subtitle={dict.cta.subtitle}
        primaryLabel={dict.cta.primary}
        primaryHref={`/${typedLocale}/start-project`}
        secondaryLabel={dict.cta.secondary}
        secondaryHref={`/${typedLocale}/consultations`}
      />
    </>
  );
}
