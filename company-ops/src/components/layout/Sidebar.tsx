import { NavLink } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";
import { navForRole } from "@/lib/rbac";
import { ICON_MAP } from "./iconMap";
import { useAuthStore } from "@/store/authStore";
import { ROLE_LABEL } from "@/lib/labels";
import washLogo from "@/assets/wash-logo.jpg";

export default function Sidebar() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  if (!currentUser) return null;

  const items = navForRole(currentUser.role);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-e border-line bg-surface">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
          <Sparkles size={18} />
        </span>
        <div>
          <p className="text-sm font-extrabold text-ink">نظام التشغيل</p>
          <p className="text-xs text-muted">عرض تجريبي</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon];
            // NavLink's default matching treats a shorter href as active
            // whenever the current path starts with it — e.g. "الرئيسية"
            // (/customer-service) would stay highlighted on "مهامي"
            // (/customer-service/my-tasks). Require an exact match for any
            // item that has sibling pages nested under its own href.
            const hasNestedSibling = items.some((other) => other.key !== item.key && other.href.startsWith(`${item.href}/`));
            return (
              <li key={item.key}>
                <NavLink
                  to={item.href}
                  end={hasNestedSibling}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? "bg-accent-soft text-accent" : "text-muted hover:bg-bg hover:text-ink"
                    }`
                  }
                >
                  {Icon && <Icon size={18} />}
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
            {currentUser.avatarInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{currentUser.name}</p>
            <p className="truncate text-xs text-muted">{ROLE_LABEL[currentUser.role]}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="تسجيل الخروج"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-bg hover:text-danger"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center border-t border-line py-3">
        <img src={washLogo} alt="WASH" className="h-7 w-7 rounded-md object-cover opacity-90" />
      </div>
    </aside>
  );
}
