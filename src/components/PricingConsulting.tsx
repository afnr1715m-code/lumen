import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function PricingConsulting({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.pricing.consulting;

  return (
    <section id={c.slug} className="border-b border-line bg-dark text-white">
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
        <Reveal className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{c.title}</h2>
          <p className="mt-3 text-base text-white/70">{c.description}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/5 p-7">
              <h3 className="text-lg font-bold">{c.hourlyName}</h3>
              <p className="mt-2 text-2xl font-extrabold text-accent">{c.hourlyPrice}</p>
              <Link
                href={`/${locale}/consultations`}
                className="mt-6 rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                {c.hourlyCta}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/5 p-7">
              <h3 className="text-lg font-bold">{c.analysisName}</h3>
              <p className="mt-2 text-2xl font-extrabold text-accent">{c.analysisPrice}</p>
              <Link
                href={`/${locale}/start-project?package=${encodeURIComponent(c.analysisName)}`}
                className="mt-6 rounded-full border border-white/20 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:border-white/40"
              >
                {c.analysisCta}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
