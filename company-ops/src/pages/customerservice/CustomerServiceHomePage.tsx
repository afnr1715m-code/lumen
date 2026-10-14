import { useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE, TASK_STATUS_LABEL } from "@/lib/labels";
import { formatArabicDate, formatArabicDateTime } from "@/utils/date";
import { employees, users } from "@/data/roster";
import type { Task, TaskStatus } from "@/types/domain";

export default function CustomerServiceHomePage() {
  const tasks = useOpsStore((s) => s.tasks);
  const customerServiceReports = useOpsStore((s) => s.customerServiceReports);
  const setTaskStatus = useOpsStore((s) => s.setTaskStatus);
  const currentUser = useAuthStore((s) => s.currentUser);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === currentUser?.id).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks, currentUser]
  );

  function assignerRole(t: Task) {
    return users.find((u) => u.id === t.assignedBy)?.role;
  }
  const tasksFromCoordinator = myTasks.filter((t) => assignerRole(t) === "coordinator");
  const tasksFromManager = myTasks.filter((t) => assignerRole(t) !== "coordinator");

  // The most recent hand-over note left by someone other than the person
  // currently logged in — i.e. "notes from the previous shift."
  const previousShiftNote = customerServiceReports
    .filter((r) => r.employeeId !== currentUser?.id && r.notes.trim())
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];

  function employeeName(id: string) {
    return employees.find((e) => e.id === id)?.name ?? "—";
  }

  return (
    <AppShell title="الرئيسية">
      {previousShiftNote && (
        <Card title="ملاحظات الشفت السابق" className="mb-6">
          <p className="text-sm leading-relaxed text-ink">{previousShiftNote.notes}</p>
          <p className="mt-3 text-xs text-muted">
            من {employeeName(previousShiftNote.employeeId)} · شفت {previousShiftNote.shift} · {formatArabicDateTime(previousShiftNote.submittedAt)}
          </p>
        </Card>
      )}

      <div className="space-y-6">
        <Card title="المهام من المدير">
          <TaskList tasks={tasksFromManager} setTaskStatus={setTaskStatus} currentUserId={currentUser?.id ?? ""} />
        </Card>
        <Card title="المهام من المسؤول المباشر">
          <TaskList tasks={tasksFromCoordinator} setTaskStatus={setTaskStatus} currentUserId={currentUser?.id ?? ""} />
        </Card>
      </div>
    </AppShell>
  );
}

function TaskList({
  tasks,
  setTaskStatus,
  currentUserId,
}: {
  tasks: Task[];
  setTaskStatus: (id: string, status: TaskStatus, actorId: string) => void;
  currentUserId: string;
}) {
  if (tasks.length === 0) return <EmptyState label="لا توجد مهام موكلة لك حاليًا" />;
  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <div key={t.id} className="rounded-xl border border-line p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{t.title}</p>
              {t.description && <p className="mt-1 text-sm text-muted">{t.description}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge label={TASK_PRIORITY_LABEL[t.priority]} tone={TASK_PRIORITY_TONE[t.priority]} />
              <select
                value={t.status}
                onChange={(e) => setTaskStatus(t.id, e.target.value as TaskStatus, currentUserId)}
                className="rounded-lg border border-line bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
              >
                {Object.entries(TASK_STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">
            {formatArabicDate(t.dueDate)} · {t.dueTime}
          </p>
        </div>
      ))}
    </div>
  );
}
