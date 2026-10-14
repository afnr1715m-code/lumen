import type {
  AppNotification,
  DailyReport,
  Employee,
  Product,
  Service,
  Task,
  Team,
} from "@/types/domain";
import { daysUntil, currentDayOfMonth } from "@/utils/date";

interface AutomationInput {
  employees: Employee[];
  teams: Team[];
  tasks: Task[];
  services: Service[];
  dailyReports: DailyReport[];
  products: Product[];
}

const CONTRACT_WARNING_DAYS = 30;
const IQAMA_WARNING_DAYS = 30;
const TASK_DUE_SOON_DAYS = 2;

function priorityFromDays(days: number, urgentAt: number): AppNotification["priority"] {
  if (days < 0) return "urgent";
  if (days <= urgentAt / 2) return "urgent";
  return "follow_up";
}

/**
 * Recomputes every notification from the current state instead of storing
 * hand-authored alerts — this is what makes the system "notice" things
 * rather than just hold a database. Pure function: same input, same output.
 */
export function computeNotifications(input: AutomationInput): AppNotification[] {
  const { employees, teams, tasks, services, dailyReports, products } = input;
  const notifications: AppNotification[] = [];
  const now = new Date().toISOString();

  // 1) End-of-day report not submitted (overdue)
  for (const report of dailyReports) {
    if (report.kind === "end_of_day" && report.status === "overdue") {
      const team = teams.find((t) => t.id === report.teamId);
      notifications.push({
        id: `notif_report_${report.id}`,
        title: "تقرير نهاية اليوم لم يتم رفعه",
        description: `${team?.name ?? "فريق"} لم يرفع تقرير نهاية اليوم بتاريخ ${report.date}.`,
        priority: "urgent",
        date: now,
        module: "reports",
        relatedId: report.id,
        actionLabel: "عرض الفريق",
        actionHref: `/teams/${report.teamId}`,
        read: false,
        source: "auto",
      });
    }
  }

  // 2) Contract expiring soon
  for (const emp of employees) {
    const days = daysUntil(emp.contractEndDate);
    if (days <= CONTRACT_WARNING_DAYS) {
      notifications.push({
        id: `notif_contract_${emp.id}`,
        title: days < 0 ? "عقد موظف منتهٍ" : "عقد موظف قريب من الانتهاء",
        description:
          days < 0
            ? `عقد ${emp.name} منتهٍ منذ ${Math.abs(days)} يوم.`
            : `عقد ${emp.name} ينتهي خلال ${days} يوم.`,
        priority: priorityFromDays(days, CONTRACT_WARNING_DAYS),
        date: now,
        module: "employees",
        relatedId: emp.id,
        actionLabel: "عرض الموظف",
        actionHref: `/employees/${emp.id}`,
        read: false,
        source: "auto",
      });
    }
  }

  // 3) Iqama expiring soon
  for (const emp of employees) {
    const days = daysUntil(emp.iqamaEndDate);
    if (days <= IQAMA_WARNING_DAYS) {
      notifications.push({
        id: `notif_iqama_${emp.id}`,
        title: days < 0 ? "إقامة موظف منتهية" : "إقامة موظف قريبة من الانتهاء",
        description:
          days < 0
            ? `إقامة ${emp.name} منتهية منذ ${Math.abs(days)} يوم.`
            : `إقامة ${emp.name} تنتهي خلال ${days} يوم.`,
        priority: priorityFromDays(days, IQAMA_WARNING_DAYS),
        date: now,
        module: "employees",
        relatedId: emp.id,
        actionLabel: "عرض الموظف",
        actionHref: `/employees/${emp.id}`,
        read: false,
        source: "auto",
      });
    }
  }

  // 4) Low stock
  for (const product of products) {
    if (product.currentStock <= product.minimumStock) {
      notifications.push({
        id: `notif_stock_${product.id}`,
        title: "المنتج يحتاج إعادة طلب",
        description: `${product.name} — المتبقي ${product.currentStock} ${product.unit}، أقل من أو تساوي الحد الأدنى (${product.minimumStock}).`,
        priority: "follow_up",
        date: now,
        module: "inventory",
        relatedId: product.id,
        actionLabel: "عرض المخزون",
        actionHref: `/inventory`,
        read: false,
        source: "auto",
      });
    }
  }

  // 5) Task due soon / overdue
  for (const task of tasks) {
    if (task.status === "مكتملة") continue;
    const days = daysUntil(task.dueDate);
    if (days < 0) {
      notifications.push({
        id: `notif_task_${task.id}`,
        title: "مهمة متأخرة",
        description: `"${task.title}" تجاوزت تاريخ الاستحقاق.`,
        priority: "urgent",
        date: now,
        module: "tasks",
        relatedId: task.id,
        actionLabel: "عرض المهمة",
        actionHref: `/tasks`,
        read: false,
        source: "auto",
      });
    } else if (days <= TASK_DUE_SOON_DAYS) {
      notifications.push({
        id: `notif_task_soon_${task.id}`,
        title: "مهمة تستحق قريبًا",
        description: `"${task.title}" مستحقة خلال ${days === 0 ? "اليوم" : `${days} يوم`}.`,
        priority: days === 0 ? "urgent" : "upcoming",
        date: now,
        module: "tasks",
        relatedId: task.id,
        actionLabel: "عرض المهمة",
        actionHref: `/tasks`,
        read: false,
        source: "auto",
      });
    }
  }

  // 6) Revenue mismatch (service value vs. collected amount)
  const mismatchByTeam = new Map<string, number>();
  for (const s of services) {
    if (s.collectedAmount < s.finalAmount) {
      mismatchByTeam.set(s.teamId, (mismatchByTeam.get(s.teamId) ?? 0) + (s.finalAmount - s.collectedAmount));
    }
  }
  for (const [teamId, gap] of mismatchByTeam) {
    const team = teams.find((t) => t.id === teamId);
    notifications.push({
      id: `notif_revenue_${teamId}`,
      title: "يوجد فرق يحتاج إلى مراجعة",
      description: `${team?.name ?? "فريق"} لديه فرق قدره ${gap.toLocaleString("ar-SA-u-nu-latn")} ر.س بين قيمة الخدمات والمبالغ المحصلة.`,
      priority: "follow_up",
      date: now,
      module: "revenue",
      relatedId: teamId,
      actionLabel: "عرض الإيرادات",
      actionHref: `/revenue`,
      read: false,
        source: "auto",
    });
  }

  // 7) Fixed-day salary review reminders (demo-only, not a real Mudad/GOSI integration)
  const dayOfMonth = currentDayOfMonth();
  if (dayOfMonth === 20) {
    notifications.push({
      id: "notif_payroll_mudad",
      title: "حان موعد مراجعة رواتب موظفي منصة مدد",
      description: "اليوم 20 من الشهر — راجعي رواتب الموظفين المسجلين على منصة مدد.",
      priority: "follow_up",
      date: now,
      module: "payroll",
      relatedId: null,
      actionLabel: "عرض الموظفين",
      actionHref: "/employees",
      read: false,
        source: "auto",
    });
  }
  if (dayOfMonth === 24) {
    notifications.push({
      id: "notif_payroll_contract",
      title: "حان موعد مراجعة رواتب موظفي العقود",
      description: "اليوم 24 من الشهر — راجعي رواتب الموظفين على نظام العقود المباشرة.",
      priority: "follow_up",
      date: now,
      module: "payroll",
      relatedId: null,
      actionLabel: "عرض الموظفين",
      actionHref: "/employees",
      read: false,
        source: "auto",
    });
  }

  return notifications;
}
