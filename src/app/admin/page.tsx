import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = supabaseAdmin();

  const [{ count: newInquiries }, { count: pendingBookings }, { count: awaitingMilestones }] = await Promise.all([
    supabase.from("project_inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("project_milestones").select("id", { count: "exact", head: true }).eq("status", "awaiting_confirmation"),
  ]);

  const cards = [
    { href: "/admin/inquiries", label: "طلبات مشاريع جديدة", value: newInquiries ?? 0 },
    { href: "/admin/bookings", label: "حجوزات بانتظار التحويل", value: pendingBookings ?? 0 },
    { href: "/admin/proposals", label: "مراحل دفع بانتظار التأكيد", value: awaitingMilestones ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">نظرة عامة</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-line bg-bg p-6 transition hover:border-accent"
          >
            <div className="text-3xl font-extrabold text-ink">{card.value}</div>
            <div className="mt-1 text-sm font-semibold text-muted">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
