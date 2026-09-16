import Link from "next/link";
import Reveal from "./Reveal";
import { buttonClass } from "./buttonStyles";

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
    <section className="relative overflow-hidden border-b border-line bg-dark text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="cta-glow absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{headline}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{subtitle}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={primaryHref} className={buttonClass({ variant: "primary", surface: "dark" })}>
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className={buttonClass({ variant: "secondary", surface: "dark" })}>
              {secondaryLabel}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
