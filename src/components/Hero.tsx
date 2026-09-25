import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { buttonClass } from "./buttonStyles";
import HeroGlow from "./HeroGlow";
import Reveal from "./Reveal";
import HeroScene3D from "./HeroScene3DClient";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <HeroGlow />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-32">
        <div>
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold tracking-wide text-muted">
              {dict.hero.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {dict.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{dict.hero.subtitle}</p>
          </Reveal>
          <Reveal delay={270}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href={`/${locale}/start-project`} className={buttonClass({ variant: "primary" })}>
                {dict.hero.primaryCta}
              </Link>
              <Link href={`/${locale}/#services`} className={buttonClass({ variant: "secondary" })}>
                {dict.hero.secondaryCta}
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150} className="relative mx-auto aspect-square w-full max-w-md">
          <HeroScene3D />
        </Reveal>
      </div>
    </section>
  );
}
