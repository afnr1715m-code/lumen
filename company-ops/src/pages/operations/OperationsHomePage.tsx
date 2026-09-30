import { useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE, TASK_STATUS_LABEL } from "@/lib/labels";
import { formatArabicDate } from "@/utils/date";
import type { TaskStatus } from "@/types/domain";

export default function OperationsHomePage() {
  const teams = useOpsStore((s) => s.teams);
  const tasks = useOpsStore((s) => s.tasks);
  const setTaskStatus = useOpsStore((s) => s.setTaskStatus);
  const currentUser = useAuthStore((s) => s.currentUser);

  const team = teams.find((t) => t.id === currentUser?.teamId);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === currentUser?.id).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks, currentUser]
  );

  return (
    <AppShell title={team ? `الرئيسية — ${team.name}` : "الرئيسية"}>
      <Card title="المهام المرسلة من المدير">
        {myTasks.length === 0 ? (
          <EmptyState label="لا توجد مهام مرسلة لك حاليًا" />
        ) : (
          <div className="space-y-3">
            {myTasks.map((t) => (
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
                      onChange={(e) => setTaskStatus(t.id, e.target.value as TaskStatus, currentUser?.id ?? "")}
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
        )}
      </Card>
    </AppShell>
  );
}
