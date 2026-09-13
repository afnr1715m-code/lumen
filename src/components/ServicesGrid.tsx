import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function ServicesGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const arrow = locale === "ar" ? "←" : "→";

  return (
    <section id="services" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {dict.servicesSection.headline}
          </h2>
          <p className="mt-4 text-lg text-muted">{dict.servicesSection.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-line bg-bg p-7 transition hover:border-accent hover:shadow-[0_20px_50px_-25px_rgba(59,82,255,0.35)]">
                <span className="text-sm font-semibold text-accent">{service.number}</span>
                <h3 className="mt-3 text-lg font-bold text-ink">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.items.slice(0, 5).map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted group-hover:bg-accent/10 group-hover:text-accent"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                {service.pricingAnchor !== undefined && (
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                    {service.priceFrom ? (
                      <span className="text-sm text-muted">{service.priceFrom}</span>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={`/${locale}/pricing${service.pricingAnchor ? `#${service.pricingAnchor}` : ""}`}
                      className="text-sm font-semibold text-accent transition hover:text-accent-strong"
                    >
                      {dict.pricing.viewPricing} {arrow}
                    </Link>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
