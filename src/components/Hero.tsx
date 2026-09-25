import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { buttonClass } from "./buttonStyles";
import HeroGlow from "./HeroGlow";
import Reveal from "./Reveal";
import HeroScene3D from "./HeroScene3DClient";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden border-b border-line bg-dark text-white">
      <HeroGlow />

      <div className="pointer-events-none absolute inset-0">
        <HeroScene3D />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-24 text-center lg:px-10">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/70">
            {dict.hero.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={90}>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {dict.hero.title}
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">{dict.hero.subtitle}</p>
        </Reveal>
        <Reveal delay={270}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={`/${locale}/start-project`} className={buttonClass({ variant: "primary", surface: "dark" })}>
              {dict.hero.primaryCta}
            </Link>
            <Link href={`/${locale}/#services`} className={buttonClass({ variant: "secondary", surface: "dark" })}>
              {dict.hero.secondaryCta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
