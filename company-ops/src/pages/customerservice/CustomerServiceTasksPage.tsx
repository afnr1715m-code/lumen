import { useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE, TASK_STATUS_LABEL } from "@/lib/labels";
import { formatArabicDate } from "@/utils/date";
import type { Task } from "@/types/domain";

export default function CustomerServiceTasksPage() {
  const tasks = useOpsStore((s) => s.tasks);
  const setTaskStatus = useOpsStore((s) => s.setTaskStatus);
  const currentUser = useAuthStore((s) => s.currentUser);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === currentUser?.id).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks, currentUser]
  );

  const columns: Column<Task>[] = [
    { key: "title", header: "المهمة", render: (t) => <span className="font-semibold text-ink">{t.title}</span> },
    { key: "priority", header: "الأولوية", render: (t) => <StatusBadge label={TASK_PRIORITY_LABEL[t.priority]} tone={TASK_PRIORITY_TONE[t.priority]} /> },
    { key: "due", header: "تاريخ الاستحقاق", render: (t) => `${formatArabicDate(t.dueDate)} · ${t.dueTime}` },
    {
      key: "status",
      header: "الحالة",
      render: (t) => (
        <select
          value={t.status}
          onChange={(e) => setTaskStatus(t.id, e.target.value as Task["status"], currentUser?.id ?? "")}
          onClick={(e) => e.stopPropagation()}
          className="rounded-lg border border-line bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
        >
          {Object.entries(TASK_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <AppShell title="المهام">
      <Card>
        <DataTable columns={columns} rows={myTasks} emptyLabel="لا توجد مهام موكلة لك حاليًا" />
      </Card>
    </AppShell>
  );
}
