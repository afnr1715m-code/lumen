import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function PricingPostLaunch({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = dict.pricing.postLaunch;

  return (
    <section id={p.slug} className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
        <Reveal className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{p.title}</h2>
          <p className="mt-3 text-base text-muted">{p.description}</p>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-10 rounded-2xl border border-line bg-bg p-2">
            {p.items.map((item, i) => (
              <div
                key={item.name}
                className={`flex items-center justify-between gap-4 px-5 py-4 ${
                  i !== p.items.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <span className="text-sm font-medium text-ink">{item.name}</span>
                <span className="shrink-0 text-sm font-semibold text-accent">{item.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={`/${locale}/start-project`}
              className="inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              {p.cta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
