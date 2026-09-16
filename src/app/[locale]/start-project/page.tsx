import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import StartProjectForm from "@/components/StartProjectForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.startProject.headline,
    description: dict.startProject.subtitle,
    alternates: { canonical: `/${locale}/start-project`, languages: { ar: "/ar/start-project", en: "/en/start-project" } },
  };
}

export default async function StartProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ package?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const { package: packageName } = await searchParams;
  let initialDetails: string | undefined;
  if (packageName) {
    initialDetails =
      typedLocale === "ar" ? `مهتم بباقة: ${packageName}` : `Interested in the "${packageName}" package.`;
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-20 lg:px-10 lg:py-28">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.startProject.headline}</h1>
      <p className="mt-4 text-lg text-muted">{dict.startProject.subtitle}</p>
      <div className="mt-12">
        <StartProjectForm dict={dict} initialDetails={initialDetails} />
      </div>
    </section>
  );
}
