import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { EMPLOYEE_STATUS_LABEL, EMPLOYEE_STATUS_TONE, CONTRACT_TYPE_LABEL, TASK_STATUS_LABEL, TASK_STATUS_TONE } from "@/lib/labels";
import { daysUntil, formatArabicDate } from "@/utils/date";
import { formatSAR } from "@/utils/currency";

const TABS = [
  { key: "personal", label: "البيانات الشخصية" },
  { key: "job", label: "بيانات الوظيفة" },
  { key: "contract", label: "العقد والإقامة" },
  { key: "documents", label: "المستندات" },
  { key: "tasks", label: "المهام" },
  { key: "notes", label: "الملاحظات" },
];

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const employees = useOpsStore((s) => s.employees);
  const teams = useOpsStore((s) => s.teams);
  const tasks = useOpsStore((s) => s.tasks);
  const [tab, setTab] = useState("personal");

  const employee = employees.find((e) => e.id === id);
  if (!employee) return <Navigate to="/employees" replace />;

  const team = teams.find((t) => t.id === employee.teamId);
  const supervisor = employees.find((e) => e.id === employee.supervisorId);
  const contractDays = daysUntil(employee.contractEndDate);
  const iqamaDays = daysUntil(employee.iqamaEndDate);
  const employeeTasks = tasks.filter((t) => t.assigneeId === employee.id);

  return (
    <AppShell title={employee.name}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-lg font-bold text-accent">
            {employee.name.slice(0, 2)}
          </span>
          <div>
            <p className="text-lg font-extrabold text-ink">{employee.name}</p>
            <p className="text-sm text-muted">
              {employee.title} · {team?.name ?? "بدون فريق"}
            </p>
          </div>
        </div>
        <StatusBadge label={EMPLOYEE_STATUS_LABEL[employee.status]} tone={EMPLOYEE_STATUS_TONE[employee.status]} />
      </div>

      {(contractDays <= 30 || iqamaDays <= 30) && (
        <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger sm:flex-row sm:items-center sm:gap-6">
          {contractDays <= 30 && (
            <span className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle size={15} /> العقد {contractDays < 0 ? "منتهٍ" : `ينتهي خلال ${contractDays} يوم`}
            </span>
          )}
          {iqamaDays <= 30 && (
            <span className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle size={15} /> الإقامة {iqamaDays < 0 ? "منتهية" : `تنتهي خلال ${iqamaDays} يوم`}
            </span>
          )}
        </div>
      )}

      <div className="mb-4 flex gap-2 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
              tab === t.key ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {tab === "personal" && (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="الاسم الكامل" value={employee.name} />
            <InfoRow label="رقم الجوال" value={employee.phone} />
            <InfoRow label="البريد الإلكتروني" value={employee.email || "—"} />
            <InfoRow label="رقم الإقامة / الهوية" value={employee.nationalId || "—"} />
            <InfoRow label="الجنسية" value={employee.nationality || "—"} />
            <InfoRow label="تاريخ الميلاد" value={formatArabicDate(employee.birthDate)} />
          </dl>
        )}

        {tab === "job" && (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="المسمى الوظيفي" value={employee.title} />
            <InfoRow label="الفريق" value={team?.name ?? "بدون فريق"} />
            <InfoRow label="المشرف المباشر" value={supervisor?.name ?? "—"} />
            <InfoRow label="تاريخ المباشرة" value={formatArabicDate(employee.hireDate)} />
            <InfoRow label="الراتب" value={formatSAR(employee.salary)} />
            <InfoRow label="منصة الراتب" value={employee.salaryPlatform === "mudad" ? "منصة مدد" : "عقد مباشر"} />
          </dl>
        )}

        {tab === "contract" && (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="نوع العقد" value={CONTRACT_TYPE_LABEL[employee.contractType]} />
            <InfoRow label="تاريخ انتهاء العقد" value={formatArabicDate(employee.contractEndDate)} danger={contractDays <= 30} />
            <InfoRow label="تاريخ انتهاء الإقامة" value={formatArabicDate(employee.iqamaEndDate)} danger={iqamaDays <= 30} />
          </dl>
        )}

        {tab === "documents" && <EmptyState label="لا توجد مستندات مرفوعة" hint="يمكن ربط رفع المستندات لاحقًا بربط النظام بتخزين ملفات حقيقي" />}

        {tab === "tasks" && (
          <div className="space-y-2">
            {employeeTasks.length === 0 ? (
              <EmptyState label="لا توجد مهام مسندة لهذا الموظف" />
            ) : (
              employeeTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-line px-4 py-2.5">
                  <span className="text-sm font-medium text-ink">{t.title}</span>
                  <StatusBadge label={TASK_STATUS_LABEL[t.status]} tone={TASK_STATUS_TONE[t.status]} />
                </div>
              ))
            )}
          </div>
        )}

        {tab === "notes" && (
          <p className="text-sm leading-relaxed text-muted">{employee.notes || "لا توجد ملاحظات مسجلة على هذا الموظف."}</p>
        )}
      </Card>
    </AppShell>
  );
}

function InfoRow({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className={`mt-1 text-sm font-medium ${danger ? "text-danger" : "text-ink"}`}>{value}</dd>
    </div>
  );
}
