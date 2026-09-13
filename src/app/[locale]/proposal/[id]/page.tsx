import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import ProposalView from "@/components/ProposalView";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const supabase = supabaseAdmin();

  const { data: proposal } = await supabase
    .from("project_proposals")
    .select("id, project_name, client_name, currency")
    .eq("id", id)
    .maybeSingle();

  if (!proposal) {
    return (
      <section className="mx-auto max-w-lg px-6 py-28 text-center lg:px-10">
        <h1 className="text-2xl font-bold text-ink">{dict.proposal.notFoundTitle}</h1>
        <p className="mt-3 text-muted">{dict.proposal.notFoundBody}</p>
      </section>
    );
  }

  const { data: milestones } = await supabase
    .from("project_milestones")
    .select("id, name, amount_cents, status")
    .eq("proposal_id", proposal.id)
    .order("order_index", { ascending: true });

  return (
    <ProposalView
      locale={typedLocale}
      dict={dict}
      projectName={proposal.project_name}
      clientName={proposal.client_name}
      currency={proposal.currency}
      milestones={milestones ?? []}
    />
  );
}
