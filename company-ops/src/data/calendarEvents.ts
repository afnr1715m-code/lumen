import type { CalendarEvent } from "@/types/domain";
import { daysFromToday } from "@/utils/date";

export const calendarEvents: CalendarEvent[] = [
  { id: "cal_1", title: "اجتماع أسبوعي مع المشرفين", date: daysFromToday(3), time: "11:00", type: "meeting", ownerId: "user_manager", reminder: true },
  { id: "cal_2", title: "زيارة عميل — فندق أفياء", date: daysFromToday(7), time: "10:30", type: "client_visit", ownerId: "user_manager", reminder: true },
  { id: "cal_3", title: "دفعة مستحقة — مجمع الواحة السكني", date: daysFromToday(4), time: "00:00", type: "payment", ownerId: "user_manager", reminder: false },
  { id: "cal_4", title: "انتهاء عقد توريد المواد", date: daysFromToday(15), time: "00:00", type: "contract", ownerId: "user_manager", reminder: true },
  { id: "cal_5", title: "موعد صيانة تكييف — برج الرياض التجاري", date: daysFromToday(2), time: "09:00", type: "appointment", ownerId: "emp_sup_4", reminder: true },
  { id: "cal_6", title: "تدريب السلامة — فريق التشغيل الثاني", date: daysFromToday(4), time: "13:00", type: "task", ownerId: "emp_sup_2", reminder: false },
  { id: "cal_7", title: "مراجعة عقد عبدالعزيز الشمري", date: daysFromToday(5), time: "12:00", type: "task", ownerId: "user_manager", reminder: true },
  { id: "cal_8", title: "اجتماع تقييم ربع سنوي", date: daysFromToday(20), time: "10:00", type: "meeting", ownerId: "user_manager", reminder: false },
  { id: "cal_9", title: "زيارة ميدانية — مجمع درة الشرق", date: daysFromToday(-1), time: "15:00", type: "client_visit", ownerId: "user_manager", reminder: false },
  { id: "cal_10", title: "جولة تفقدية شهرية", date: daysFromToday(9), time: "09:30", type: "appointment", ownerId: "user_manager", reminder: false },
];
