import { useMemo, useState } from "react";
import { FileBarChart, Users, Wallet } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import KPICard from "@/components/ui/KPICard";
import Select from "@/components/ui/Select";
import { Input } from "@/components/ui/Field";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { PAYMENT_METHOD_LABEL } from "@/lib/labels";
import { formatArabicDate } from "@/utils/date";
import { formatSAR } from "@/utils/currency";

export default function ReportsPage() {
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const teams = useOpsStore((s) => s.teams);
  const employees = useOpsStore((s) => s.employees);

  const [shiftTeamFilter, setShiftTeamFilter] = useState("all");
  const [shiftFromDate, setShiftFromDate] = useState("");
  const [shiftToDate, setShiftToDate] = useState("");

  const filteredShiftReports = useMemo(
    () =>
      shiftReports.filter((r) => {
        if (shiftTeamFilter !== "all" && r.teamId !== shiftTeamFilter) return false;
        if (shiftFromDate && r.date < shiftFromDate) return false;
        if (shiftToDate && r.date > shiftToDate) return false;
        return true;
      }),
    [shiftReports, shiftTeamFilter, shiftFromDate, shiftToDate]
  );

  const totalShiftClients = filteredShiftReports.reduce((sum, r) => sum + r.clientsServed, 0);
  const totalShiftIncome = filteredShiftReports.reduce((sum, r) => sum + r.totalIncome, 0);

  function teamName(id: string) {
    return teams.find((t) => t.id === id)?.name ?? "—";
  }
  function supervisorName(id: string) {
    return employees.find((e) => e.id === id)?.name ?? "—";
  }

  return (
    <AppShell title="التقارير">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="عدد التقارير" value={filteredShiftReports.length} icon={FileBarChart} tone="neutral" />
        <KPICard label="إجمالي العملاء" value={totalShiftClients} icon={Users} tone="accent" />
        <KPICard label="إجمالي الدخل" value={formatSAR(totalShiftIncome)} icon={Wallet} tone="accent" />
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Select
            value={shiftTeamFilter}
            onChange={setShiftTeamFilter}
            options={[{ value: "all", label: "كل الفرق" }, ...teams.map((t) => ({ value: t.id, label: t.name }))]}
          />
          <Input type="date" value={shiftFromDate} onChange={(e) => setShiftFromDate(e.target.value)} className="w-40" />
          <span className="text-xs text-muted">إلى</span>
          <Input type="date" value={shiftToDate} onChange={(e) => setShiftToDate(e.target.value)} className="w-40" />
        </div>

        {filteredShiftReports.length === 0 ? (
          <EmptyState label="لا توجد تقارير ميدانية مرسلة بعد" hint="تظهر هنا فور ما يرسل أي مشرف تقريره من صفحته" />
        ) : (
          <div className="space-y-3">
            {filteredShiftReports.map((r) => (
              <div key={r.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">
                      {teamName(r.teamId)} · {supervisorName(r.supervisorId)}
                    </p>
                    <p className="mt-1 text-xs text-muted">{formatArabicDate(r.date)}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    {r.paymentMethods.map((m) => (
                      <StatusBadge key={m} label={PAYMENT_METHOD_LABEL[m]} tone="info" />
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <MiniStat label="العملاء" value={String(r.clientsServed)} />
                  <MiniStat label="إجمالي الدخل" value={formatSAR(r.totalIncome)} />
                </div>
                {r.issues && <p className="mt-3 text-sm text-ink/80">مشاكل وأعطال: {r.issues}</p>}
                {r.notes && <p className="mt-2 text-xs text-muted">ملاحظات: {r.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
