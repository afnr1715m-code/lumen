import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import TaskFormDrawer from "@/components/forms/TaskFormDrawer";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { users } from "@/data/roster";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE, TASK_STATUS_LABEL } from "@/lib/labels";
import { formatArabicDate, isTaskOverdue } from "@/utils/date";
import type { Task, TaskStatus } from "@/types/domain";

// Tasks assigned to the manager themselves — self-added reminders (contract
// renewals, payroll runs, ...) — kept separate from tasks the coordinator
// assigned to them, pulled from the same shared Task system used everywhere
// else (see assignedBy), not a separate personal-task model.
export default function ManagerMyTasksPage() {
  const tasks = useOpsStore((s) => s.tasks);
  const setTaskStatus = useOpsStore((s) => s.setTaskStatus);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === currentUser?.id).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks, currentUser]
  );

  function assignerRole(t: Task) {
    return users.find((u) => u.id === t.assignedBy)?.role;
  }
  const tasksFromCoordinator = myTasks.filter((t) => assignerRole(t) === "coordinator");
  const myOwnTasks = myTasks.filter((t) => assignerRole(t) !== "coordinator");

  return (
    <AppShell title="مهامي">
      <div className="space-y-6">
        <Card
          title="المهام المسندة إليك"
          action={
            <Button onClick={() => setDrawerOpen(true)}>
              <Plus size={15} /> إضافة مهمة
            </Button>
          }
        >
          <TaskList
            tasks={myOwnTasks}
            setTaskStatus={setTaskStatus}
            currentUserId={currentUser?.id ?? ""}
            emptyLabel="لا توجد مهام مسندة إليك حاليًا"
            emptyHint="اضغط «إضافة مهمة» عشان تسجل أول متابعة لنفسك"
          />
        </Card>
        <Card title="المهام المسندة إليك من المسؤول المباشر">
          <TaskList
            tasks={tasksFromCoordinator}
            setTaskStatus={setTaskStatus}
            currentUserId={currentUser?.id ?? ""}
            emptyLabel="لا توجد مهام مرسلة لك من المسؤول المباشر حاليًا"
          />
        </Card>
      </div>

      <TaskFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </AppShell>
  );
}

function TaskList({
  tasks,
  setTaskStatus,
  currentUserId,
  emptyLabel,
  emptyHint,
}: {
  tasks: Task[];
  setTaskStatus: (id: string, status: TaskStatus, actorId: string) => void;
  currentUserId: string;
  emptyLabel: string;
  emptyHint?: string;
}) {
  if (tasks.length === 0) return <EmptyState label={emptyLabel} hint={emptyHint} />;
  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <div key={t.id} className="rounded-xl border border-line p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{t.title}</p>
              {t.description && <p className="mt-1 text-sm text-muted">{t.description}</p>}
              <p className="mt-2 text-xs text-muted">
                {formatArabicDate(t.dueDate)} · {t.dueTime}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge label={TASK_PRIORITY_LABEL[t.priority]} tone={TASK_PRIORITY_TONE[t.priority]} />
              {isTaskOverdue(t.dueDate, t.status) && <StatusBadge label="متأخرة" tone="danger" />}
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
        </div>
      ))}
    </div>
  );
}
