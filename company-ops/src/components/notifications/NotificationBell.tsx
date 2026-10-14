import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { NOTIFICATION_PRIORITY_TONE } from "@/lib/labels";
import StatusBadge from "@/components/ui/StatusBadge";
import { NOTIFICATION_PRIORITY_LABEL } from "@/lib/labels";
import EmptyState from "@/components/ui/EmptyState";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const allNotifications = useOpsStore((s) => s.notifications);
  const markRead = useOpsStore((s) => s.markNotificationRead);
  const currentUser = useAuthStore((s) => s.currentUser);

  // Supervisors only see task-related alerts — contracts/iqamas, inventory,
  // revenue, and payroll are the manager's responsibility, not theirs.
  const isSupervisor = currentUser?.role === "supervisor";
  const notifications = isSupervisor ? allNotifications.filter((n) => n.module === "tasks") : allNotifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const top = [...notifications]
    .sort((a, b) => (a.priority === "urgent" ? -1 : 1) - (b.priority === "urgent" ? -1 : 1))
    .slice(0, 6);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="التنبيهات"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-bg hover:text-ink"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 end-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fade-in absolute top-12 end-0 z-40 w-96 rounded-2xl border border-line bg-surface shadow-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-bold text-ink">التنبيهات</p>
            <Link to="/notifications" onClick={() => setOpen(false)} className="text-xs font-semibold text-accent">
              عرض الكل
            </Link>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {top.length === 0 ? (
              <EmptyState label="لا توجد تنبيهات حالياً" />
            ) : (
              top.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markRead(n.id)}
                  className={`flex w-full flex-col gap-1 border-b border-line px-4 py-3 text-start last:border-0 hover:bg-bg ${
                    n.read ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{n.title}</span>
                    <StatusBadge label={NOTIFICATION_PRIORITY_LABEL[n.priority]} tone={NOTIFICATION_PRIORITY_TONE[n.priority]} />
                  </div>
                  <p className="text-xs text-muted">{n.description}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
