import type { PayrollAdjustment } from "@/types/domain";
import { employees } from "@/data/roster";

// Deterministic mock deductions/advances per employee — varies by index so the
// payroll table looks realistic (not every row identical) without randomness.
function buildPayroll(): PayrollAdjustment[] {
  return employees.map((emp, i) => {
    const hasAdvance = i % 4 === 0;
    const hasViolation = i % 7 === 0;
    const hasAbsence = i % 5 === 0;

    return {
      employeeId: emp.id,
      advances: hasAdvance ? 300 + (i % 3) * 100 : 0,
      deductions: i % 6 === 0 ? 100 : 0,
      mudadFee: emp.salaryPlatform === "mudad" ? 30 : 0,
      absenceDeduction: hasAbsence ? Math.round(emp.salary / 30) : 0,
      violations: hasViolation ? 150 : 0,
      notes: hasViolation ? "مخالفة تأخر متكرر" : hasAbsence ? "خصم يوم غياب" : "",
    };
  });
}

export const payrollAdjustments: PayrollAdjustment[] = buildPayroll();

export function computePayrollTotal(salary: number, adj: PayrollAdjustment): number {
  return salary - adj.advances - adj.deductions - adj.mudadFee - adj.absenceDeduction - adj.violations;
}
