import type { Complaint } from "@/types/domain";
import { isoDateTime } from "@/utils/date";

export const complaints: Complaint[] = [
  {
    id: "comp_1",
    clientName: "خالد الشمري",
    phone: "0501112233",
    complaintType: "تأخر بالموعد",
    details: "الفريق وصل متأخر 40 دقيقة عن الموعد المحدد بدون إشعار مسبق.",
    status: "قيد المعالجة",
    notes: "تم الاعتذار للعميل وتقديم خصم على الخدمة القادمة.",
    createdBy: "emp_16",
    createdAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 20)),
  },
  {
    id: "comp_2",
    clientName: "منى العتيبي",
    phone: "0559998877",
    complaintType: "جودة الخدمة",
    details: "العميلة غير راضية عن مستوى التنظيف في آخر زيارة.",
    status: "جديدة",
    notes: "",
    createdBy: "emp_17",
    createdAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 5)),
  },
  {
    id: "comp_3",
    clientName: "فهد الدوسري",
    phone: "0533221100",
    complaintType: "فوترة",
    details: "خصم مبلغ إضافي عن غير قصد في الفاتورة الأخيرة.",
    status: "تم الحل",
    notes: "تم التصحيح واسترجاع المبلغ الزائد للعميل.",
    createdBy: "emp_16",
    createdAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)),
  },
];
