import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCheck } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { NOTIFICATION_PRIORITY_LABEL, NOTIFICATION_PRIORITY_TONE } from "@/lib/labels";
import { formatArabicDateTime } from "@/utils/date";
import type { NotificationPriority } from "@/types/domain";

const TABS: { key: NotificationPriority; label: string }[] = [
  { key: "urgent", label: "عاجل" },
  { key: "follow_up", label: "يحتاج متابعة" },
  { key: "upcoming", label: "قادم" },
  { key: "done", label: "مكتمل" },
];

export default function NotificationsCenterPage() {
  const notifications = useOpsStore((s) => s.notifications);
  const markNotificationRead = useOpsStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useOpsStore((s) => s.markAllNotificationsRead);
  const [activeTab, setActiveTab] = useState<NotificationPriority>("urgent");

  const filtered = useMemo(() => notifications.filter((n) => n.priority === activeTab), [notifications, activeTab]);

  return (
    <AppShell title="مركز التنبيهات">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const count = notifications.filter((n) => n.priority === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.key ? "bg-accent text-white" : "bg-bg text-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                  <span className={`rounded-full px-1.5 text-xs ${activeTab === tab.key ? "bg-white/20" : "bg-slate-200"}`}>{count}</span>
                </button>
              );
            })}
          </div>
          <Button variant="secondary" onClick={markAllNotificationsRead}>
            <CheckCheck size={16} /> تعليم الكل كمقروء
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState label="لا توجد تنبيهات في هذا التصنيف" />
        ) : (
          <ul className="space-y-2">
            {filtered.map((n) => (
              <li
                key={n.id}
                className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3.5 ${
                  n.read ? "border-line opacity-70" : "border-line bg-bg/60"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={NOTIFICATION_PRIORITY_LABEL[n.priority]} tone={NOTIFICATION_PRIORITY_TONE[n.priority]} />
                    <span className="text-sm font-semibold text-ink">{n.title}</span>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  </div>
                  <p className="mt-1 text-sm text-muted">{n.description}</p>
                  <p className="mt-1 text-xs text-muted/70">{formatArabicDateTime(n.date)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {n.actionHref && (
                    <Link to={n.actionHref} onClick={() => markNotificationRead(n.id)} className="text-xs font-semibold text-accent hover:underline">
                      {n.actionLabel}
                    </Link>
                  )}
                  {!n.read && (
                    <button onClick={() => markNotificationRead(n.id)} className="text-xs text-muted hover:text-ink">
                      تعليم كمقروء
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  );
}
