import type { CustomerServiceReport } from "@/types/domain";
import { daysFromToday, isoDateTime } from "@/utils/date";

// نورة الدوسري (emp_17) works the مساء (evening) shift — her handover notes
// are what طارق (emp_16, صباح / morning shift, the demo login) sees when he
// opens the Reports page.
export const customerServiceReports: CustomerServiceReport[] = [
  {
    id: "csrep_1",
    employeeId: "emp_17",
    shift: "مساء",
    date: daysFromToday(0),
    contactedCount: 18,
    bookedCount: 6,
    potentialCount: 4,
    notes: "العميل أحمد تواصل معنا ويرغب بالحجز غدًا، يحتاج متابعة وتأكيد الموعد.",
    submittedAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 3)),
  },
  {
    id: "csrep_2",
    employeeId: "emp_17",
    shift: "مساء",
    date: daysFromToday(-1),
    contactedCount: 21,
    bookedCount: 8,
    potentialCount: 3,
    notes: "العميلة سارة سألت عن باقة الأسعار الجديدة، وعدتها بالرد اليوم — تحتاج متابعة.",
    submittedAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 27)),
  },
];
