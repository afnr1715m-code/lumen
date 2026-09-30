import type { Role } from "@/types/domain";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: string; // lucide-react icon name, resolved in Sidebar
  roles: Role[];
}

// Manager and supervisor each get their own copies of any shared page
// (tasks/calendar/inventory/notifications) so the two sidebars can be
// ordered and labeled independently — reordering one role's nav can never
// shift the other role's nav, since they're separate array entries.
export const NAV_ITEMS: NavItem[] = [
  // Manager
  { key: "dashboard", label: "لوحة المدير", href: "/dashboard", icon: "LayoutDashboard", roles: ["manager"] },
  { key: "tasks", label: "المهام", href: "/tasks", icon: "CheckSquare", roles: ["manager"] },
  { key: "calendar", label: "التقويم", href: "/calendar", icon: "Calendar", roles: ["manager", "employee"] },
  { key: "employees", label: "الموظفون", href: "/employees", icon: "Users", roles: ["manager"] },
  { key: "teams", label: "الفرق", href: "/teams", icon: "Users2", roles: ["manager"] },
  { key: "revenue", label: "دخل الفرق", href: "/revenue", icon: "BarChart3", roles: ["manager"] },
  { key: "inventory", label: "المخزون", href: "/inventory", icon: "Boxes", roles: ["manager"] },
  { key: "reports", label: "التقارير", href: "/reports", icon: "FileBarChart", roles: ["manager"] },
  { key: "payroll", label: "الرواتب", href: "/payroll", icon: "Wallet", roles: ["manager"] },
  { key: "notifications", label: "مركز التنبيهات", href: "/notifications", icon: "Bell", roles: ["manager", "employee"] },
  { key: "audit", label: "سجل العمليات", href: "/audit-log", icon: "History", roles: ["manager"] },

  // Supervisor — order here is exactly the supervisor's sidebar order
  { key: "operations", label: "الرئيسية", href: "/operations", icon: "LayoutDashboard", roles: ["supervisor"] },
  { key: "sup-tasks", label: "مهامي", href: "/tasks", icon: "CheckSquare", roles: ["supervisor"] },
  { key: "shift-employees", label: "الموظفين", href: "/operations/employees", icon: "Users2", roles: ["supervisor"] },
  { key: "sup-inventory", label: "المخزون", href: "/inventory", icon: "Boxes", roles: ["supervisor"] },
  { key: "shift-reports", label: "التقارير", href: "/operations/reports", icon: "FileBarChart", roles: ["supervisor"] },
  { key: "sup-calendar", label: "التقويم", href: "/calendar", icon: "Calendar", roles: ["supervisor"] },
  { key: "shift-issues", label: "المشاكل والأعطال", href: "/operations/issues", icon: "AlertTriangle", roles: ["supervisor"] },
  { key: "sup-notifications", label: "مركز التنبيهات", href: "/notifications", icon: "Bell", roles: ["supervisor"] },
  { key: "shift-notes", label: "الملاحظات", href: "/operations/notes", icon: "StickyNote", roles: ["supervisor"] },

  // Employee
  { key: "my-work", label: "مهامي", href: "/my-work", icon: "ListChecks", roles: ["employee"] },

  // Customer service — order here is exactly the customer-service sidebar order
  { key: "cs-home", label: "الرئيسية", href: "/customer-service", icon: "LayoutDashboard", roles: ["customer_service"] },
  { key: "cs-tasks", label: "المهام", href: "/customer-service/tasks", icon: "CheckSquare", roles: ["customer_service"] },
  { key: "cs-my-tasks", label: "مهامي", href: "/customer-service/my-tasks", icon: "ListChecks", roles: ["customer_service"] },
  { key: "cs-calendar", label: "التقويم", href: "/calendar", icon: "Calendar", roles: ["customer_service"] },
  { key: "cs-reports", label: "التقارير", href: "/customer-service/reports", icon: "FileBarChart", roles: ["customer_service"] },
  { key: "cs-complaints", label: "الشكاوى", href: "/customer-service/complaints", icon: "AlertTriangle", roles: ["customer_service"] },
  { key: "cs-suggestions", label: "الاقتراحات", href: "/customer-service/suggestions", icon: "StickyNote", roles: ["customer_service"] },
];

export function navForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function defaultRouteForRole(role: Role): string {
  if (role === "manager") return "/dashboard";
  if (role === "supervisor") return "/operations";
  if (role === "customer_service") return "/customer-service";
  return "/my-work";
}

export function canAccessRoute(role: Role, href: string): boolean {
  const matches = NAV_ITEMS.filter((i) => href === i.href || href.startsWith(`${i.href}/`));
  if (matches.length === 0) return true; // detail routes not listed in nav (e.g. /employees/:id) are gated by their parent page instead
  return matches.some((i) => i.roles.includes(role));
}
