import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function ServicesGrid({ dict }: { dict: Dictionary }) {
  return (
    <section id="services" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-2xl">
          <div className="h-1 w-12 rounded-full bg-accent" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {dict.servicesSection.headline}
          </h2>
          <p className="mt-4 text-lg text-muted">{dict.servicesSection.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-line bg-bg p-7 transition duration-300 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_20px_50px_-25px_rgba(10,110,61,0.35)]">
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
                {service.priceFrom && (
                  <div className="mt-6 border-t border-line pt-5">
                    <span className="text-sm text-muted">{service.priceFrom}</span>
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
