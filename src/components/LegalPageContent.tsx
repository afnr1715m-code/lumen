import type { LegalPage } from "@/lib/i18n/types";

export default function LegalPageContent({ page }: { page: LegalPage }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 lg:px-10 lg:py-28">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{page.title}</h1>
      <p className="mt-2 text-sm text-muted">{page.updated}</p>
      <p className="mt-6 text-base leading-relaxed text-muted">{page.intro}</p>

      <div className="mt-10 space-y-8">
        {page.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-lg font-bold text-ink">{section.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 rounded-2xl bg-surface p-5 text-xs leading-relaxed text-muted">{page.disclaimer}</p>
    </section>
  );
}
