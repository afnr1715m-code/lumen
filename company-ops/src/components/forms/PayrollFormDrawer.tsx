import { useEffect, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Field, { Input, Textarea } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import type { Employee, PayrollAdjustment } from "@/types/domain";

const EMPTY_ADJUSTMENT = { advances: 0, deductions: 0, mudadFee: 0, absenceDeduction: 0, violations: 0, notes: "" };

export default function PayrollFormDrawer({
  open,
  onClose,
  employee,
  adjustment,
}: {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  adjustment: PayrollAdjustment | null;
}) {
  const updateEmployee = useOpsStore((s) => s.updateEmployee);
  const updatePayrollAdjustment = useOpsStore((s) => s.updatePayrollAdjustment);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [salary, setSalary] = useState(0);
  const [form, setForm] = useState(EMPTY_ADJUSTMENT);

  useEffect(() => {
    if (!open || !employee) return;
    setSalary(employee.salary);
    setForm(adjustment ? { ...adjustment } : EMPTY_ADJUSTMENT);
  }, [open, employee, adjustment]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!employee || !currentUser) return;
    if (salary !== employee.salary) {
      updateEmployee(employee.id, { ...employee, salary }, currentUser.id);
    }
    updatePayrollAdjustment(employee.id, form, currentUser.id);
    onClose();
  }

  if (!employee) return null;

  return (
    <Drawer open={open} onClose={onClose} title={`تعديل راتب — ${employee.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="الراتب الأساسي (ر.س)">
          <Input type="number" min={0} value={salary} onChange={(e) => setSalary(Number(e.target.value))} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="السلف (ر.س)">
            <Input type="number" min={0} value={form.advances} onChange={(e) => set("advances", Number(e.target.value))} />
          </Field>
          <Field label="الخصم (ر.س)">
            <Input type="number" min={0} value={form.deductions} onChange={(e) => set("deductions", Number(e.target.value))} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="مدد (ر.س)">
            <Input type="number" min={0} value={form.mudadFee} onChange={(e) => set("mudadFee", Number(e.target.value))} />
          </Field>
          <Field label="خصم الغياب (ر.س)">
            <Input type="number" min={0} value={form.absenceDeduction} onChange={(e) => set("absenceDeduction", Number(e.target.value))} />
          </Field>
        </div>
        <Field label="المخالفات (ر.س)">
          <Input type="number" min={0} value={form.violations} onChange={(e) => set("violations", Number(e.target.value))} />
        </Field>
        <Field label="ملاحظات">
          <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
        <div className="rounded-lg bg-bg px-3 py-2 text-sm text-muted">
          إجمالي الراتب:{" "}
          <span className="font-bold text-ink">
            {(salary - form.advances - form.deductions - form.mudadFee - form.absenceDeduction - form.violations).toLocaleString(
              "ar-SA-u-nu-latn"
            )}{" "}
            ر.س
          </span>
        </div>
        <Button type="submit" className="w-full">
          حفظ التعديلات
        </Button>
      </form>
    </Drawer>
  );
}
