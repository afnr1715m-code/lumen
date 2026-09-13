import Link from "next/link";
import Reveal from "./Reveal";

interface CtaSectionProps {
  headline: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export default function CtaSection({
  headline,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CtaSectionProps) {
  return (
    <section className="border-b border-line bg-dark text-white">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-10">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{headline}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{subtitle}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={primaryHref}
              className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-strong"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/40"
            >
              {secondaryLabel}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
