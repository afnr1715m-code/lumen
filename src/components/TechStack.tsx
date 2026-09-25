import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function TechStack({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-2xl">
          <div className="h-1 w-12 rounded-full bg-accent" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.techStack.headline}</h2>
          <p className="mt-4 text-lg text-muted">{dict.techStack.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {dict.techStack.items.map((item, i) => (
            <Reveal key={item} delay={i * 30}>
              <div className="flex items-center justify-center rounded-xl border border-line px-4 py-5 text-center text-sm font-semibold text-muted transition duration-300 ease-out hover:-translate-y-1 hover:border-accent hover:bg-accent-soft hover:text-accent">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
