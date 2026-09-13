"use client";

import { useTransition } from "react";
import { updateInquiryStatusAction } from "../actions";

const STATUS_OPTIONS = [
  { value: "new", label: "جديد" },
  { value: "reviewing", label: "قيد المراجعة" },
  { value: "proposal_sent", label: "أُرسل مقترح" },
  { value: "won", label: "تم التعاقد" },
  { value: "lost", label: "لم يكتمل" },
];

export default function StatusSelect({ inquiryId, status }: { inquiryId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const nextStatus = event.target.value;
        startTransition(() => {
          updateInquiryStatusAction(inquiryId, nextStatus);
        });
      }}
      className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-60"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
