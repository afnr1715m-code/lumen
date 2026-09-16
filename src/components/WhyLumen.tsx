import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function WhyLumen({ dict }: { dict: Dictionary }) {
  return (
    <section id="why-lumen" className="border-b border-line">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.whyLumen.headline}</h2>
          <p className="mt-4 text-lg text-muted">{dict.whyLumen.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {dict.whyLumen.features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 60}>
              <div className="border-t border-line pt-5">
                <h3 className="text-base font-bold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
