import type { Suggestion } from "@/types/domain";
import { isoDateTime } from "@/utils/date";

export const suggestions: Suggestion[] = [
  {
    id: "sugg_1",
    title: "رسالة تذكير تلقائية للعملاء قبل الموعد بيوم",
    details: "كثير من العملاء ينسون مواعيدهم — رسالة تذكير قبل يوم ممكن تقلل الإلغاءات.",
    notes: "",
    createdBy: "emp_16",
    createdAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)),
  },
  {
    id: "sugg_2",
    title: "قائمة أسئلة شائعة جاهزة لخدمة العملاء",
    details: "تجهيز قائمة بأكثر الأسئلة تكرارًا وأجوبتها الجاهزة يسرّع الرد على العملاء.",
    notes: "فكرة جيدة، بنراجعها الأسبوع الجاي.",
    createdBy: "emp_17",
    createdAt: isoDateTime(new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)),
  },
];
