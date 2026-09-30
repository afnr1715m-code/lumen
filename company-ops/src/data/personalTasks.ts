import type { PersonalTask } from "@/types/domain";
import { daysFromToday, isoDateTime } from "@/utils/date";

// Self-added personal reminders for طارق المالكي (customer service demo login).
export const personalTasks: PersonalTask[] = [
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
