import type { PersonalTask } from "@/types/domain";
import { daysFromToday, isoDateTime } from "@/utils/date";

// Self-added personal reminders for طارق المالكي (customer service demo login)
// and سلطان الحربي (supervisor demo login) — distinct from manager-assigned tasks.
export const personalTasks: PersonalTask[] = [
  {
    id: "ptask_sup_1",
    employeeId: "emp_sup_1",
    title: "التأكد من صيانة معدات الفريق قبل الشفت",
    description: "فحص سريع لمعدات التنظيف قبل بداية الشفت.",
    date: daysFromToday(0),
    time: "07:30",
    status: "قيد التنفيذ",
    createdAt: isoDateTime(new Date()),
  },
  {
    id: "ptask_sup_2",
    employeeId: "emp_sup_1",
    title: "تذكير بطلب كمية إضافية من سائل التنظيف",
    description: "التنسيق مع المخزون قبل نهاية الأسبوع.",
    date: daysFromToday(1),
    time: null,
    status: "لم تبدأ",
    createdAt: isoDateTime(new Date()),
  },
  {
    id: "ptask_1",
    employeeId: "emp_16",
    title: "متابعة العميل أحمد لتأكيد الحجز",
    description: "الاتصال بالعميل أحمد للتأكد من موعد الحجز غدًا.",
    date: daysFromToday(0),
    time: "15:00",
    status: "قيد التنفيذ",
    createdAt: isoDateTime(new Date()),
  },
  {
    id: "ptask_2",
    employeeId: "emp_16",
    title: "التواصل مع العميلة سارة",
    description: "الرد على استفسارها بخصوص الأسعار.",
    date: daysFromToday(1),
    time: "11:00",
    status: "لم تبدأ",
    createdAt: isoDateTime(new Date()),
  },
  {
    id: "ptask_3",
    employeeId: "emp_16",
    title: "متابعة العملاء المحتملين",
    description: "مراجعة قائمة العملاء المحتملين من الأسبوع الماضي.",
    date: daysFromToday(2),
    time: null,
    status: "لم تبدأ",
    createdAt: isoDateTime(new Date()),
  },
];
