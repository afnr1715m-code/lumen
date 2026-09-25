import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function WhyLumen({ dict }: { dict: Dictionary }) {
  return (
    <section id="why-lumen" className="border-b border-line">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-2xl">
          <div className="h-1 w-12 rounded-full bg-accent" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.whyLumen.headline}</h2>
          <p className="mt-4 text-lg text-muted">{dict.whyLumen.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.whyLumen.features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-line bg-bg p-6 transition duration-300 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_20px_50px_-25px_rgba(10,110,61,0.35)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
