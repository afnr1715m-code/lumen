import type { Dictionary } from "@/lib/i18n/types";
import type { PortfolioIcon } from "@/lib/i18n/types";
import Reveal from "./Reveal";

function ProjectIcon({ icon }: { icon: PortfolioIcon }) {
  if (icon === "funnel") {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <path d="M5 6h24l-8.5 10.5v9L13.5 29v-12.5L5 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "delivery") {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <path d="M5 10h14v10H5V10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M19 14h5l4 4v2h-9v-6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="11" cy="23.5" r="2.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="23.5" r="2.2" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (icon === "chat") {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <path
          d="M6 8.5A2.5 2.5 0 0 1 8.5 6h17A2.5 2.5 0 0 1 28 8.5v11A2.5 2.5 0 0 1 25.5 22H14l-6 5v-5H8.5A2.5 2.5 0 0 1 6 19.5v-11Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="12.5" cy="14" r="1.4" fill="currentColor" />
        <circle cx="17" cy="14" r="1.4" fill="currentColor" />
        <circle cx="21.5" cy="14" r="1.4" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect x="5" y="5" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M17 12v10M12 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Portfolio({ dict }: { dict: Dictionary }) {
  return (
    <section id="portfolio" className="border-b border-line bg-accent/5">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.portfolio.headline}</h2>
          <p className="mt-4 text-lg text-muted">{dict.portfolio.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.portfolio.projects.map((project, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="overflow-hidden rounded-2xl border border-line bg-bg transition duration-300 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_20px_50px_-25px_rgba(59,82,255,0.35)]">
                <div
                  className={`flex aspect-[4/3] flex-col items-center justify-center gap-3 ${
                    project.icon === "placeholder" ? "bg-surface text-muted" : "bg-accent/5 text-accent"
                  }`}
                >
                  <ProjectIcon icon={project.icon} />
                  {project.icon === "placeholder" && (
                    <span className="text-xs font-medium">{dict.portfolio.placeholderNote}</span>
                  )}
                </div>
                <div className="p-7">
                  <h3 className="text-base font-bold text-ink">{project.name}</h3>
                  <p className="mt-1 text-xs font-medium text-accent">{project.industry} · {project.services}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
