import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import BookingFlow from "@/components/BookingFlow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const category = dict.consultationsIndex.categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
    alternates: {
      canonical: `/${locale}/consultations/${slug}`,
      languages: { ar: `/ar/consultations/${slug}`, en: `/en/consultations/${slug}` },
    },
  };
}

export default async function ConsultationBookingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);
  const category = dict.consultationsIndex.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const { data: consultationType } = await supabaseAdmin()
    .from("consultation_types")
    .select("id, duration_minutes, price_cents, currency")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!consultationType) notFound();

  const priceLabel =
    consultationType.price_cents != null
      ? formatCurrency(consultationType.price_cents, consultationType.currency, typedLocale)
      : dict.consultationsIndex.priceValue;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20 lg:px-10 lg:py-28">
      <Link href={`/${typedLocale}/consultations`} className="text-sm font-medium text-accent">
        ← {dict.booking.backToConsultations}
      </Link>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{category.title}</h1>
      <p className="mt-3 text-muted">{category.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {category.focus.map((item) => (
          <span key={item} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-6 rounded-2xl border border-line bg-surface p-5 text-sm">
        <div>
          <div className="text-muted">{dict.consultationsIndex.durationLabel}</div>
          <div className="font-semibold text-ink">
            {consultationType.duration_minutes} {dict.common.minutes}
          </div>
        </div>
        <div>
          <div className="text-muted">{dict.consultationsIndex.priceLabel}</div>
          <div className="font-semibold text-ink">{priceLabel}</div>
        </div>
      </div>

      <div className="mt-12">
        <BookingFlow
          locale={typedLocale}
          dict={dict}
          category={category}
          consultationTypeId={consultationType.id}
          priceLabel={priceLabel}
        />
      </div>
    </section>
  );
}
