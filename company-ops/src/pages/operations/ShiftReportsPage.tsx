import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { useShiftDraftStore } from "@/store/shiftDraftStore";
import { employeesByTeam } from "@/data/roster";
import { PAYMENT_METHOD_LABEL, APPEARANCE_RATING_TONE } from "@/lib/labels";
import { formatSAR } from "@/utils/currency";
import { todayISO } from "@/utils/date";
import type { AppearanceRating, PaymentMethod } from "@/types/domain";

const PAYMENT_OPTIONS: PaymentMethod[] = ["cash", "card", "bank_transfer"];
const APPEARANCE_OPTIONS: AppearanceRating[] = ["ممتاز", "جيد", "ضعيف"];

export default function ShiftReportsPage() {
  const teams = useOpsStore((s) => s.teams);
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const submitShiftReport = useOpsStore((s) => s.submitShiftReport);
  const currentUser = useAuthStore((s) => s.currentUser);

  const employeeIds = useShiftDraftStore((s) => s.employeeIds);
  const attendance = useShiftDraftStore((s) => s.attendance);
  const appearance = useShiftDraftStore((s) => s.appearance);
  const toggleEmployee = useShiftDraftStore((s) => s.toggleEmployee);
  const setAttendance = useShiftDraftStore((s) => s.setAttendance);
  const setAppearanceRating = useShiftDraftStore((s) => s.setAppearanceRating);
  const setAppearanceReason = useShiftDraftStore((s) => s.setAppearanceReason);

  const clientsServed = useShiftDraftStore((s) => s.clientsServed);
  const totalIncome = useShiftDraftStore((s) => s.totalIncome);
  const paymentMethods = useShiftDraftStore((s) => s.paymentMethods);
  const paymentAmounts = useShiftDraftStore((s) => s.paymentAmounts);
  const notes = useShiftDraftStore((s) => s.notes);
  const issues = useShiftDraftStore((s) => s.issues);
  const setClientsServed = useShiftDraftStore((s) => s.setClientsServed);
  const setTotalIncome = useShiftDraftStore((s) => s.setTotalIncome);
  const togglePaymentMethod = useShiftDraftStore((s) => s.togglePaymentMethod);
  const setPaymentAmount = useShiftDraftStore((s) => s.setPaymentAmount);
  const setNotes = useShiftDraftStore((s) => s.setNotes);
  const setIssues = useShiftDraftStore((s) => s.setIssues);
  const resetDraft = useShiftDraftStore((s) => s.reset);

  const today = todayISO();
  const teamId = currentUser?.teamId ?? "";
  const team = teams.find((t) => t.id === teamId);
  const teamRoster = useMemo(() => (teamId ? employeesByTeam(teamId) : []), [teamId]);
  const todaysShiftReport = shiftReports.find((r) => r.teamId === teamId && r.date === today);

  // "جيد" and "ضعيف" appearance ratings require a written reason before the
  // report can be submitted — "ممتاز" doesn't need one.
  const hasMissingAppearanceReason = [...employeeIds].some((id) => {
    const rating = appearance[id]?.rating;
    return (rating === "جيد" || rating === "ضعيف") && !appearance[id]?.reason.trim();
  });

  // Clients served, income, and at least one payment method with its amount
  // are required before the report can be sent.
  const hasMissingClients = clientsServed <= 0;
  const hasMissingIncome = totalIncome <= 0;
  const hasMissingPaymentMethod = paymentMethods.size === 0;
  const hasMissingPaymentAmount = [...paymentMethods].some((m) => !((paymentAmounts[m] ?? 0) > 0));
  const isReportIncomplete =
    hasMissingAppearanceReason || hasMissingClients || hasMissingIncome || hasMissingPaymentMethod || hasMissingPaymentAmount;

  function handleSubmit() {
    if (!currentUser || !teamId || isReportIncomplete) return;
    const employeesPayload = [...employeeIds].map((id) => ({
      employeeId: id,
      attendance: attendance[id] ?? "present",
      appearanceRating: appearance[id]?.rating ?? null,
      appearanceReason: appearance[id]?.reason ?? "",
    }));
    const paymentAmountsPayload: Record<PaymentMethod, number> = {
      cash: paymentMethods.has("cash") ? (paymentAmounts.cash ?? 0) : 0,
      card: paymentMethods.has("card") ? (paymentAmounts.card ?? 0) : 0,
      bank_transfer: paymentMethods.has("bank_transfer") ? (paymentAmounts.bank_transfer ?? 0) : 0,
    };
    submitShiftReport(
      {
        date: today,
        teamId,
        supervisorId: currentUser.id,
        employees: employeesPayload,
        clientsServed,
        totalIncome,
        paymentMethods: [...paymentMethods],
        paymentAmounts: paymentAmountsPayload,
        issues,
        notes,
      },
      currentUser.id
    );
    resetDraft();
  }

  if (!team) {
    return (
      <AppShell title="التقرير اليومي">
        <Card>لا يوجد فريق مرتبط بحسابك حاليًا.</Card>
      </AppShell>
    );
  }

  return (
    <AppShell title={`التقرير اليومي — ${team.name}`}>
      {!todaysShiftReport && (
        <Card title="الموظفين — الشفت، الحضور، والمظهر الخارجي" className="mb-6">
          <p className="mb-4 text-sm text-muted">
            حدد الموظفين المسؤولين عن الشغل معك في هذا الشفت، وسجّل حضورهم وتقييم مظهرهم فور تحديدهم.
          </p>
          <div className="space-y-2">
            {teamRoster.map((e) => {
              const inShift = employeeIds.has(e.id);
              const status = attendance[e.id];
              const current = appearance[e.id];
              return (
                <div key={e.id} className={`rounded-lg border px-4 py-3 transition ${inShift ? "border-accent" : "border-line"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={inShift}
                        onChange={() => toggleEmployee(e.id)}
                        className="h-4 w-4 shrink-0 rounded border-line accent-[var(--color-accent)]"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{e.name}</p>
                        <p className="text-xs text-muted">{e.title}</p>
                      </div>
                    </label>

                    {inShift && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setAttendance(e.id, "present")}
                          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                            status === "present" ? "bg-success text-white" : "bg-bg text-muted hover:text-ink"
                          }`}
                        >
                          حاضر
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttendance(e.id, "absent")}
                          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                            status === "absent" ? "bg-danger text-white" : "bg-bg text-muted hover:text-ink"
                          }`}
                        >
                          غائب
                        </button>
                      </div>
                    )}
                  </div>

                  {inShift && (
                    <div className="mt-3 border-t border-line pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-muted">المظهر الخارجي</span>
                        <div className="flex gap-2">
                          {APPEARANCE_OPTIONS.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setAppearanceRating(e.id, option)}
                              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                                current?.rating === option
                                  ? APPEARANCE_RATING_TONE[option] === "success"
                                    ? "bg-success text-white"
                                    : APPEARANCE_RATING_TONE[option] === "danger"
                                      ? "bg-danger text-white"
                                      : "bg-info text-white"
                                  : "bg-bg text-muted hover:text-ink"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(current?.rating === "ضعيف" || current?.rating === "جيد") && (
                        <div className="mt-3">
                          <label className="mb-1.5 block text-xs font-semibold text-muted">
                            سبب التقييم <span className="text-danger">(إلزامي)</span>
                          </label>
                          <Input
                            value={current.reason}
                            onChange={(ev) => setAppearanceReason(e.id, ev.target.value)}
                            placeholder="اكتب سبب التقييم..."
                            className={!current.reason.trim() ? "border-danger" : ""}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card title="التقرير">
        {todaysShiftReport ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 size={16} /> تم إرسال تقرير هذا الشفت — {todaysShiftReport.clientsServed} عميل، إجمالي دخل{" "}
              {formatSAR(todaysShiftReport.totalIncome)}
            </div>
            {todaysShiftReport.paymentMethods.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
                {todaysShiftReport.paymentMethods.map((m) => (
                  <span key={m} className="rounded-full bg-info-soft px-3 py-1 text-xs font-semibold text-info">
                    {PAYMENT_METHOD_LABEL[m]} — {formatSAR(todaysShiftReport.paymentAmounts[m] ?? 0)}
                  </span>
                ))}
              </div>
            )}
            {todaysShiftReport.employees.length > 0 && (
              <div className="border-t border-line pt-3">
                <p className="mb-2 text-xs font-semibold text-muted">موظفو هذا الشفت</p>
                <ul className="space-y-1.5">
                  {todaysShiftReport.employees.map((emp) => {
                    const name = teamRoster.find((r) => r.id === emp.employeeId)?.name ?? emp.employeeId;
                    return (
                      <li key={emp.employeeId} className="flex flex-wrap items-center gap-2 text-sm text-ink/80">
                        <span className="font-semibold text-ink">{name}</span>
                        <span>— {emp.attendance === "present" ? "حاضر" : "غائب"}</span>
                        {emp.appearanceRating && <span>— المظهر: {emp.appearanceRating}</span>}
                        {emp.appearanceReason && <span className="text-xs text-muted">({emp.appearanceReason})</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {todaysShiftReport.issues && (
              <p className="border-t border-line pt-3 text-sm text-ink/80">مشاكل وأعطال: {todaysShiftReport.issues}</p>
            )}
            {todaysShiftReport.notes && <p className="text-sm text-ink/80">ملاحظات: {todaysShiftReport.notes}</p>}
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted">
                عدد العملاء الذين تم خدمتهم <span className="text-danger">(إلزامي)</span>
              </label>
              <Input
                type="number"
                min={0}
                value={clientsServed}
                onChange={(e) => setClientsServed(Number(e.target.value))}
                className={`max-w-xs ${hasMissingClients ? "border-danger" : ""}`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted">
                إجمالي الدخل (ر.س) <span className="text-danger">(إلزامي)</span>
              </label>
              <Input
                type="number"
                min={0}
                value={totalIncome}
                onChange={(e) => setTotalIncome(Number(e.target.value))}
                className={`max-w-xs ${hasMissingIncome ? "border-danger" : ""}`}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-muted">
                طريقة الدفع (يمكن اختيار أكثر من طريقة) <span className="text-danger">(إلزامي)</span>
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {PAYMENT_OPTIONS.map((method) => {
                  const checked = paymentMethods.has(method);
                  return (
                    <div key={method} className={`rounded-lg border px-3 py-2.5 ${checked ? "border-accent" : "border-line"}`}>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePaymentMethod(method)}
                          className="h-4 w-4 rounded border-line accent-[var(--color-accent)]"
                        />
                        <span className="text-sm text-ink">{PAYMENT_METHOD_LABEL[method]}</span>
                      </label>
                      {checked && (
                        <Input
                          type="number"
                          min={0}
                          value={paymentAmounts[method] ?? 0}
                          onChange={(e) => setPaymentAmount(method, Number(e.target.value))}
                          placeholder="المبلغ (ر.س)"
                          className={`mt-2 ${!((paymentAmounts[method] ?? 0) > 0) ? "border-danger" : ""}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted">المشاكل والأعطال</label>
              <Textarea
                value={issues}
                onChange={(e) => setIssues(e.target.value)}
                rows={4}
                placeholder="اكتب هنا أي مشاكل أو أعطال حدثت أثناء العمل..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted">ملاحظات</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="أضف أي ملاحظات إضافية..." />
            </div>

            <div className="border-t border-line pt-4">
              <p className="mb-3 text-xs text-muted">هذا الزر يرسل التقرير كامل دفعة وحدة للمدير.</p>
              <Button onClick={handleSubmit} disabled={isReportIncomplete} className="w-full">
                إرسال التقرير للمدير
              </Button>
            </div>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
