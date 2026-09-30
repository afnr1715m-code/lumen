import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { TEAM_STATUS_LABEL, TEAM_STATUS_TONE, SUPERVISOR_REPORT_TYPE_TONE, SUPERVISOR_REPORT_STATUS_TONE, PAYMENT_METHOD_LABEL } from "@/lib/labels";
import { formatSAR } from "@/utils/currency";
import { formatArabicDate } from "@/utils/date";

const TABS = [
  { key: "members", label: "الموظفون" },
  { key: "revenue", label: "الدخل" },
  { key: "reports", label: "التقارير" },
];

export default function TeamDetailPage() {
  const { id } = useParams();
  const teams = useOpsStore((s) => s.teams);
  const employees = useOpsStore((s) => s.employees);
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const supervisorReports = useOpsStore((s) => s.supervisorReports);
  const [tab, setTab] = useState("members");

  const team = teams.find((t) => t.id === id);
  if (!team) return <Navigate to="/teams" replace />;

  const members = employees.filter((e) => e.teamId === team.id);
  const teamShiftReports = shiftReports.filter((r) => r.teamId === team.id);
  const totalRevenue = teamShiftReports.reduce((sum, r) => sum + r.totalIncome, 0);
  const teamReports = supervisorReports.filter((r) => r.teamId === team.id);

  return (
    <AppShell title={team.name}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
        <div>
          <p className="text-lg font-extrabold text-ink">{team.name}</p>
          <p className="text-sm text-muted">المشرف: {employees.find((e) => e.id === team.supervisorId)?.name}</p>
        </div>
        <StatusBadge label={TEAM_STATUS_LABEL[team.status]} tone={TEAM_STATUS_TONE[team.status]} />
      </div>

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
        {tab === "members" && (
          <div className="space-y-2">
            {members.map((m) => (
              <Link key={m.id} to={`/employees/${m.id}`} className="flex items-center justify-between rounded-lg border border-line px-4 py-2.5 hover:border-accent">
                <span className="text-sm font-semibold text-ink">{m.name}</span>
                <span className="text-xs text-muted">{m.title}</span>
              </Link>
            ))}
          </div>
        )}

        {tab === "revenue" && (
          <div>
            <p className="text-sm text-muted">إجمالي الدخل المحصّل — من تقارير المشرف</p>
            <p className="mt-1 text-2xl font-extrabold text-ink">{formatSAR(totalRevenue)}</p>

            <div className="mt-6 space-y-2 border-t border-line pt-4">
              {teamShiftReports.length === 0 ? (
                <EmptyState label="لا توجد تقارير شفت مرسلة لهذا الفريق" />
              ) : (
                teamShiftReports.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line px-4 py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-ink">{formatArabicDate(r.date)}</p>
                      <p className="text-xs text-muted">{r.clientsServed} عميل</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {r.paymentMethods.map((m) => (
                        <StatusBadge key={m} label={PAYMENT_METHOD_LABEL[m]} tone="info" />
                      ))}
                      <span className="ms-2 text-sm font-bold text-ink">{formatSAR(r.totalIncome)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === "reports" && (
          <div className="space-y-2">
            {teamReports.length === 0 ? (
              <EmptyState label="لا توجد تقارير مسجلة لهذا الفريق" />
            ) : (
              teamReports.map((r) => (
                <div key={r.id} className="rounded-lg border border-line px-4 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{r.summary}</span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <StatusBadge label={r.reportType} tone={SUPERVISOR_REPORT_TYPE_TONE[r.reportType]} />
                      <StatusBadge label={r.status} tone={SUPERVISOR_REPORT_STATUS_TONE[r.status]} />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted">{formatArabicDate(r.date)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </AppShell>
  );
}
