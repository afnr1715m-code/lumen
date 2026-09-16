import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function Process({ dict }: { dict: Dictionary }) {
  return (
    <section id="process" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.process.headline}</h2>
          <p className="mt-4 text-lg text-muted">{dict.process.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {dict.process.steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-bg p-6 transition duration-300 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_20px_50px_-25px_rgba(59,82,255,0.35)]">
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
