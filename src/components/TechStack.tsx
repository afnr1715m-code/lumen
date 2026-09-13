import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function TechStack({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.techStack.headline}</h2>
          <p className="mt-4 text-lg text-muted">{dict.techStack.subtitle}</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {dict.techStack.items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-center rounded-xl border border-line px-4 py-5 text-center text-sm font-semibold text-muted transition hover:border-accent hover:text-accent"
              >
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
