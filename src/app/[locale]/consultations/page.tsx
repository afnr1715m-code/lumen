import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.consultationsIndex.headline,
    description: dict.consultationsIndex.subtitle,
    alternates: { canonical: `/${locale}/consultations`, languages: { ar: "/ar/consultations", en: "/en/consultations" } },
  };
}

export default async function ConsultationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);
  const c = dict.consultationsIndex;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{c.headline}</h1>
        <p className="mt-4 text-lg text-muted">{c.subtitle}</p>
        <p className="mt-4 text-sm text-muted">{c.flowNote}</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {c.categories.map((category, i) => (
          <Reveal key={category.slug} delay={i * 60}>
            <div className="flex h-full flex-col rounded-2xl border border-line p-7">
              <h2 className="text-lg font-bold text-ink">{category.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{category.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.focus.map((item) => (
                  <li key={item} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
                <div>
                  <div className="text-muted">{c.durationLabel}</div>
                  <div className="font-semibold text-ink">{c.durationValue}</div>
                </div>
                <div>
                  <div className="text-muted">{c.priceLabel}</div>
                  <div className="font-semibold text-ink">{c.priceValue}</div>
                </div>
              </div>
              <Link
                href={`/${typedLocale}/consultations/${category.slug}`}
                className="mt-6 rounded-full bg-ink px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-accent"
              >
                {c.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
