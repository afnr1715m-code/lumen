import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { employees, users } from "@/data/roster";
import { formatArabicDateTime } from "@/utils/date";
import { History } from "lucide-react";

const PEOPLE = [...users, ...employees.filter((e) => !users.some((u) => u.id === e.id))];

export default function AuditLogPage() {
  const auditLog = useOpsStore((s) => s.auditLog);

  function actorName(id: string) {
    return PEOPLE.find((p) => p.id === id)?.name ?? id;
  }

  return (
    <AppShell title="سجل العمليات">
      <Card title="آخر العمليات">
        {auditLog.length === 0 ? (
          <EmptyState label="لا توجد عمليات مسجلة بعد" />
        ) : (
          <ul className="space-y-1">
            {auditLog.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 border-b border-line py-3 last:border-0">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <History size={13} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">
                    <span className="font-semibold">{actorName(entry.actorId)}</span> {entry.action}
                  </p>
                  <p className="text-xs text-muted">{formatArabicDateTime(entry.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  );
}
