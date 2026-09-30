import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Field, { Input } from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { CALENDAR_EVENT_TYPE_LABEL } from "@/lib/labels";
import { todayISO } from "@/utils/date";
import type { CalendarEventType } from "@/types/domain";

export default function CalendarEventModal({
  open,
  onClose,
  defaultDate,
}: {
  open: boolean;
  onClose: () => void;
  defaultDate?: string;
}) {
  const addCalendarEvent = useOpsStore((s) => s.addCalendarEvent);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate ?? todayISO());
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState<CalendarEventType>("meeting");
  const [reminder, setReminder] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;
    addCalendarEvent({ title, date, time, type, ownerId: currentUser.id, reminder }, currentUser.id);
    setTitle("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="إضافة موعد">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="عنوان الموعد">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="مثال: اجتماع فريق" />
        </Field>
        <Field label="النوع">
          <Select
            value={type}
            onChange={(v) => setType(v as CalendarEventType)}
            options={Object.entries(CALENDAR_EVENT_TYPE_LABEL).map(([value, label]) => ({ value, label }))}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="التاريخ">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="الوقت">
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={reminder}
            onChange={(e) => setReminder(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-[var(--color-accent)]"
          />
          تفعيل التذكير
        </label>
        <Button type="submit" className="w-full">
          إضافة الموعد
        </Button>
      </form>
    </Modal>
  );
}
