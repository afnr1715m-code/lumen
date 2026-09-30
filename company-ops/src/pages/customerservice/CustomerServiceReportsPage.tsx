import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Field, { Input, Textarea } from "@/components/ui/Field";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { todayISO } from "@/utils/date";
import type { ShiftName } from "@/types/domain";

export default function CustomerServiceReportsPage() {
  const submitCustomerServiceReport = useOpsStore((s) => s.submitCustomerServiceReport);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [contactedCount, setContactedCount] = useState(0);
  const [bookedCount, setBookedCount] = useState(0);
  const [potentialCount, setPotentialCount] = useState(0);
  const [notes, setNotes] = useState("");
  const [shift, setShift] = useState<ShiftName>("مساء");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    submitCustomerServiceReport(
      { employeeId: currentUser.id, shift, date: todayISO(), contactedCount, bookedCount, potentialCount, notes },
      currentUser.id
    );
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AppShell title="التقارير">
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
              <CheckCircle2 size={24} />
            </span>
            <p className="text-base font-bold text-ink">تم إرسال التقرير بنجاح إلى المدير.</p>
            <Button variant="secondary" onClick={() => setSubmitted(false)}>
              إرسال تقرير آخر
            </Button>
          </div>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title="التقارير">
      <Card title="تقرير الشفت">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="الشفت">
            <div className="flex gap-2">
              {(["مساء", "ليل"] as ShiftName[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShift(s)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    shift === s ? "bg-accent text-white" : "bg-bg text-muted hover:text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
          <Field label="عدد العملاء الذين تم التواصل معهم">
            <Input type="number" min={0} value={contactedCount} onChange={(e) => setContactedCount(Number(e.target.value))} className="max-w-xs" />
          </Field>
          <Field label="عدد العملاء الذين تم الحجز لهم">
            <Input type="number" min={0} value={bookedCount} onChange={(e) => setBookedCount(Number(e.target.value))} className="max-w-xs" />
          </Field>
          <Field label="عدد العملاء المحتملين">
            <Input type="number" min={0} value={potentialCount} onChange={(e) => setPotentialCount(Number(e.target.value))} className="max-w-xs" />
          </Field>
          <Field label="ملاحظات">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="أي شي يحتاج متابعة من الشفت القادم..."
            />
          </Field>
          <Button type="submit" className="w-full">
            إرسال التقرير للمدير
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}
