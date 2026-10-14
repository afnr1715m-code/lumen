import type { ManagerReport } from "@/types/domain";
import { daysFromToday, isoDateTime } from "@/utils/date";

// Free-text reviews the manager sends to عبدالرحمن (coordinator demo login).
export const managerReports: ManagerReport[] = [
  {
    id: "mrep_1",
    recipientId: "user_coord_1",
    date: daysFromToday(0),
    development: "أداء الفرق هذا الأسبوع أفضل من الأسبوع الماضي، خصوصًا فريق تشغيل الأثاث 2.",
    ratios: "نسبة إنجاز المهام الموكلة 85%، ونسبة الرضا من ملاحظات العملاء حوالي 90%.",
    notes: "تابع مع فريق تشغيل المباني 1 موضوع التأخر المتكرر هذا الأسبوع.",
    createdAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 5)),
  },
  {
    id: "mrep_2",
    recipientId: "user_coord_1",
    date: daysFromToday(-2),
    development: "تحسن ملحوظ في التزام الموظفين بالزي الرسمي بعد المتابعة الأخيرة.",
    ratios: "نسبة الحضور العام للأسبوع 92%.",
    notes: "ممتاز، استمر على نفس الوتيرة.",
    createdAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 50)),
  },
];
