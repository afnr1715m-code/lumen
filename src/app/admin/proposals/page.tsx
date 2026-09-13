import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createProposalAction } from "../actions";

interface ProposalRow {
  id: string;
  project_name: string;
  client_name: string;
  currency: string;
  created_at: string;
  project_milestones: { amount_cents: number; status: string }[];
}

export default async function AdminProposalsPage() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("project_proposals")
    .select("id, project_name, client_name, currency, created_at, project_milestones(amount_cents, status)")
    .order("created_at", { ascending: false });

  const proposals = (data ?? []) as ProposalRow[];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">المقترحات والدفعات</h1>

      <form
        action={createProposalAction}
        className="mt-6 grid gap-4 rounded-2xl border border-line bg-bg p-6 sm:grid-cols-3"
      >
        <label className="text-sm font-semibold text-ink">
          اسم المشروع
          <input
            name="project_name"
            required
            className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-ink"
          />
        </label>
        <label className="text-sm font-semibold text-ink">
          اسم العميل
          <input
            name="client_name"
            required
            className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-ink"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent"
          >
            إنشاء مقترح جديد
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {proposals.map((proposal) => {
          const milestones = proposal.project_milestones ?? [];
          const total = milestones.reduce((sum, m) => sum + m.amount_cents, 0);
          const paid = milestones.filter((m) => m.status === "paid").length;

          return (
            <Link
              key={proposal.id}
              href={`/admin/proposals/${proposal.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-bg p-5 transition hover:border-accent"
            >
              <div>
                <div className="font-bold text-ink">{proposal.project_name}</div>
                <div className="mt-1 text-sm text-muted">{proposal.client_name}</div>
              </div>
              <div className="text-sm text-muted">
                {new Intl.NumberFormat("ar-SA", { style: "currency", currency: proposal.currency }).format(
                  total / 100
                )}
                {" · "}
                {paid}/{milestones.length} مراحل مدفوعة
              </div>
            </Link>
          );
        })}
        {proposals.length === 0 && <p className="text-muted">ما فيه مقترحات حتى الآن.</p>}
      </div>
    </div>
  );
}
