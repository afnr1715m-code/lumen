import { useMemo, useState } from "react";
import { FileBarChart, Users, Wallet } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import KPICard from "@/components/ui/KPICard";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { users } from "@/data/roster";
import { PAYMENT_METHOD_LABEL, COMPLAINT_STATUS_TONE } from "@/lib/labels";
import { formatArabicDate, formatArabicDateTime, todayISO } from "@/utils/date";
import { formatSAR } from "@/utils/currency";
import type { ComplaintStatus } from "@/types/domain";

const STATUS_OPTIONS: ComplaintStatus[] = ["جديدة", "قيد المعالجة", "تم الحل"];
const COORDINATORS = users.filter((u) => u.role === "coordinator");

const TABS = [
  { key: "field", label: "تقارير ميدانية" },
  { key: "cs", label: "تقارير خدمة العملاء" },
  { key: "coordinator", label: "تقارير للمسؤول المباشر" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function ReportsPage() {
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const teams = useOpsStore((s) => s.teams);
  const employees = useOpsStore((s) => s.employees);
  const customerServiceReports = useOpsStore((s) => s.customerServiceReports);
  const complaints = useOpsStore((s) => s.complaints);
  const suggestions = useOpsStore((s) => s.suggestions);
  const updateComplaintStatus = useOpsStore((s) => s.updateComplaintStatus);
  const managerReports = useOpsStore((s) => s.managerReports);
  const addManagerReport = useOpsStore((s) => s.addManagerReport);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [activeTab, setActiveTab] = useState<TabKey>("field");
  const [shiftTeamFilter, setShiftTeamFilter] = useState("all");
  const [shiftFromDate, setShiftFromDate] = useState("");
  const [shiftToDate, setShiftToDate] = useState("");

  const [coordRecipientId, setCoordRecipientId] = useState(COORDINATORS[0]?.id ?? "");
  const [coordDevelopment, setCoordDevelopment] = useState("");
  const [coordRatios, setCoordRatios] = useState("");
  const [coordNotes, setCoordNotes] = useState("");

  function handleSendCoordinatorReport() {
    if (!currentUser || !coordRecipientId || !coordDevelopment.trim()) return;
    addManagerReport(
      { recipientId: coordRecipientId, date: todayISO(), development: coordDevelopment, ratios: coordRatios, notes: coordNotes },
      currentUser.id
    );
    setCoordDevelopment("");
    setCoordRatios("");
    setCoordNotes("");
  }

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
  function employeeName(id: string) {
    return employees.find((e) => e.id === id)?.name ?? "—";
  }
  function recipientName(id: string) {
    return users.find((u) => u.id === id)?.name ?? "—";
  }

  const sortedCsReports = useMemo(
    () => [...customerServiceReports].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [customerServiceReports]
  );
  const sortedComplaints = useMemo(() => [...complaints].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [complaints]);
  const sortedSuggestions = useMemo(() => [...suggestions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [suggestions]);
  const sortedManagerReports = useMemo(
    () => [...managerReports].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [managerReports]
  );

  return (
    <AppShell title="التقارير">
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === tab.key ? "bg-accent text-white" : "bg-bg text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "field" && (
        <>
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
                          <StatusBadge
                            key={m}
                            label={`${PAYMENT_METHOD_LABEL[m]} — ${formatSAR(r.paymentAmounts[m] ?? 0)}`}
                            tone="info"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <MiniStat label="العملاء" value={String(r.clientsServed)} />
                      <MiniStat label="إجمالي الدخل" value={formatSAR(r.totalIncome)} />
                    </div>
                    {r.employees.length > 0 && (
                      <div className="mt-3 border-t border-line pt-3">
                        <p className="mb-1.5 text-xs font-semibold text-muted">موظفو هذا الشفت</p>
                        <ul className="space-y-1">
                          {r.employees.map((emp) => (
                            <li key={emp.employeeId} className="flex flex-wrap items-center gap-2 text-xs text-ink/80">
                              <span className="font-semibold text-ink">{employeeName(emp.employeeId)}</span>
                              <span>— {emp.attendance === "present" ? "حاضر" : "غائب"}</span>
                              {emp.appearanceRating && <span>— المظهر: {emp.appearanceRating}</span>}
                              {emp.appearanceReason && <span className="text-muted">({emp.appearanceReason})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {r.issues && <p className="mt-3 text-sm text-ink/80">مشاكل وأعطال: {r.issues}</p>}
                    {r.notes && <p className="mt-2 text-xs text-muted">ملاحظات: {r.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {activeTab === "cs" && (
        <div className="space-y-6">
          <Card title="تقارير الشفت">
            {sortedCsReports.length === 0 ? (
              <EmptyState label="لا توجد تقارير خدمة عملاء مرسلة بعد" hint="تظهر هنا فور ما يرسل أي موظف خدمة عملاء تقريره" />
            ) : (
              <div className="space-y-3">
                {sortedCsReports.map((r) => (
                  <div key={r.id} className="rounded-xl border border-line p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink">
                          {employeeName(r.employeeId)} <span className="text-xs font-normal text-muted">· شفت {r.shift}</span>
                        </p>
                        <p className="mt-1 text-xs text-muted">{formatArabicDate(r.date)}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-4">
                      <MiniStat label="تم التواصل" value={String(r.contactedCount)} />
                      <MiniStat label="تم الحجز" value={String(r.bookedCount)} />
                      <MiniStat label="عملاء محتملون" value={String(r.potentialCount)} />
                    </div>
                    {r.notes && <p className="mt-3 text-sm text-ink/80">ملاحظات (تسليم الشفت): {r.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="الشكاوى">
            {sortedComplaints.length === 0 ? (
              <EmptyState label="لا توجد شكاوى مسجلة بعد" />
            ) : (
              <div className="space-y-3">
                {sortedComplaints.map((c) => (
                  <div key={c.id} className="rounded-xl border border-line p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink">
                          {c.clientName} <span className="text-xs font-normal text-muted">· {c.phone}</span>
                        </p>
                        <p className="mt-1 text-xs font-semibold text-accent">{c.complaintType}</p>
                        <p className="mt-2 text-sm text-ink/80">{c.details}</p>
                        {c.notes && <p className="mt-2 text-xs text-muted">ملاحظات: {c.notes}</p>}
                        <p className="mt-2 text-xs text-muted">
                          {employeeName(c.createdBy)} · {formatArabicDateTime(c.createdAt)}
                        </p>
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

          <Card title="الاقتراحات">
            {sortedSuggestions.length === 0 ? (
              <EmptyState label="لا توجد اقتراحات بعد" />
            ) : (
              <div className="space-y-3">
                {sortedSuggestions.map((s) => (
                  <div key={s.id} className="rounded-xl border border-line p-4">
                    <p className="font-semibold text-ink">{s.title}</p>
                    <p className="mt-1 text-sm text-ink/80">{s.details}</p>
                    {s.notes && <p className="mt-2 text-xs text-muted">ملاحظات: {s.notes}</p>}
                    <p className="mt-2 text-xs text-muted">
                      {employeeName(s.createdBy)} · {formatArabicDateTime(s.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "coordinator" && (
        <div className="space-y-6">
          <Card title="إرسال تقرير جديد">
            {COORDINATORS.length === 0 ? (
              <EmptyState label="لا يوجد مسؤول مباشر مسجّل حاليًا" />
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted">المستلم</label>
                  <Select
                    value={coordRecipientId}
                    onChange={setCoordRecipientId}
                    options={COORDINATORS.map((c) => ({ value: c.id, label: c.name }))}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted">التطوير</label>
                  <Textarea value={coordDevelopment} onChange={(e) => setCoordDevelopment(e.target.value)} rows={3} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted">النسب</label>
                  <Textarea value={coordRatios} onChange={(e) => setCoordRatios(e.target.value)} rows={3} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted">الملاحظات</label>
                  <Textarea value={coordNotes} onChange={(e) => setCoordNotes(e.target.value)} rows={3} />
                </div>
                <Button onClick={handleSendCoordinatorReport} disabled={!coordDevelopment.trim()} className="w-full">
                  إرسال التقرير
                </Button>
              </div>
            )}
          </Card>

          <Card title="التقارير المرسلة">
            {sortedManagerReports.length === 0 ? (
              <EmptyState label="ما أرسلت أي تقرير بعد" />
            ) : (
              <div className="space-y-3">
                {sortedManagerReports.map((r) => (
                  <div key={r.id} className="rounded-xl border border-line p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="font-semibold text-ink">إلى: {recipientName(r.recipientId)}</p>
                      <p className="text-xs text-muted">{formatArabicDate(r.date)}</p>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-ink/80">
                        <span className="font-semibold text-ink">التطوير:</span> {r.development}
                      </p>
                      <p className="text-sm text-ink/80">
                        <span className="font-semibold text-ink">النسب:</span> {r.ratios}
                      </p>
                      {r.notes && (
                        <p className="text-sm text-ink/80">
                          <span className="font-semibold text-ink">الملاحظات:</span> {r.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
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
