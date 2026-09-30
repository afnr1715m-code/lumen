import { create } from "zustand";
import type {
  AppNotification,
  AttendanceRecord,
  AuditLogEntry,
  CalendarEvent,
  Client,
  Complaint,
  CustomerServiceReport,
  DailyReport,
  Employee,
  PayrollAdjustment,
  PersonalTask,
  Product,
  Service,
  ShiftReport,
  Suggestion,
  SupervisorReport,
  Task,
  TaskPriority,
  TaskStatus,
  Team,
} from "@/types/domain";
import { employees as seedEmployees, teams as seedTeams } from "@/data/roster";
import { tasks as seedTasks } from "@/data/tasks";
import { calendarEvents as seedCalendarEvents } from "@/data/calendarEvents";
import { services as seedServices } from "@/data/services";
import { dailyReports as seedReports } from "@/data/reports";
import { attendanceRecords as seedAttendance } from "@/data/attendance";
import { products as seedProducts } from "@/data/products";
import { clients as seedClients } from "@/data/clients";
import { supervisorReports as seedSupervisorReports } from "@/data/supervisorReports";
import { payrollAdjustments as seedPayrollAdjustments } from "@/data/payroll";
import { personalTasks as seedPersonalTasks } from "@/data/personalTasks";
import { customerServiceReports as seedCustomerServiceReports } from "@/data/customerServiceReports";
import { complaints as seedComplaints } from "@/data/complaints";
import { suggestions as seedSuggestions } from "@/data/suggestions";
import { computeNotifications } from "@/lib/automation";
import { makeId } from "@/utils/id";
import { isoDateTime, todayISO } from "@/utils/date";

interface OpsState {
  employees: Employee[];
  teams: Team[];
  tasks: Task[];
  calendarEvents: CalendarEvent[];
  services: Service[];
  dailyReports: DailyReport[];
  attendanceRecords: AttendanceRecord[];
  products: Product[];
  clients: Client[];
  supervisorReports: SupervisorReport[];
  payrollAdjustments: PayrollAdjustment[];
  shiftReports: ShiftReport[];
  personalTasks: PersonalTask[];
  customerServiceReports: CustomerServiceReport[];
  complaints: Complaint[];
  suggestions: Suggestion[];
  notifications: AppNotification[];
  auditLog: AuditLogEntry[];

  refreshNotifications: () => void;
  addAuditEntry: (actorId: string, action: string) => void;

  addTask: (task: Omit<Task, "id" | "createdAt" | "status">, actorId: string) => void;
  setTaskStatus: (id: string, status: TaskStatus, actorId: string) => void;
  setTaskPriority: (id: string, priority: TaskPriority, actorId: string) => void;

  addCalendarEvent: (event: Omit<CalendarEvent, "id">, actorId: string) => void;

  addEmployee: (employee: Omit<Employee, "id">, actorId: string) => void;
  updateEmployee: (id: string, patch: Omit<Employee, "id">, actorId: string) => void;

  addProduct: (product: Omit<Product, "id">, actorId: string) => void;
  updateProduct: (id: string, patch: Omit<Product, "id">, actorId: string) => void;
  deleteProduct: (id: string, actorId: string) => void;

  updatePayrollAdjustment: (employeeId: string, patch: Omit<PayrollAdjustment, "employeeId">, actorId: string) => void;

  setAttendanceStatus: (employeeId: string, date: string, status: AttendanceRecord["status"], actorId: string) => void;

  createService: (service: Omit<Service, "id" | "finalAmount">, actorId: string) => void;

  submitDailyReport: (report: Omit<DailyReport, "id" | "status" | "submittedAt">, actorId: string) => void;

  addSupervisorReport: (report: Omit<SupervisorReport, "id" | "status">, actorId: string) => void;

  submitShiftReport: (report: Omit<ShiftReport, "id" | "submittedAt">, actorId: string) => void;

  addPersonalTask: (task: Omit<PersonalTask, "id" | "createdAt" | "status">, actorId: string) => void;
  updatePersonalTaskStatus: (id: string, status: PersonalTask["status"], actorId: string) => void;

  submitCustomerServiceReport: (report: Omit<CustomerServiceReport, "id" | "submittedAt">, actorId: string) => void;

  addComplaint: (complaint: Omit<Complaint, "id" | "createdAt" | "status">, actorId: string) => void;
  updateComplaintStatus: (id: string, status: Complaint["status"], actorId: string) => void;

  addSuggestion: (suggestion: Omit<Suggestion, "id" | "createdAt">, actorId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addManualNotification: (
    notification: Omit<AppNotification, "id" | "date" | "read" | "source">,
    actorId: string
  ) => void;
}

export const useOpsStore = create<OpsState>()((set, get) => ({
  employees: seedEmployees,
  teams: seedTeams,
  tasks: seedTasks,
  calendarEvents: seedCalendarEvents,
  services: seedServices,
  dailyReports: seedReports,
  attendanceRecords: seedAttendance,
  products: seedProducts,
  clients: seedClients,
  supervisorReports: seedSupervisorReports,
  payrollAdjustments: seedPayrollAdjustments,
  shiftReports: [],
  personalTasks: seedPersonalTasks,
  customerServiceReports: seedCustomerServiceReports,
  complaints: seedComplaints,
  suggestions: seedSuggestions,
  notifications: computeNotifications({
    employees: seedEmployees,
    teams: seedTeams,
    tasks: seedTasks,
    services: seedServices,
    dailyReports: seedReports,
    products: seedProducts,
  }),
  auditLog: [
    { id: makeId("audit"), actorId: "emp_sup_1", action: "سجّل حضور فريق التشغيل الأول", at: isoDateTime(new Date()) },
    { id: makeId("audit"), actorId: "emp_sup_2", action: "رفع تقرير نهاية اليوم", at: isoDateTime(new Date()) },
  ],

  refreshNotifications: () => {
    const state = get();
    const fresh = computeNotifications({
      employees: state.employees,
      teams: state.teams,
      tasks: state.tasks,
      services: state.services,
      dailyReports: state.dailyReports,
      products: state.products,
    });
    const readIds = new Set(state.notifications.filter((n) => n.read).map((n) => n.id));
    const manual = state.notifications.filter((n) => n.source === "manual");
    set({ notifications: [...manual, ...fresh.map((n) => (readIds.has(n.id) ? { ...n, read: true } : n))] });
  },

  addAuditEntry: (actorId, action) => {
    set((state) => ({
      auditLog: [{ id: makeId("audit"), actorId, action, at: isoDateTime(new Date()) }, ...state.auditLog],
    }));
  },

  addTask: (task, actorId) => {
    const newTask: Task = { ...task, id: makeId("task"), createdAt: isoDateTime(new Date()), status: "لم تبدأ" };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
    get().addAuditEntry(actorId, `أضاف مهمة جديدة: ${task.title}`);
    get().refreshNotifications();
  },

  setTaskStatus: (id, status, actorId) => {
    set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }));
    get().addAuditEntry(actorId, `حدّث حالة مهمة إلى "${status}"`);
    get().refreshNotifications();
  },

  setTaskPriority: (id, priority, actorId) => {
    set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, priority } : t)) }));
    get().addAuditEntry(actorId, `حدّث أولوية مهمة إلى "${priority}"`);
    get().refreshNotifications();
  },

  addCalendarEvent: (event, actorId) => {
    const newEvent: CalendarEvent = { ...event, id: makeId("cal") };
    set((state) => ({ calendarEvents: [...state.calendarEvents, newEvent] }));
    get().addAuditEntry(actorId, `أضاف موعدًا: ${event.title}`);
  },

  addEmployee: (employee, actorId) => {
    const newEmployee: Employee = { ...employee, id: makeId("emp") };
    set((state) => ({ employees: [...state.employees, newEmployee] }));
    get().addAuditEntry(actorId, `أضاف موظفًا جديدًا: ${employee.name}`);
    get().refreshNotifications();
  },

  updateEmployee: (id, patch, actorId) => {
    set((state) => ({ employees: state.employees.map((e) => (e.id === id ? { ...patch, id } : e)) }));
    get().addAuditEntry(actorId, `عدّل بيانات الموظف: ${patch.name}`);
    get().refreshNotifications();
  },

  addProduct: (product, actorId) => {
    const newProduct: Product = { ...product, id: makeId("prod") };
    set((state) => ({ products: [...state.products, newProduct] }));
    get().addAuditEntry(actorId, `أضاف صنفًا للمخزون: ${product.name}`);
    get().refreshNotifications();
  },

  updateProduct: (id, patch, actorId) => {
    set((state) => ({ products: state.products.map((p) => (p.id === id ? { ...patch, id } : p)) }));
    get().addAuditEntry(actorId, `عدّل صنف المخزون: ${patch.name}`);
    get().refreshNotifications();
  },

  deleteProduct: (id, actorId) => {
    const product = get().products.find((p) => p.id === id);
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
    get().addAuditEntry(actorId, `حذف صنف المخزون: ${product?.name ?? id}`);
    get().refreshNotifications();
  },

  updatePayrollAdjustment: (employeeId, patch, actorId) => {
    set((state) => {
      const existingIndex = state.payrollAdjustments.findIndex((p) => p.employeeId === employeeId);
      const next = [...state.payrollAdjustments];
      if (existingIndex >= 0) next[existingIndex] = { ...patch, employeeId };
      else next.push({ ...patch, employeeId });
      return { payrollAdjustments: next };
    });
    const employee = get().employees.find((e) => e.id === employeeId);
    get().addAuditEntry(actorId, `عدّل بيانات راتب الموظف: ${employee?.name ?? employeeId}`);
  },

  setAttendanceStatus: (employeeId, date, status, actorId) => {
    set((state) => {
      const existingIndex = state.attendanceRecords.findIndex((a) => a.employeeId === employeeId && a.date === date);
      const record: AttendanceRecord = {
        id: existingIndex >= 0 ? state.attendanceRecords[existingIndex].id : makeId("att"),
        employeeId,
        date,
        status,
        checkIn: status === "absent" || status === "leave" ? null : "08:00",
        checkOut: status === "absent" || status === "leave" ? null : "16:00",
      };
      const next = [...state.attendanceRecords];
      if (existingIndex >= 0) next[existingIndex] = record;
      else next.push(record);
      return { attendanceRecords: next };
    });
    get().addAuditEntry(actorId, `سجّل حضور موظف بتاريخ ${date}`);
  },

  createService: (service, actorId) => {
    const finalAmount = service.value - service.discount;
    const newService: Service = { ...service, id: makeId("svc"), finalAmount };
    set((state) => ({ services: [newService, ...state.services] }));
    get().addAuditEntry(actorId, `سجّل خدمة جديدة للعميل ${service.clientName}`);
    get().refreshNotifications();
  },

  submitDailyReport: (report, actorId) => {
    set((state) => {
      const existingIndex = state.dailyReports.findIndex(
        (r) => r.teamId === report.teamId && r.date === report.date && r.kind === report.kind
      );
      const newReport: DailyReport = {
        ...report,
        id: existingIndex >= 0 ? state.dailyReports[existingIndex].id : makeId("rep"),
        status: "submitted",
        submittedAt: isoDateTime(new Date()),
      };
      const next = [...state.dailyReports];
      if (existingIndex >= 0) next[existingIndex] = newReport;
      else next.push(newReport);
      return { dailyReports: next };
    });
    get().addAuditEntry(
      actorId,
      `رفع تقرير ${report.kind === "start_of_day" ? "بداية" : "نهاية"} اليوم لتاريخ ${report.date}`
    );
    get().refreshNotifications();
  },

  addSupervisorReport: (report, actorId) => {
    const newReport: SupervisorReport = { ...report, id: makeId("srep"), status: "جديد" };
    set((state) => ({ supervisorReports: [newReport, ...state.supervisorReports] }));
    get().addAuditEntry(actorId, `أضاف تقريرًا ميدانيًا: ${report.summary}`);
  },

  submitShiftReport: (report, actorId) => {
    const newReport: ShiftReport = { ...report, id: makeId("shift"), submittedAt: isoDateTime(new Date()) };
    set((state) => ({ shiftReports: [newReport, ...state.shiftReports] }));
    get().addAuditEntry(actorId, `أرسل تقرير الشفت لتاريخ ${report.date}`);
  },

  addPersonalTask: (task, actorId) => {
    const newTask: PersonalTask = { ...task, id: makeId("ptask"), status: "لم تبدأ", createdAt: isoDateTime(new Date()) };
    set((state) => ({ personalTasks: [newTask, ...state.personalTasks] }));
    get().addAuditEntry(actorId, `أضاف مهمة شخصية: ${task.title}`);
  },

  updatePersonalTaskStatus: (id, status, actorId) => {
    set((state) => ({ personalTasks: state.personalTasks.map((t) => (t.id === id ? { ...t, status } : t)) }));
    get().addAuditEntry(actorId, `حدّث حالة مهمة شخصية إلى "${status}"`);
  },

  submitCustomerServiceReport: (report, actorId) => {
    const newReport: CustomerServiceReport = { ...report, id: makeId("csrep"), submittedAt: isoDateTime(new Date()) };
    set((state) => ({ customerServiceReports: [newReport, ...state.customerServiceReports] }));
    get().addAuditEntry(actorId, `أرسل تقرير شفت خدمة العملاء لتاريخ ${report.date}`);
  },

  addComplaint: (complaint, actorId) => {
    const newComplaint: Complaint = { ...complaint, id: makeId("comp"), status: "جديدة", createdAt: isoDateTime(new Date()) };
    set((state) => ({ complaints: [newComplaint, ...state.complaints] }));
    get().addAuditEntry(actorId, `سجّل شكوى جديدة: ${complaint.clientName}`);
  },

  updateComplaintStatus: (id, status, actorId) => {
    set((state) => ({ complaints: state.complaints.map((c) => (c.id === id ? { ...c, status } : c)) }));
    get().addAuditEntry(actorId, `حدّث حالة شكوى إلى "${status}"`);
  },

  addSuggestion: (suggestion, actorId) => {
    const newSuggestion: Suggestion = { ...suggestion, id: makeId("sugg"), createdAt: isoDateTime(new Date()) };
    set((state) => ({ suggestions: [newSuggestion, ...state.suggestions] }));
    get().addAuditEntry(actorId, `أضاف اقتراحًا: ${suggestion.title}`);
  },

  markNotificationRead: (id) => {
    set((state) => ({ notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) }));
  },

  addManualNotification: (notification, actorId) => {
    const newNotification: AppNotification = {
      ...notification,
      id: makeId("notif_manual"),
      date: isoDateTime(new Date()),
      read: false,
      source: "manual",
    };
    set((state) => ({ notifications: [newNotification, ...state.notifications] }));
    get().addAuditEntry(actorId, `أضاف تنبيهًا يدويًا: ${notification.title}`);
  },
}));

export function todaysDate(): string {
  return todayISO();
}
