import type { Product } from "@/types/domain";

export const products: Product[] = [
  { id: "prod_1", name: "سائل تنظيف متعدد الاستخدامات", unit: "جالون", currentStock: 8, minimumStock: 15, notes: "يُستخدم يوميًا من جميع الفرق" },
  { id: "prod_2", name: "قفازات نظافة (صندوق)", unit: "صندوق", currentStock: 40, minimumStock: 10, notes: "" },
  { id: "prod_3", name: "مناشف ميكروفايبر", unit: "قطعة", currentStock: 25, minimumStock: 20, notes: "تحتاج غسيل دوري بعد كل استخدام" },
  { id: "prod_4", name: "معطر أسطح", unit: "عبوة", currentStock: 3, minimumStock: 10, notes: "الطلب من المورد المعتمد فقط" },
  { id: "prod_5", name: "أكياس نفايات كبيرة", unit: "كرتون", currentStock: 60, minimumStock: 20, notes: "" },
  { id: "prod_6", name: "فلاتر تكييف", unit: "قطعة", currentStock: 12, minimumStock: 8, notes: "خاص بفرق تشغيل المباني" },
];
