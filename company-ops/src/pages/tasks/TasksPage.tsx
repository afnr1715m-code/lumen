import { useMemo, useState } from "react";
import { List, CalendarDays, Plus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable, { type Column } from "@/components/ui/DataTable";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import TaskFormDrawer from "@/components/forms/TaskFormDrawer";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { employees, users } from "@/data/roster";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE, TASK_STATUS_LABEL, TASK_STATUS_TONE } from "@/lib/labels";
import { formatArabicDate, isTaskOverdue } from "@/utils/date";
import type { Task } from "@/types/domain";

const PEOPLE = [...users, ...employees.filter((e) => !users.some((u) => u.id === e.id))];

export default function TasksPage() {
  const tasks = useOpsStore((s) => s.tasks);
  const setTaskStatus = useOpsStore((s) => s.setTaskStatus);
  const setTaskPriority = useOpsStore((s) => s.setTaskPriority);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [view, setView] = useState<"list" | "calendar">("list");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isManager = currentUser?.role === "manager";

  const visibleTasks = useMemo(() => {
    const isSupervisor = currentUser?.role === "supervisor";
    return tasks.filter((t) => {
      if (isSupervisor && t.assigneeId !== currentUser?.id) return false;
      if (search && !t.title.includes(search)) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      return true;
    });
  }, [tasks, search, priorityFilter, statusFilter, currentUser]);

  const sorted = [...visibleTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const markers = useMemo(
    () =>
      tasks.map((t) => ({
        date: t.dueDate,
        tone: TASK_STATUS_TONE[t.status] === "neutral" ? ("info" as const) : TASK_STATUS_TONE[t.status],
        label: t.title,
      })),
    [tasks]
  );

  const tasksOnSelectedDate = selectedDate ? tasks.filter((t) => t.dueDate === selectedDate) : [];

  function personName(id: string) {
    return PEOPLE.find((p) => p.id === id)?.name ?? "—";
  }

  const columns: Column<Task>[] = [
    { key: "title", header: "المهمة", render: (t) => <span className="font-semibold text-ink">{t.title}</span> },
    { key: "assignee", header: "المسؤول", render: (t) => personName(t.assigneeId) },
    {
      key: "priority",
      header: "الأولوية",
      render: (t) =>
        isManager ? (
          <select
            value={t.priority}
            onChange={(e) => setTaskPriority(t.id, e.target.value as Task["priority"], currentUser?.id ?? "")}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg border border-line bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
          >
            {Object.entries(TASK_PRIORITY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          <StatusBadge label={TASK_PRIORITY_LABEL[t.priority]} tone={TASK_PRIORITY_TONE[t.priority]} />
        ),
    },
    { key: "due", header: "تاريخ الاستحقاق", render: (t) => formatArabicDate(t.dueDate) },
    {
      key: "status",
      header: "الحالة",
      render: (t) => (
        <div className="flex items-center gap-1.5">
          {isManager ? (
            <StatusBadge label={TASK_STATUS_LABEL[t.status]} tone={TASK_STATUS_TONE[t.status]} />
          ) : (
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
          )}
          {isTaskOverdue(t.dueDate, t.status) && <StatusBadge label="متأخرة" tone="danger" />}
        </div>
      ),
    },
  ];

  return (
    <AppShell title="المهام">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="ابحث عن مهمة..." className="w-64" />
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[{ value: "all", label: "كل الأولويات" }, ...Object.entries(TASK_PRIORITY_LABEL).map(([v, l]) => ({ value: v, label: l }))]}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[{ value: "all", label: "كل الحالات" }, ...Object.entries(TASK_STATUS_LABEL).map(([v, l]) => ({ value: v, label: l }))]}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-line p-1">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${view === "list" ? "bg-accent text-white" : "text-muted"}`}
              >
                <List size={14} /> قائمة
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${view === "calendar" ? "bg-accent text-white" : "text-muted"}`}
              >
                <CalendarDays size={14} /> تقويم
              </button>
            </div>
            <Button onClick={() => setDrawerOpen(true)}>
              <Plus size={16} /> إضافة مهمة
            </Button>
          </div>
        </div>

        {view === "list" ? (
          <DataTable columns={columns} rows={sorted} emptyLabel="لا توجد مهام مطابقة" />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MonthCalendar markers={markers} onDayClick={setSelectedDate} selectedDate={selectedDate} />
            </div>
            <div>
              <p className="mb-3 text-sm font-bold text-ink">{selectedDate ? formatArabicDate(selectedDate) : "اختاري يومًا"}</p>
              {tasksOnSelectedDate.length === 0 ? (
                <p className="text-sm text-muted">لا توجد مهام في هذا اليوم</p>
              ) : (
                <ul className="space-y-2">
                  {tasksOnSelectedDate.map((t) => (
                    <li key={t.id} className="rounded-lg border border-line p-3">
                      <p className="text-sm font-semibold text-ink">{t.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusBadge label={TASK_PRIORITY_LABEL[t.priority]} tone={TASK_PRIORITY_TONE[t.priority]} />
                        <span className="text-xs text-muted">{personName(t.assigneeId)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Card>

      <TaskFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </AppShell>
  );
}
