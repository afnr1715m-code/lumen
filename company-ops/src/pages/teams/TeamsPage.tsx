import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { TEAM_STATUS_LABEL, TEAM_STATUS_TONE } from "@/lib/labels";
import { formatSAR } from "@/utils/currency";
import { todayISO } from "@/utils/date";
import type { Team } from "@/types/domain";

interface Row extends Team {
  supervisorName: string;
  memberCount: number;
  revenueToday: number;
}

export default function TeamsPage() {
  const teams = useOpsStore((s) => s.teams);
  const employees = useOpsStore((s) => s.employees);
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const currentUser = useAuthStore((s) => s.currentUser);
  const navigate = useNavigate();
  const today = todayISO();

  const visibleTeams = currentUser?.role === "supervisor" ? teams.filter((t) => t.id === currentUser.teamId) : teams;

  const rows: Row[] = useMemo(
    () =>
      visibleTeams.map((team) => {
        const todayReports = shiftReports.filter((r) => r.teamId === team.id && r.date === today);
        return {
          ...team,
          supervisorName: employees.find((e) => e.id === team.supervisorId)?.name ?? "—",
          memberCount: employees.filter((e) => e.teamId === team.id).length,
          revenueToday: todayReports.reduce((sum, r) => sum + r.totalIncome, 0),
        };
      }),
    [visibleTeams, employees, shiftReports, today]
  );

  const columns: Column<Row>[] = [
    { key: "name", header: "اسم الفريق", render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
    { key: "supervisor", header: "المشرف", render: (r) => r.supervisorName },
    { key: "members", header: "عدد الموظفين", render: (r) => r.memberCount },
    { key: "status", header: "الحالة", render: (r) => <StatusBadge label={TEAM_STATUS_LABEL[r.status]} tone={TEAM_STATUS_TONE[r.status]} /> },
    { key: "revenue", header: "دخل اليوم", render: (r) => formatSAR(r.revenueToday) },
  ];

  return (
    <AppShell title="الفرق">
      <Card>
        <DataTable columns={columns} rows={rows} onRowClick={(r) => navigate(`/teams/${r.id}`)} emptyLabel="لا توجد فرق" />
      </Card>
    </AppShell>
  );
}
