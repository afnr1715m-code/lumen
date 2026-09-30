import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
  CheckSquare,
  AlertTriangle,
  ClipboardList,
  Wallet,
  Users2,
  UserCheck,
  Plus,
  CalendarPlus,
  UserPlus,
  BellPlus,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import KPICard from "@/components/ui/KPICard";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { NOTIFICATION_PRIORITY_LABEL, NOTIFICATION_PRIORITY_TONE, TEAM_STATUS_LABEL, TEAM_STATUS_TONE } from "@/lib/labels";
import { formatSAR } from "@/utils/currency";
import { isTaskOverdue, todayISO } from "@/utils/date";
import type { NotificationPriority } from "@/types/domain";
import TaskFormDrawer from "@/components/forms/TaskFormDrawer";
import CalendarEventModal from "@/components/forms/CalendarEventModal";
import EmployeeFormDrawer from "@/components/forms/EmployeeFormDrawer";
import ManualNotificationModal from "@/components/forms/ManualNotificationModal";

const TABS: { key: NotificationPriority; label: string }[] = [
  { key: "urgent", label: "عاجل" },
  { key: "follow_up", label: "يحتاج متابعة" },
  { key: "upcoming", label: "قادم" },
  { key: "done", label: "مكتمل" },
];

export default function ManagerDashboard() {
  const employees = useOpsStore((s) => s.employees);
  const teams = useOpsStore((s) => s.teams);
  const tasks = useOpsStore((s) => s.tasks);
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const attendanceRecords = useOpsStore((s) => s.attendanceRecords);
  const notifications = useOpsStore((s) => s.notifications);

  const [activeTab, setActiveTab] = useState<NotificationPriority>("urgent");
  const [openDrawer, setOpenDrawer] = useState<null | "task" | "calendar" | "employee" | "notification">(null);

  const today = todayISO();

  const tasksToday = tasks.filter((t) => t.dueDate === today && t.status !== "مكتملة").length;
  const overdueTasks = tasks.filter((t) => isTaskOverdue(t.dueDate, t.status)).length;
  const activeTeams = teams.filter((t) => t.status === "active").length;
  const presentToday = attendanceRecords.filter((a) => a.date === today && (a.status === "present" || a.status === "late")).length;

  const todayShiftReports = shiftReports.filter((r) => r.date === today);
  const clientsToday = todayShiftReports.reduce((sum, r) => sum + r.clientsServed, 0);
  const revenueToday = todayShiftReports.reduce((sum, r) => sum + r.totalIncome, 0);

  const filteredNotifications = useMemo(
    () => notifications.filter((n) => n.priority === activeTab),
    [notifications, activeTab]
  );

  const revenueByTeam = useMemo(() => {
    return teams.map((team) => ({
      name: team.name,
      "إجمالي الدخل": todayShiftReports.filter((r) => r.teamId === team.id).reduce((sum, r) => sum + r.totalIncome, 0),
    }));
  }, [teams, todayShiftReports]);

  return (
    <AppShell title="لوحة المدير">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <KPICard label="مهام اليوم" value={tasksToday} icon={CheckSquare} tone="accent" />
          <KPICard label="مهام متأخرة" value={overdueTasks} icon={AlertTriangle} tone="danger" />
          <KPICard label="العملاء اليوم" value={clientsToday} icon={ClipboardList} tone="accent" />
          <KPICard label="دخل اليوم" value={formatSAR(revenueToday)} icon={Wallet} tone="accent" />
          <KPICard label="الفرق النشطة" value={`${activeTeams} / ${teams.length}`} icon={Users2} tone="neutral" />
          <KPICard label="الموظفون الحاضرون" value={`${presentToday} / ${employees.length}`} icon={UserCheck} tone="neutral" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card title="يحتاج انتباهك" className="xl:col-span-2">
            <div className="mb-4 flex gap-2 overflow-x-auto">
              {TABS.map((tab) => {
                const count = notifications.filter((n) => n.priority === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      activeTab === tab.key ? "bg-accent text-white" : "bg-bg text-muted hover:text-ink"
                    }`}
                  >
                    {tab.label}
                    <span className={`rounded-full px-1.5 ${activeTab === tab.key ? "bg-white/20" : "bg-slate-200"}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {filteredNotifications.length === 0 ? (
              <EmptyState label="لا توجد تنبيهات في هذا التصنيف" />
            ) : (
              <ul className="space-y-2">
                {filteredNotifications.map((n) => (
                  <li key={n.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge label={NOTIFICATION_PRIORITY_LABEL[n.priority]} tone={NOTIFICATION_PRIORITY_TONE[n.priority]} />
                        <span className="truncate text-sm font-semibold text-ink">{n.title}</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted">{n.description}</p>
                    </div>
                    {n.actionHref && (
                      <Link to={n.actionHref} className="shrink-0 text-xs font-semibold text-accent hover:underline">
                        {n.actionLabel}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="إجراءات سريعة">
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={Plus} label="إضافة مهمة" onClick={() => setOpenDrawer("task")} />
              <QuickAction icon={CalendarPlus} label="إضافة موعد" onClick={() => setOpenDrawer("calendar")} />
              <QuickAction icon={UserPlus} label="إضافة موظف" onClick={() => setOpenDrawer("employee")} />
              <QuickAction icon={BellPlus} label="إضافة تنبيه" onClick={() => setOpenDrawer("notification")} />
            </div>
          </Card>
        </div>

        <Card title="التشغيل الآن">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-3 py-2 text-start text-xs font-semibold text-muted">الفريق</th>
                  <th className="px-3 py-2 text-start text-xs font-semibold text-muted">المشرف</th>
                  <th className="px-3 py-2 text-start text-xs font-semibold text-muted">عدد الموظفين</th>
                  <th className="px-3 py-2 text-start text-xs font-semibold text-muted">الحالة</th>
                  <th className="px-3 py-2 text-start text-xs font-semibold text-muted">عملاء اليوم</th>
                  <th className="px-3 py-2 text-start text-xs font-semibold text-muted">دخل اليوم</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => {
                  const supervisor = employees.find((e) => e.id === team.supervisorId);
                  const memberCount = employees.filter((e) => e.teamId === team.id).length;
                  const teamReportsToday = todayShiftReports.filter((r) => r.teamId === team.id);
                  const teamClientsToday = teamReportsToday.reduce((sum, r) => sum + r.clientsServed, 0);
                  const teamRevenueToday = teamReportsToday.reduce((sum, r) => sum + r.totalIncome, 0);
                  return (
                    <tr key={team.id} className="border-b border-line last:border-0">
                      <td className="px-3 py-3 font-semibold text-ink">
                        <Link to={`/teams/${team.id}`} className="hover:text-accent">
                          {team.name}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-muted">{supervisor?.name}</td>
                      <td className="px-3 py-3 text-muted">{memberCount}</td>
                      <td className="px-3 py-3">
                        <StatusBadge label={TEAM_STATUS_LABEL[team.status]} tone={TEAM_STATUS_TONE[team.status]} />
                      </td>
                      <td className="px-3 py-3 text-muted">{teamClientsToday}</td>
                      <td className="px-3 py-3 font-semibold text-ink">{formatSAR(teamRevenueToday)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card title="الإيرادات — اليوم حسب الفريق" className="xl:col-span-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByTeam}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="إجمالي الدخل" fill="#0a6e3d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card
            title="حالة تقارير الشفت — اليوم"
            action={
              <Link to="/reports" className="text-xs font-semibold text-accent hover:underline">
                عرض الكل
              </Link>
            }
          >
            <ul className="space-y-3">
              {teams.map((team) => {
                const submitted = todayShiftReports.some((r) => r.teamId === team.id);
                return (
                  <li key={team.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">{team.name}</span>
                    <StatusBadge label={submitted ? "تم الإرسال" : "لم يُرسل بعد"} tone={submitted ? "success" : "warning"} />
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>

      <TaskFormDrawer open={openDrawer === "task"} onClose={() => setOpenDrawer(null)} />
      <CalendarEventModal open={openDrawer === "calendar"} onClose={() => setOpenDrawer(null)} />
      <EmployeeFormDrawer open={openDrawer === "employee"} onClose={() => setOpenDrawer(null)} />
      <ManualNotificationModal open={openDrawer === "notification"} onClose={() => setOpenDrawer(null)} />
    </AppShell>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
  full = false,
}: {
  icon: typeof Plus;
  label: string;
  onClick: () => void;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-line px-3 py-4 text-center text-xs font-semibold text-muted transition hover:border-accent hover:bg-accent-soft hover:text-accent ${
        full ? "col-span-2" : ""
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}
