import { NextResponse } from "next/server";
import { supabaseAdmin, unwrapRelation } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import { notifyMilestonePaymentClaimed } from "@/lib/notify";

export async function POST(request: Request) {
  const body = await request.json();
  const { milestoneId } = body ?? {};

  if (!milestoneId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  const { data: milestone, error: milestoneError } = await supabase
    .from("project_milestones")
    .select("id, name, amount_cents, status, proposal_id, project_proposals(project_name, client_name, currency)")
    .eq("id", milestoneId)
    .single();

  if (milestoneError || !milestone) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (milestone.status !== "pending") {
    return NextResponse.json({ error: "invalid_status" }, { status: 409 });
  }

  const proposal = unwrapRelation(milestone.project_proposals);

  const { error: updateError } = await supabase
    .from("project_milestones")
    .update({ status: "awaiting_confirmation", updated_at: new Date().toISOString() })
    .eq("id", milestoneId);

  if (updateError) {
    console.error("milestone update failed:", updateError);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    milestone_id: milestoneId,
    amount_cents: milestone.amount_cents,
    currency: proposal?.currency ?? "SAR",
    status: "pending",
    provider: "bank_transfer",
  });

  if (paymentError) {
    console.error("payment insert failed:", paymentError);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const amountLabel = formatCurrency(milestone.amount_cents, proposal?.currency ?? "SAR");

  await notifyMilestonePaymentClaimed({
    projectName: proposal?.project_name ?? "",
    clientName: proposal?.client_name ?? "",
    milestoneName: milestone.name,
    amountLabel,
    proposalId: milestone.proposal_id,
  });

  return NextResponse.json({ ok: true });
}
