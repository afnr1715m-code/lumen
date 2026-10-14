import type {
  AppearanceRating,
  AttendanceStatus,
  CalendarEventType,
  ComplaintStatus,
  ContractType,
  EmployeeStatus,
  NotificationPriority,
  PaymentMethod,
  PaymentStatus,
  PersonalTaskStatus,
  ReportStatus,
  Role,
  SupervisorReportStatus,
  SupervisorReportType,
  TaskPriority,
  TaskRecurrence,
  TaskStatus,
  TeamStatus,
} from "@/types/domain";

export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export const ROLE_LABEL: Record<Role, string> = {
  manager: "مدير",
  supervisor: "مشرف",
  customer_service: "موظف خدمة عملاء",
  coordinator: "مسؤول مباشر",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  medium: "متوسطة",
  high: "مطلوبة",
  urgent: "عاجلة",
};
export const TASK_PRIORITY_TONE: Record<TaskPriority, Tone> = {
  medium: "info",
  high: "warning",
  urgent: "danger",
};

// Identity map (label === value) kept so existing `Object.entries(TASK_STATUS_LABEL)`
// call sites that build <select> options keep working unchanged.
export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  "لم تبدأ": "لم تبدأ",
  "قيد التنفيذ": "قيد التنفيذ",
  "مكتملة": "مكتملة",
};
export const TASK_STATUS_TONE: Record<TaskStatus, Tone> = {
  "لم تبدأ": "neutral",
  "قيد التنفيذ": "info",
  "مكتملة": "success",
};

export const TASK_RECURRENCE_LABEL: Record<TaskRecurrence, string> = {
  none: "لا يوجد",
  daily: "يومي",
  weekly: "أسبوعي",
  monthly: "شهري",
  yearly: "سنوي",
};

export const EMPLOYEE_STATUS_LABEL: Record<EmployeeStatus, string> = {
  active: "نشط",
  on_leave: "إجازة",
  inactive: "غير نشط",
};
export const EMPLOYEE_STATUS_TONE: Record<EmployeeStatus, Tone> = {
  active: "success",
  on_leave: "warning",
  inactive: "neutral",
};

export const ATTENDANCE_STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "حاضر",
  absent: "غائب",
  late: "متأخر",
  leave: "إجازة",
  early_leave: "خروج مبكر",
};
export const ATTENDANCE_STATUS_TONE: Record<AttendanceStatus, Tone> = {
  present: "success",
  absent: "danger",
  late: "warning",
  leave: "info",
  early_leave: "warning",
};

export const TEAM_STATUS_LABEL: Record<TeamStatus, string> = {
  active: "نشط",
  stopped: "متوقف",
  awaiting_report: "بانتظار تقرير",
};
export const TEAM_STATUS_TONE: Record<TeamStatus, Tone> = {
  active: "success",
  stopped: "danger",
  awaiting_report: "warning",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: "نقدًا",
  card: "شبكة",
  bank_transfer: "تحويل بنكي",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: "مدفوع",
  pending: "معلّق",
  partial: "جزئي",
};
export const PAYMENT_STATUS_TONE: Record<PaymentStatus, Tone> = {
  paid: "success",
  pending: "warning",
  partial: "danger",
};

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  submitted: "مرفوع",
  pending: "بانتظار الرفع",
  overdue: "متأخر",
};
export const REPORT_STATUS_TONE: Record<ReportStatus, Tone> = {
  submitted: "success",
  pending: "warning",
  overdue: "danger",
};

export const NOTIFICATION_PRIORITY_LABEL: Record<NotificationPriority, string> = {
  urgent: "عاجل",
  follow_up: "يحتاج متابعة",
  upcoming: "قادم",
  done: "مكتمل",
};
export const NOTIFICATION_PRIORITY_TONE: Record<NotificationPriority, Tone> = {
  urgent: "danger",
  follow_up: "warning",
  upcoming: "info",
  done: "success",
};

export const CALENDAR_EVENT_TYPE_LABEL: Record<CalendarEventType, string> = {
  task: "مهمة",
  meeting: "اجتماع",
  appointment: "موعد",
  client_visit: "زيارة عميل",
  payment: "دفعة",
  contract: "عقد",
};
export const CALENDAR_EVENT_TYPE_TONE: Record<CalendarEventType, Tone> = {
  task: "info",
  meeting: "neutral",
  appointment: "info",
  client_visit: "success",
  payment: "warning",
  contract: "danger",
};

export const CONTRACT_TYPE_LABEL: Record<ContractType, string> = {
  temporary: "مؤقت",
  permanent: "دائم",
  freelance: "حر",
};

export const SUPERVISOR_REPORT_TYPE_LABEL: Record<SupervisorReportType, string> = {
  "يومي": "يومي",
  "حادثة": "حادثة",
  "صيانة": "صيانة",
  "جودة": "جودة",
  "أخرى": "أخرى",
};
export const SUPERVISOR_REPORT_TYPE_TONE: Record<SupervisorReportType, Tone> = {
  "يومي": "info",
  "حادثة": "danger",
  "صيانة": "warning",
  "جودة": "success",
  "أخرى": "neutral",
};

export const SUPERVISOR_REPORT_STATUS_TONE: Record<SupervisorReportStatus, Tone> = {
  "جديد": "info",
  "قيد المراجعة": "warning",
  "معتمد": "success",
  "مرفوض": "danger",
};

export const APPEARANCE_RATING_TONE: Record<AppearanceRating, Tone> = {
  "ممتاز": "success",
  "جيد": "info",
  "ضعيف": "danger",
};

export function stockStatusTone(currentStock: number, minimumStock: number): Tone {
  return currentStock <= minimumStock ? "danger" : "success";
}
export function stockStatusLabel(currentStock: number, minimumStock: number): string {
  return currentStock <= minimumStock ? "منخفض" : "طبيعي";
}

export const PERSONAL_TASK_STATUS_TONE: Record<PersonalTaskStatus, Tone> = {
  "لم تبدأ": "neutral",
  "قيد التنفيذ": "info",
  "مكتملة": "success",
};

export const COMPLAINT_STATUS_TONE: Record<ComplaintStatus, Tone> = {
  "جديدة": "info",
  "قيد المعالجة": "warning",
  "تم الحل": "success",
};
