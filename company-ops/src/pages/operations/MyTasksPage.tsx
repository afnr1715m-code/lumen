import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import PersonalTaskFormDrawer from "@/components/forms/PersonalTaskFormDrawer";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { PERSONAL_TASK_STATUS_TONE } from "@/lib/labels";
import { formatArabicDate } from "@/utils/date";
import type { PersonalTaskStatus } from "@/types/domain";

const STATUS_OPTIONS: PersonalTaskStatus[] = ["لم تبدأ", "قيد التنفيذ", "مكتملة"];

// The supervisor's own self-added personal tasks — distinct from the
// manager-assigned Task list, which only shows on the "الرئيسية" page.
export default function MyTasksPage() {
  const personalTasks = useOpsStore((s) => s.personalTasks);
  const updatePersonalTaskStatus = useOpsStore((s) => s.updatePersonalTaskStatus);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const myPersonalTasks = useMemo(
    () =>
      personalTasks
        .filter((t) => t.employeeId === currentUser?.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [personalTasks, currentUser]
  );

  return (
    <AppShell title="مهامي">
      <Card
        title="قائمتي الشخصية للتذكير والمتابعة"
        action={
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={15} /> إضافة مهمة
          </Button>
        }
      >
        {myPersonalTasks.length === 0 ? (
          <EmptyState label="ما أضفت أي مهمة شخصية بعد" hint="اضغط «إضافة مهمة» عشان تسجل أول متابعة" />
        ) : (
          <div className="space-y-2">
            {myPersonalTasks.map((t) => (
              <div key={t.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{t.title}</p>
                    {t.description && <p className="mt-1 text-sm text-muted">{t.description}</p>}
                    <p className="mt-2 text-xs text-muted">
                      {formatArabicDate(t.date)}
                      {t.time ? ` · ${t.time}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge label={t.status} tone={PERSONAL_TASK_STATUS_TONE[t.status]} />
                    <select
                      value={t.status}
                      onChange={(e) => updatePersonalTaskStatus(t.id, e.target.value as PersonalTaskStatus, currentUser?.id ?? "")}
                      className="rounded-lg border border-line bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <PersonalTaskFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </AppShell>
  );
}
