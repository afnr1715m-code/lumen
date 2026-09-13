import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 start-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-32">
        <div>
          <span className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold tracking-wide text-muted">
            {dict.hero.eyebrow}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {dict.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{dict.hero.subtitle}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}/start-project`}
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-accent"
            >
              {dict.hero.primaryCta}
            </Link>
            <Link
              href={`/${locale}/#services`}
              className="rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
            >
              {dict.hero.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <SystemGraphic />
        </div>
      </div>
    </section>
  );
}

function SystemGraphic() {
  const nodes = [
    { x: 50, y: 12 },
    { x: 14, y: 40 },
    { x: 86, y: 40 },
    { x: 30, y: 78 },
    { x: 70, y: 78 },
    { x: 50, y: 50 },
  ];
  const edges: [number, number][] = [
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [1, 3],
    [2, 4],
  ];

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="var(--color-line)"
          strokeWidth="0.5"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 5 ? 5 : 3}
          fill={i === 5 ? "var(--color-accent)" : "#ffffff"}
          stroke={i === 5 ? "var(--color-accent)" : "var(--color-ink)"}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
