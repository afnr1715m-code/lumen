import type { ShiftReport } from "@/types/domain";
import { daysFromToday, isoDateTime } from "@/utils/date";

// team_a (سلطان الحربي, the demo supervisor login) is left with no seeded
// shift reports so the live "submit report" flow stays demoable end-to-end.
// These cover the other teams so the manager's "تقارير ميدانية" tab isn't
// empty on first load.
export const shiftReports: ShiftReport[] = [
  {
    id: "shiftrep_1",
    date: daysFromToday(0),
    teamId: "team_b",
    supervisorId: "emp_sup_2",
    employees: [
      { employeeId: "emp_5", attendance: "present", appearanceRating: "ممتاز", appearanceReason: "" },
      { employeeId: "emp_6", attendance: "present", appearanceRating: "جيد", appearanceReason: "" },
      { employeeId: "emp_8", attendance: "absent", appearanceRating: null, appearanceReason: "" },
    ],
    clientsServed: 9,
    totalIncome: 2450,
    paymentMethods: ["cash", "card"],
    paymentAmounts: { cash: 1450, card: 1000, bank_transfer: 0 },
    issues: "",
    notes: "يوم عادي، كل المواعيد تمت بدون تأخير.",
    submittedAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 2)),
  },
  {
    id: "shiftrep_2",
    date: daysFromToday(0),
    teamId: "team_c",
    supervisorId: "emp_sup_3",
    employees: [
      { employeeId: "emp_9", attendance: "present", appearanceRating: "ضعيف", appearanceReason: "وصل بدون الزي الرسمي" },
      { employeeId: "emp_10", attendance: "present", appearanceRating: "جيد", appearanceReason: "" },
      { employeeId: "emp_11", attendance: "present", appearanceRating: "ممتاز", appearanceReason: "" },
    ],
    clientsServed: 6,
    totalIncome: 1680,
    paymentMethods: ["bank_transfer"],
    paymentAmounts: { cash: 0, card: 0, bank_transfer: 1680 },
    issues: "تأخر أحد الموظفين 30 دقيقة بسبب الزحمة.",
    notes: "",
    submittedAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 4)),
  },
  {
    id: "shiftrep_3",
    date: daysFromToday(0),
    teamId: "team_d",
    supervisorId: "emp_sup_4",
    employees: [
      { employeeId: "emp_13", attendance: "present", appearanceRating: "ممتاز", appearanceReason: "" },
      { employeeId: "emp_14", attendance: "present", appearanceRating: "ممتاز", appearanceReason: "" },
    ],
    clientsServed: 11,
    totalIncome: 3120,
    paymentMethods: ["cash", "card", "bank_transfer"],
    paymentAmounts: { cash: 1200, card: 920, bank_transfer: 1000 },
    issues: "",
    notes: "عميل طلب موعد إضافي الأسبوع الجاي — تم تسجيله بالتقويم.",
    submittedAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 1)),
  },
  {
    id: "shiftrep_4",
    date: daysFromToday(-1),
    teamId: "team_b",
    supervisorId: "emp_sup_2",
    employees: [
      { employeeId: "emp_5", attendance: "present", appearanceRating: "جيد", appearanceReason: "" },
      { employeeId: "emp_6", attendance: "present", appearanceRating: "جيد", appearanceReason: "" },
    ],
    clientsServed: 8,
    totalIncome: 2200,
    paymentMethods: ["card"],
    paymentAmounts: { cash: 0, card: 2200, bank_transfer: 0 },
    issues: "",
    notes: "",
    submittedAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 26)),
  },
  {
    id: "shiftrep_5",
    date: daysFromToday(-1),
    teamId: "team_d",
    supervisorId: "emp_sup_4",
    employees: [
      { employeeId: "emp_13", attendance: "present", appearanceRating: "ممتاز", appearanceReason: "" },
      { employeeId: "emp_14", attendance: "absent", appearanceRating: null, appearanceReason: "" },
    ],
    clientsServed: 7,
    totalIncome: 1950,
    paymentMethods: ["cash"],
    paymentAmounts: { cash: 1950, card: 0, bank_transfer: 0 },
    issues: "عطل بسيط بأحد أجهزة الغسيل، تم التبليغ للصيانة.",
    notes: "",
    submittedAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 25)),
  },
];
