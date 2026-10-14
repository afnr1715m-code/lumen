import { useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { formatArabicDate } from "@/utils/date";

export default function CoordinatorReportsPage() {
  const managerReports = useOpsStore((s) => s.managerReports);
  const currentUser = useAuthStore((s) => s.currentUser);

  const myReports = useMemo(
    () =>
      managerReports
        .filter((r) => r.recipientId === currentUser?.id)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [managerReports, currentUser]
  );

  return (
    <AppShell title="التقارير">
      <Card title="التقارير الواردة من المدير">
        {myReports.length === 0 ? (
          <EmptyState label="لا توجد تقارير واردة من المدير حاليًا" />
        ) : (
          <div className="space-y-4">
            {myReports.map((r) => (
              <div key={r.id} className="rounded-xl border border-line p-4">
                <p className="mb-3 text-xs font-semibold text-muted">{formatArabicDate(r.date)}</p>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold text-accent">التطوير</p>
                    <p className="text-sm text-ink/80">{r.development}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-accent">النسب</p>
                    <p className="text-sm text-ink/80">{r.ratios}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-accent">الملاحظات</p>
                    <p className="text-sm text-ink/80">{r.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppShell>
  );
}
