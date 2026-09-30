import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import KPICard from "@/components/ui/KPICard";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE, TASK_STATUS_LABEL, ATTENDANCE_STATUS_LABEL, ATTENDANCE_STATUS_TONE } from "@/lib/labels";
import { formatArabicDate, isTaskOverdue, todayISO } from "@/utils/date";
import { CheckSquare, AlertTriangle, CalendarCheck } from "lucide-react";

export default function MyWorkPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const tasks = useOpsStore((s) => s.tasks);
  const attendanceRecords = useOpsStore((s) => s.attendanceRecords);
  const setTaskStatus = useOpsStore((s) => s.setTaskStatus);

  if (!currentUser) return null;

  const myTasks = tasks.filter((t) => t.assigneeId === currentUser.id);
  const myAttendance = attendanceRecords.filter((a) => a.employeeId === currentUser.id).sort((a, b) => b.date.localeCompare(a.date));
  const today = todayISO();
  const todayRecord = myAttendance.find((a) => a.date === today);
  const overdueCount = myTasks.filter((t) => isTaskOverdue(t.dueDate, t.status)).length;

  return (
    <AppShell title="مهامي">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="مهامي المفتوحة" value={myTasks.filter((t) => t.status !== "مكتملة").length} icon={CheckSquare} tone="accent" />
        <KPICard label="مهام متأخرة" value={overdueCount} icon={AlertTriangle} tone="danger" />
        <KPICard label="حضور اليوم" value={todayRecord ? ATTENDANCE_STATUS_LABEL[todayRecord.status] : "—"} icon={CalendarCheck} tone="neutral" />
      </div>

      <Card title="مهامي">
        {myTasks.length === 0 ? (
          <EmptyState label="لا توجد مهام مسندة إليك حالياً" />
        ) : (
          <ul className="space-y-2">
            {myTasks.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{t.title}</p>
                  <p className="mt-1 text-xs text-muted">تاريخ الاستحقاق: {formatArabicDate(t.dueDate)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={TASK_PRIORITY_LABEL[t.priority]} tone={TASK_PRIORITY_TONE[t.priority]} />
                  <select
                    value={t.status}
                    onChange={(e) => setTaskStatus(t.id, e.target.value as typeof t.status, currentUser.id)}
                    className="rounded-lg border border-line bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
                  >
                    {Object.entries(TASK_STATUS_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="mt-6">
        <Card title="حضوري الأخير">
          <ul className="space-y-2">
            {myAttendance.slice(0, 7).map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-lg border border-line px-4 py-2.5">
                <span className="text-sm text-ink">{formatArabicDate(a.date)}</span>
                <StatusBadge label={ATTENDANCE_STATUS_LABEL[a.status]} tone={ATTENDANCE_STATUS_TONE[a.status]} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
