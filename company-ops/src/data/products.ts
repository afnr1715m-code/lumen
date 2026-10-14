import type { Product } from "@/types/domain";

export const products: Product[] = [
  {
    id: "prod_1",
    name: "سائل تنظيف متعدد الاستخدامات",
    unit: "جالون",
    quantity: 20,
    currentStock: 8,
    minimumStock: 15,
    notes: "يُستخدم يوميًا من جميع الفرق",
  },
  { id: "prod_2", name: "قفازات نظافة (صندوق)", unit: "صندوق", quantity: 40, currentStock: 40, minimumStock: 10, notes: "" },
  {
    id: "prod_3",
    name: "مناشف ميكروفايبر",
    unit: "قطعة",
    quantity: 30,
    currentStock: 25,
    minimumStock: 20,
    notes: "تحتاج غسيل دوري بعد كل استخدام",
  },
  {
    id: "prod_4",
    name: "معطر أسطح",
    unit: "عبوة",
    quantity: 10,
    currentStock: 3,
    minimumStock: 10,
    notes: "الطلب من المورد المعتمد فقط",
  },
  { id: "prod_5", name: "أكياس نفايات كبيرة", unit: "كرتون", quantity: 60, currentStock: 60, minimumStock: 20, notes: "" },
  {
    id: "prod_6",
    name: "فلاتر تكييف",
    unit: "قطعة",
    quantity: 15,
    currentStock: 12,
    minimumStock: 8,
    notes: "خاص بفرق تشغيل المباني",
  },
];
