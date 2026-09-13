"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ADMIN_COOKIE, createAdminSessionToken } from "@/lib/adminAuth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1");
  }

  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function updateInquiryStatusAction(inquiryId: string, status: string) {
  const allowed = ["new", "reviewing", "proposal_sent", "won", "lost"];
  if (!inquiryId || !allowed.includes(status)) return;
  const supabase = supabaseAdmin();
  await supabase.from("project_inquiries").update({ status }).eq("id", inquiryId);
  revalidatePath("/admin/inquiries");
}

export async function updateBookingStatusAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!bookingId || !["pending", "confirmed", "cancelled"].includes(status)) return;

  const supabase = supabaseAdmin();
  await supabase.from("bookings").update({ status }).eq("id", bookingId);

  if (status === "confirmed") {
    await supabase
      .from("payments")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("booking_id", bookingId)
      .neq("status", "paid");
  }

  revalidatePath("/admin/bookings");
}

export async function createProposalAction(formData: FormData) {
  const project_name = String(formData.get("project_name") ?? "").trim();
  const client_name = String(formData.get("client_name") ?? "").trim();
  if (!project_name || !client_name) return;

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("project_proposals")
    .insert({ project_name, client_name })
    .select("id")
    .single();

  if (error || !data) return;

  revalidatePath("/admin/proposals");
  redirect(`/admin/proposals/${data.id}`);
}

export async function addMilestoneAction(formData: FormData) {
  const proposalId = String(formData.get("proposal_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const amountSar = Number(formData.get("amount_sar"));
  const orderIndex = Number(formData.get("order_index"));
  if (!proposalId || !name || !Number.isFinite(amountSar) || amountSar <= 0) return;

  const supabase = supabaseAdmin();
  await supabase.from("project_milestones").insert({
    proposal_id: proposalId,
    name,
    amount_cents: Math.round(amountSar * 100),
    order_index: Number.isFinite(orderIndex) ? orderIndex : 0,
  });

  revalidatePath(`/admin/proposals/${proposalId}`);
}

export async function markMilestonePaidAction(formData: FormData) {
  const milestoneId = String(formData.get("milestone_id") ?? "");
  const proposalId = String(formData.get("proposal_id") ?? "");
  if (!milestoneId) return;

  const supabase = supabaseAdmin();
  await supabase
    .from("project_milestones")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("id", milestoneId);

  await supabase
    .from("payments")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("milestone_id", milestoneId)
    .neq("status", "paid");

  if (proposalId) revalidatePath(`/admin/proposals/${proposalId}`);
}
