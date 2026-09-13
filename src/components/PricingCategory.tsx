import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { PricingCategory as PricingCategoryData } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function PricingCategory({
  locale,
  category,
  alt = false,
}: {
  locale: Locale;
  category: PricingCategoryData;
  alt?: boolean;
}) {
  return (
    <section id={category.slug} className={`border-b border-line ${alt ? "bg-surface" : ""}`}>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <Reveal className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{category.title}</h2>
          <p className="mt-3 text-base text-muted">{category.description}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {category.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 60}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-bg p-6 transition hover:border-accent">
                <h3 className="text-base font-bold text-ink">{tier.name}</h3>
                <p className="mt-2 text-lg font-extrabold text-accent">{tier.price}</p>
                <Link
                  href={`/${locale}/start-project?package=${encodeURIComponent(tier.name)}`}
                  className="mt-6 rounded-full bg-ink px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-accent"
                >
                  {tier.ctaLabel ?? category.ctaLabel}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
