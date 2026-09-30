import { CheckCircle2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { useShiftDraftStore } from "@/store/shiftDraftStore";
import { PAYMENT_METHOD_LABEL } from "@/lib/labels";
import { formatSAR } from "@/utils/currency";
import { todayISO } from "@/utils/date";
import type { PaymentMethod } from "@/types/domain";

const PAYMENT_OPTIONS: PaymentMethod[] = ["cash", "card", "bank_transfer"];

export default function ShiftReportsPage() {
  const teams = useOpsStore((s) => s.teams);
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const currentUser = useAuthStore((s) => s.currentUser);

  const clientsServed = useShiftDraftStore((s) => s.clientsServed);
  const totalIncome = useShiftDraftStore((s) => s.totalIncome);
  const paymentMethods = useShiftDraftStore((s) => s.paymentMethods);
  const setClientsServed = useShiftDraftStore((s) => s.setClientsServed);
  const setTotalIncome = useShiftDraftStore((s) => s.setTotalIncome);
  const togglePaymentMethod = useShiftDraftStore((s) => s.togglePaymentMethod);

  const today = todayISO();
  const teamId = currentUser?.teamId ?? "";
  const team = teams.find((t) => t.id === teamId);
  const todaysShiftReport = shiftReports.find((r) => r.teamId === teamId && r.date === today);

  if (!team) {
    return (
      <AppShell title="التقارير">
        <Card>لا يوجد فريق مرتبط بحسابك حاليًا.</Card>
      </AppShell>
    );
  }

  return (
    <AppShell title={`التقارير — ${team.name}`}>
      <Card title="التقارير">
        {todaysShiftReport ? (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 size={16} /> تم إرسال تقرير هذا الشفت — {todaysShiftReport.clientsServed} عميل، إجمالي دخل{" "}
            {formatSAR(todaysShiftReport.totalIncome)}
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted">عدد العملاء الذين تم خدمتهم</label>
              <Input
                type="number"
                min={0}
                value={clientsServed}
                onChange={(e) => setClientsServed(Number(e.target.value))}
                className="max-w-xs"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted">إجمالي الدخل (ر.س)</label>
              <Input
                type="number"
                min={0}
                value={totalIncome}
                onChange={(e) => setTotalIncome(Number(e.target.value))}
                className="max-w-xs"
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-muted">طريقة الدفع (يمكن اختيار أكثر من طريقة)</p>
              <div className="flex flex-wrap gap-4">
                {PAYMENT_OPTIONS.map((method) => (
                  <label key={method} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={paymentMethods.has(method)}
                      onChange={() => togglePaymentMethod(method)}
                      className="h-4 w-4 rounded border-line accent-[var(--color-accent)]"
                    />
                    <span className="text-sm text-ink">{PAYMENT_METHOD_LABEL[method]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
