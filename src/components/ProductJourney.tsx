import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function ProductJourney({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line bg-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-semibold text-accent">{dict.productJourney.eyebrow}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{dict.productJourney.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">{dict.productJourney.description}</p>
        </Reveal>

        <Reveal delay={120}>
          <ol className="mt-14 flex flex-wrap gap-3">
            {dict.productJourney.steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium">
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </span>
                {i < dict.productJourney.steps.length - 1 && (
                  <span className="text-white/25 rtl:rotate-180">→</span>
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
