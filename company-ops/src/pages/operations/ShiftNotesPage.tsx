import { CheckCircle2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { useShiftDraftStore } from "@/store/shiftDraftStore";
import { todayISO } from "@/utils/date";

export default function ShiftNotesPage() {
  const teams = useOpsStore((s) => s.teams);
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const submitShiftReport = useOpsStore((s) => s.submitShiftReport);
  const currentUser = useAuthStore((s) => s.currentUser);

  const notes = useShiftDraftStore((s) => s.notes);
  const setNotes = useShiftDraftStore((s) => s.setNotes);
  const clientsServed = useShiftDraftStore((s) => s.clientsServed);
  const totalIncome = useShiftDraftStore((s) => s.totalIncome);
  const paymentMethods = useShiftDraftStore((s) => s.paymentMethods);
  const issues = useShiftDraftStore((s) => s.issues);
  const resetDraft = useShiftDraftStore((s) => s.reset);

  const today = todayISO();
  const teamId = currentUser?.teamId ?? "";
  const team = teams.find((t) => t.id === teamId);
  const todaysShiftReport = shiftReports.find((r) => r.teamId === teamId && r.date === today);

  function handleSubmit() {
    if (!currentUser || !teamId) return;
    submitShiftReport(
      { date: today, teamId, supervisorId: currentUser.id, clientsServed, totalIncome, paymentMethods: [...paymentMethods], issues, notes },
      currentUser.id
    );
    resetDraft();
  }

  return (
    <AppShell title={team ? `الملاحظات — ${team.name}` : "الملاحظات"}>
      <Card title="ملاحظات">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="أضف أي ملاحظات إضافية..."
          disabled={Boolean(todaysShiftReport)}
        />
        {!todaysShiftReport && (
          <div className="mt-5 border-t border-line pt-4">
            <p className="mb-3 text-xs text-muted">
              هذا الزر يرسل بيانات «التقارير» و«المشاكل والأعطال» و«الملاحظات» معًا كتقرير واحد للشفت.
            </p>
            <Button onClick={handleSubmit} className="w-full">
              إرسال تقرير الشفت
            </Button>
          </div>
        )}
        {todaysShiftReport && (
          <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-sm text-success">
            <CheckCircle2 size={16} /> تم إرسال تقرير هذا الشفت بالكامل
          </div>
        )}
      </Card>
    </AppShell>
  );
}
