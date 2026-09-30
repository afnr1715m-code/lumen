import { useMemo, useState } from "react";
import { Wallet, Pencil } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import KPICard from "@/components/ui/KPICard";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import PayrollFormDrawer from "@/components/forms/PayrollFormDrawer";
import { useOpsStore } from "@/store/opsStore";
import { formatSAR } from "@/utils/currency";
import { computePayrollTotal } from "@/data/payroll";
import type { Employee, PayrollAdjustment } from "@/types/domain";

export default function PayrollPage() {
  const employees = useOpsStore((s) => s.employees);
  const teams = useOpsStore((s) => s.teams);
  const payrollAdjustments = useOpsStore((s) => s.payrollAdjustments);

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const rows = useMemo(
    () =>
      employees
        .filter((e) => (search ? e.name.includes(search) : true))
        .filter((e) => (teamFilter === "all" ? true : e.teamId === teamFilter))
        .map((e) => {
          const adj = payrollAdjustments.find((p) => p.employeeId === e.id);
          const advances = adj?.advances ?? 0;
          const deductions = adj?.deductions ?? 0;
          const mudadFee = adj?.mudadFee ?? 0;
          const absenceDeduction = adj?.absenceDeduction ?? 0;
          const violations = adj?.violations ?? 0;
          const total = adj ? computePayrollTotal(e.salary, adj) : e.salary;
          return { employee: e, adjustment: adj ?? null, advances, deductions, mudadFee, absenceDeduction, violations, total, notes: adj?.notes ?? "" };
        }),
    [employees, payrollAdjustments, search, teamFilter]
  );

  const totalPayroll = rows.reduce((sum, r) => sum + r.total, 0);
  const totalBase = rows.reduce((sum, r) => sum + r.employee.salary, 0);
  const totalDeductions = totalBase - totalPayroll;

  const editingAdjustment: PayrollAdjustment | null = editingEmployee
    ? (payrollAdjustments.find((p) => p.employeeId === editingEmployee.id) ?? null)
    : null;

  return (
    <AppShell title="الرواتب">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="إجمالي الرواتب الأساسية" value={formatSAR(totalBase)} icon={Wallet} tone="neutral" />
        <KPICard label="إجمالي الخصومات" value={formatSAR(totalDeductions)} icon={Wallet} tone="danger" />
        <KPICard label="إجمالي صافي الرواتب" value={formatSAR(totalPayroll)} icon={Wallet} tone="accent" />
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="ابحث عن موظف..." className="w-64" />
          <Select
            value={teamFilter}
            onChange={setTeamFilter}
            options={[{ value: "all", label: "كل الفرق" }, ...teams.map((t) => ({ value: t.id, label: t.name }))]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">اسم الموظف</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">المسمى الوظيفي</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">الراتب الأساسي</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">السلف</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">الخصم</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">مدد</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">الغياب</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">المخالفات</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">إجمالي الراتب</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">ملاحظات</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.employee.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-3 font-semibold text-ink">{r.employee.name}</td>
                  <td className="px-3 py-3 text-muted">{r.employee.title}</td>
                  <td className="px-3 py-3 text-muted">{formatSAR(r.employee.salary)}</td>
                  <td className="px-3 py-3 text-muted">{r.advances ? formatSAR(r.advances) : "—"}</td>
                  <td className="px-3 py-3 text-muted">{r.deductions ? formatSAR(r.deductions) : "—"}</td>
                  <td className="px-3 py-3 text-muted">{r.mudadFee ? formatSAR(r.mudadFee) : "—"}</td>
                  <td className="px-3 py-3 text-muted">{r.absenceDeduction ? formatSAR(r.absenceDeduction) : "—"}</td>
                  <td className="px-3 py-3 text-muted">{r.violations ? formatSAR(r.violations) : "—"}</td>
                  <td className="px-3 py-3 font-bold text-ink">{formatSAR(r.total)}</td>
                  <td className="px-3 py-3 text-xs text-muted">{r.notes || "—"}</td>
                  <td className="px-3 py-3 text-end">
                    <button
                      type="button"
                      onClick={() => setEditingEmployee(r.employee)}
                      aria-label="تعديل"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-bg hover:text-accent"
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-line">
                <td colSpan={8} className="px-3 py-3 text-start text-sm font-bold text-ink">
                  إجمالي رواتب الموظفين
                </td>
                <td className="px-3 py-3 text-sm font-extrabold text-accent">{formatSAR(totalPayroll)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <PayrollFormDrawer
        open={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
        adjustment={editingAdjustment}
      />
    </AppShell>
  );
}
