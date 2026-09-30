import { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Field, { Input, Textarea } from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { employees, users } from "@/data/roster";
import { TASK_PRIORITY_LABEL, TASK_RECURRENCE_LABEL } from "@/lib/labels";
import { todayISO } from "@/utils/date";
import type { TaskPriority, TaskRecurrence } from "@/types/domain";

const ASSIGNEES = [...users, ...employees.filter((e) => !users.some((u) => u.id === e.id))];

export default function TaskFormDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addTask = useOpsStore((s) => s.addTask);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState(currentUser?.id ?? ASSIGNEES[0]?.id ?? "");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState(todayISO());
  const [dueTime, setDueTime] = useState("12:00");
  const [recurrence, setRecurrence] = useState<TaskRecurrence>("none");
  const [notes, setNotes] = useState("");

  function reset() {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate(todayISO());
    setDueTime("12:00");
    setRecurrence("none");
    setNotes("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;
    addTask(
      { title, description, assigneeId, priority, dueDate, dueTime, reminderAt: null, recurrence, notes },
      currentUser.id
    );
    reset();
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose} title="إضافة مهمة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="اسم المهمة">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="مثال: متابعة تجديد عقد" />
        </Field>
        <Field label="الوصف">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="تفاصيل إضافية..." />
        </Field>
        <Field label="المسؤول">
          <Select
            value={assigneeId}
            onChange={setAssigneeId}
            options={ASSIGNEES.map((a) => ({ value: a.id, label: a.name }))}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="الأولوية">
            <Select
              value={priority}
              onChange={(v) => setPriority(v as TaskPriority)}
              options={Object.entries(TASK_PRIORITY_LABEL).map(([value, label]) => ({ value, label }))}
            />
          </Field>
          <Field label="التكرار">
            <Select
              value={recurrence}
              onChange={(v) => setRecurrence(v as TaskRecurrence)}
              options={Object.entries(TASK_RECURRENCE_LABEL).map(([value, label]) => ({ value, label }))}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="تاريخ الاستحقاق">
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </Field>
          <Field label="الوقت">
            <Input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} required />
          </Field>
        </div>
        <Field label="ملاحظات">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full">
          إضافة المهمة
        </Button>
      </form>
    </Drawer>
  );
}
