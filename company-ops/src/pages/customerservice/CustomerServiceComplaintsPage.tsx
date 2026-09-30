import { useState } from "react";
import { Plus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Field, { Input, Textarea } from "@/components/ui/Field";
import StatusBadge from "@/components/ui/StatusBadge";
import Drawer from "@/components/ui/Drawer";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { COMPLAINT_STATUS_TONE } from "@/lib/labels";
import { formatArabicDateTime } from "@/utils/date";
import type { ComplaintStatus } from "@/types/domain";

const STATUS_OPTIONS: ComplaintStatus[] = ["جديدة", "قيد المعالجة", "تم الحل"];

export default function CustomerServiceComplaintsPage() {
  const complaints = useOpsStore((s) => s.complaints);
  const addComplaint = useOpsStore((s) => s.addComplaint);
  const updateComplaintStatus = useOpsStore((s) => s.updateComplaintStatus);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !currentUser) return;
    addComplaint({ clientName, phone, complaintType, details, notes: "", createdBy: currentUser.id }, currentUser.id);
    setClientName("");
    setPhone("");
    setComplaintType("");
    setDetails("");
    setDrawerOpen(false);
  }

  const sorted = [...complaints].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <AppShell title="الشكاوى">
      <Card
        title="شكاوى العملاء"
        action={
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={15} /> إضافة شكوى
          </Button>
        }
      >
        {sorted.length === 0 ? (
          <EmptyState label="لا توجد شكاوى مسجلة بعد" />
        ) : (
          <div className="space-y-3">
            {sorted.map((c) => (
              <div key={c.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">
                      {c.clientName} <span className="text-xs font-normal text-muted">· {c.phone}</span>
                    </p>
                    <p className="mt-1 text-xs font-semibold text-accent">{c.complaintType}</p>
                    <p className="mt-2 text-sm text-ink/80">{c.details}</p>
                    {c.notes && <p className="mt-2 text-xs text-muted">ملاحظات: {c.notes}</p>}
                    <p className="mt-2 text-xs text-muted">{formatArabicDateTime(c.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge label={c.status} tone={COMPLAINT_STATUS_TONE[c.status]} />
                    <select
                      value={c.status}
                      onChange={(e) => updateComplaintStatus(c.id, e.target.value as ComplaintStatus, currentUser?.id ?? "")}
                      className="rounded-lg border border-line bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="إضافة شكوى">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="اسم العميل">
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </Field>
          <Field label="رقم التواصل">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XXXXXXXX" />
          </Field>
          <Field label="نوع الشكوى">
            <Input value={complaintType} onChange={(e) => setComplaintType(e.target.value)} placeholder="جودة الخدمة، تأخر، فوترة..." />
          </Field>
          <Field label="تفاصيل الشكوى">
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} />
          </Field>
          <Button type="submit" className="w-full">
            إضافة شكوى
          </Button>
        </form>
      </Drawer>
    </AppShell>
  );
}
