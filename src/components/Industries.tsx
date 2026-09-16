import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function Industries({ dict }: { dict: Dictionary }) {
  return (
    <section id="industries" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.industries.headline}</h2>
          <p className="mt-4 text-lg text-muted">{dict.industries.subtitle}</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 flex flex-wrap gap-3">
            {dict.industries.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-line bg-bg px-5 py-2.5 text-sm font-medium text-ink"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">{dict.industries.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
