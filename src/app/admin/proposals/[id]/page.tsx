import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { addMilestoneAction, markMilestonePaidAction } from "../../actions";
import { SITE_URL } from "@/lib/site";
import CopyLinkButton from "./CopyLinkButton";

const STATUS_LABEL: Record<string, string> = {
  pending: "لم يحن موعدها",
  awaiting_confirmation: "بانتظار تأكيد التحويل",
  paid: "تم الدفع",
};

export default async function AdminProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = supabaseAdmin();

  const { data: proposal } = await supabase
    .from("project_proposals")
    .select("id, project_name, client_name, currency")
    .eq("id", id)
    .maybeSingle();

  if (!proposal) notFound();

  const { data: milestones } = await supabase
    .from("project_milestones")
    .select("id, name, amount_cents, status, order_index")
    .eq("proposal_id", id)
    .order("order_index", { ascending: true });

  const nextOrderIndex = (milestones?.length ?? 0) + 1;
  const clientLink = `${SITE_URL}/ar/proposal/${proposal.id}`;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">{proposal.project_name}</h1>
      <p className="mt-1 text-muted">{proposal.client_name}</p>

      <div className="mt-4">
        <CopyLinkButton link={clientLink} />
      </div>

      <div className="mt-8 space-y-3">
        {(milestones ?? []).map((milestone) => (
          <div
            key={milestone.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-bg p-5"
          >
            <div>
              <div className="font-bold text-ink">{milestone.name}</div>
              <div className="mt-1 text-sm text-muted">
                {new Intl.NumberFormat("ar-SA", { style: "currency", currency: proposal.currency }).format(
                  milestone.amount_cents / 100
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
                {STATUS_LABEL[milestone.status] ?? milestone.status}
              </span>
              {milestone.status !== "paid" && (
                <form action={markMilestonePaidAction}>
                  <input type="hidden" name="milestone_id" value={milestone.id} />
                  <input type="hidden" name="proposal_id" value={proposal.id} />
                  <button
                    type="submit"
                    className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-accent"
                  >
                    تأكيد استلام المبلغ
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
        {(milestones ?? []).length === 0 && <p className="text-muted">ما فيه مراحل دفع بعد.</p>}
      </div>

      <form
        action={addMilestoneAction}
        className="mt-8 grid gap-4 rounded-2xl border border-line bg-bg p-6 sm:grid-cols-4"
      >
        <input type="hidden" name="proposal_id" value={proposal.id} />
        <input type="hidden" name="order_index" value={nextOrderIndex} />
        <label className="text-sm font-semibold text-ink sm:col-span-2">
          اسم المرحلة
          <input
            name="name"
            required
            placeholder="مثال: الدفعة الأولى - البداية"
            className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-ink"
          />
        </label>
        <label className="text-sm font-semibold text-ink">
          المبلغ (ر.س.)
          <input
            name="amount_sar"
            type="number"
            min="1"
            step="0.01"
            required
            className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-ink"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent"
          >
            إضافة مرحلة
          </button>
        </div>
      </form>
    </div>
  );
}
