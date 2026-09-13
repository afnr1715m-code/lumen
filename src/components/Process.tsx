import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function Process({ dict }: { dict: Dictionary }) {
  return (
    <section id="process" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.process.headline}</h2>
          <p className="mt-4 text-lg text-muted">{dict.process.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {dict.process.steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-bg p-6">
                <span className="text-3xl font-extrabold text-accent/30">{step.number}</span>
                <h3 className="mt-4 text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
