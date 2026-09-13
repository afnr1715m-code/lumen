import { supabaseAdmin } from "@/lib/supabase/server";
import StatusSelect from "./StatusSelect";

export default async function AdminInquiriesPage() {
  const supabase = supabaseAdmin();
  const { data: inquiries } = await supabase
    .from("project_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">طلبات المشاريع</h1>

      <div className="mt-6 space-y-4">
        {(inquiries ?? []).map((inquiry) => (
          <div key={inquiry.id} className="rounded-2xl border border-line bg-bg p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-bold text-ink">
                  {inquiry.name}
                  {inquiry.company ? ` — ${inquiry.company}` : ""}
                </div>
                <div className="mt-1 text-sm text-muted">
                  {inquiry.email} · {inquiry.phone}
                </div>
                <div className="mt-1 text-sm text-muted">
                  {inquiry.project_type}
                  {inquiry.budget ? ` · الميزانية: ${inquiry.budget}` : ""}
                  {inquiry.timeline ? ` · الموعد: ${inquiry.timeline}` : ""}
                </div>
              </div>
              <StatusSelect inquiryId={inquiry.id} status={inquiry.status} />
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm text-ink">{inquiry.details}</p>
            <div className="mt-3 text-xs text-muted">
              {new Date(inquiry.created_at).toLocaleString("ar-SA", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          </div>
        ))}
        {(inquiries ?? []).length === 0 && <p className="text-muted">ما فيه طلبات مشاريع حتى الآن.</p>}
      </div>
    </div>
  );
}
