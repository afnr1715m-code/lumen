import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Field, { Input, Textarea } from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { SUPERVISOR_REPORT_TYPE_LABEL } from "@/lib/labels";
import { todayISO } from "@/utils/date";
import type { SupervisorReportType } from "@/types/domain";

export default function SupervisorReportFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addSupervisorReport = useOpsStore((s) => s.addSupervisorReport);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [summary, setSummary] = useState("");
  const [date, setDate] = useState(todayISO());
  const [reportType, setReportType] = useState<SupervisorReportType>("يومي");
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!summary.trim() || !currentUser) return;
    addSupervisorReport(
      {
        summary,
        date,
        teamId: currentUser.teamId ?? "",
        supervisorId: currentUser.id,
        reportType,
        details,
        notes,
      },
      currentUser.id
    );
    setSummary("");
    setDetails("");
    setNotes("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="إضافة تقرير ميداني">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="ملخص التقرير">
          <Input value={summary} onChange={(e) => setSummary(e.target.value)} required placeholder="مثال: تلف بسيط أثناء التشغيل" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="نوع التقرير">
            <Select
              value={reportType}
              onChange={(v) => setReportType(v as SupervisorReportType)}
              options={Object.entries(SUPERVISOR_REPORT_TYPE_LABEL).map(([value, label]) => ({ value, label }))}
            />
          </Field>
          <Field label="التاريخ">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
        </div>
        <Field label="التفاصيل">
          <Textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} />
        </Field>
        <Field label="ملاحظات">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full">
          إرسال التقرير
        </Button>
      </form>
    </Modal>
  );
}
