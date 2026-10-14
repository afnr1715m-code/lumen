export type Role = "manager" | "supervisor" | "customer_service" | "coordinator";

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarInitials: string;
  teamId: string | null;
  title: string;
}

export type EmployeeStatus = "active" | "on_leave" | "inactive";
export type ContractType = "temporary" | "permanent" | "freelance";

export interface Employee {
  id: string;
  name: string;
  title: string;
  teamId: string;
  supervisorId: string;
  status: EmployeeStatus;
  phone: string;
  email: string;
  nationalId: string;
  nationality: string;
  birthDate: string; // ISO date
  hireDate: string; // ISO date
  contractType: ContractType;
  contractEndDate: string; // ISO date
  iqamaEndDate: string; // ISO date
  salary: number;
  salaryPlatform: "mudad" | "contract";
  notes: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "leave" | "early_leave";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // ISO date
  status: AttendanceStatus;
  checkIn: string | null; // HH:mm
  checkOut: string | null; // HH:mm
}

export type TeamStatus = "active" | "stopped" | "awaiting_report";

export interface Team {
  id: string;
  name: string;
  supervisorId: string;
  status: TeamStatus;
}

export type TaskPriority = "medium" | "high" | "urgent";
export type TaskStatus = "لم تبدأ" | "قيد التنفيذ" | "مكتملة";
export type TaskRecurrence = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assignedBy: string; // userId of whoever created/assigned it (manager or coordinator)
  priority: TaskPriority;
  dueDate: string; // ISO date
  dueTime: string; // HH:mm
  reminderAt: string | null; // ISO datetime
  recurrence: TaskRecurrence;
  notes: string;
  status: TaskStatus;
  createdAt: string; // ISO datetime
}

export type CalendarEventType = "task" | "meeting" | "appointment" | "client_visit" | "payment" | "contract";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time: string; // HH:mm
  type: CalendarEventType;
  ownerId: string;
  reminder: boolean;
}

export type PaymentMethod = "cash" | "card" | "bank_transfer";
export type PaymentStatus = "paid" | "pending" | "partial";

export interface Service {
  id: string;
  clientName: string;
  serviceName: string;
  teamId: string;
  supervisorId: string;
  employeeId: string;
  date: string; // ISO date
  value: number;
  discount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  collectedAmount: number;
}

export type ReportStatus = "submitted" | "pending" | "overdue";

export interface DailyReport {
  id: string;
  teamId: string;
  date: string; // ISO date
  kind: "start_of_day" | "end_of_day";
  status: ReportStatus;
  submittedAt: string | null; // ISO datetime
  // start of day
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
  scheduledTasks?: string;
  neededEquipment?: string;
  lowStockNotes?: string;
  // end of day
  servicesCount?: number;
  clientsCount?: number;
  totalRevenue?: number;
  cash?: number;
  card?: number;
  bankTransfer?: number;
  productsUsed?: string;
  issues?: string;
  complaints?: string;
  achievements?: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  // The fixed quantity the manager sets when stocking/restocking the item —
  // only changes when the manager edits it, never from logged usage.
  quantity: number;
  // The live remaining amount — starts equal to quantity and only decreases
  // as supervisors log usage from their shift reports.
  currentStock: number;
  minimumStock: number;
  notes: string;
}

export type NotificationPriority = "urgent" | "follow_up" | "upcoming" | "done";
export type NotificationModule =
  | "tasks"
  | "employees"
  | "reports"
  | "inventory"
  | "revenue"
  | "calendar"
  | "payroll";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  priority: NotificationPriority;
  date: string; // ISO datetime
  module: NotificationModule;
  relatedId: string | null;
  actionLabel: string;
  actionHref: string | null;
  read: boolean;
  source: "auto" | "manual";
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  at: string; // ISO datetime
}

export interface Client {
  id: string;
  name: string;
  phone: string;
}

export type SupervisorReportType = "يومي" | "حادثة" | "صيانة" | "جودة" | "أخرى";
export type SupervisorReportStatus = "جديد" | "قيد المراجعة" | "معتمد" | "مرفوض";

export interface SupervisorReport {
  id: string;
  summary: string;
  date: string; // ISO date
  teamId: string;
  supervisorId: string;
  reportType: SupervisorReportType;
  status: SupervisorReportStatus;
  details: string;
  notes: string;
}

export interface PayrollAdjustment {
  employeeId: string;
  advances: number; // السلف
  deductions: number; // الخصم
  mudadFee: number; // مدد
  absenceDeduction: number; // الغياب
  violations: number; // المخالفات
  notes: string;
}

export type AppearanceRating = "ممتاز" | "جيد" | "ضعيف";

// Per-employee attendance + appearance, captured as part of the supervisor's
// end-of-shift report and submitted to the manager together with it.
export interface ShiftEmployeeEntry {
  employeeId: string;
  attendance: "present" | "absent";
  appearanceRating: AppearanceRating | null;
  appearanceReason: string;
}

// A field supervisor's end-of-shift submission: who was on shift and their
// attendance/appearance, clients served, income, and which payment methods
// were used (any combination) with how much was collected through each one,
// plus free-text issues/notes.
export interface ShiftReport {
  id: string;
  date: string; // ISO date
  teamId: string;
  supervisorId: string;
  employees: ShiftEmployeeEntry[];
  clientsServed: number;
  totalIncome: number;
  paymentMethods: PaymentMethod[];
  paymentAmounts: Record<PaymentMethod, number>;
  issues: string;
  notes: string;
  submittedAt: string; // ISO datetime
}

// A customer-service employee's own personal reminder/follow-up list —
// distinct from Task (which is assigned by the manager). Never shown mixed
// with manager-assigned tasks in the UI or mock data.
export type PersonalTaskStatus = "لم تبدأ" | "قيد التنفيذ" | "مكتملة";

export interface PersonalTask {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  date: string; // ISO date
  time: string | null; // HH:mm
  status: PersonalTaskStatus;
  createdAt: string; // ISO datetime
}

export type ShiftName = "صباح" | "مساء";

// A customer-service shift report. Its `notes` field doubles as the
// hand-over message the next shift's employee sees when they log in.
export interface CustomerServiceReport {
  id: string;
  employeeId: string;
  shift: ShiftName;
  date: string; // ISO date
  contactedCount: number;
  bookedCount: number;
  potentialCount: number;
  notes: string;
  submittedAt: string; // ISO datetime
}

export type ComplaintStatus = "جديدة" | "قيد المعالجة" | "تم الحل";

export interface Complaint {
  id: string;
  clientName: string;
  phone: string;
  complaintType: string;
  details: string;
  status: ComplaintStatus;
  notes: string;
  createdBy: string;
  createdAt: string; // ISO datetime
}

export interface Suggestion {
  id: string;
  title: string;
  details: string;
  notes: string;
  createdBy: string;
  createdAt: string; // ISO datetime
}

// A free-text review the manager writes and sends to a coordinator
// ("المسؤول المباشر") — the direction is the reverse of other reports in
// this system (manager → coordinator, not employee → manager).
export interface ManagerReport {
  id: string;
  recipientId: string;
  date: string; // ISO date — the day this report is linked to on the calendar
  development: string;
  ratios: string;
  notes: string;
  createdAt: string; // ISO datetime
}
