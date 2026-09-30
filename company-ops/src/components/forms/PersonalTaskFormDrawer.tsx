import { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Field, { Input, Textarea } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { todayISO } from "@/utils/date";

export default function PersonalTaskFormDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addPersonalTask = useOpsStore((s) => s.addPersonalTask);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;
    addPersonalTask({ employeeId: currentUser.id, title, description, date, time: time || null }, currentUser.id);
    setTitle("");
    setDescription("");
    setTime("");
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose} title="إضافة مهمة شخصية">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="اسم المهمة">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="مثال: متابعة العميل أحمد" />
        </Field>
        <Field label="الوصف / التفاصيل">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="التاريخ">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="الوقت (اختياري)">
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
        </div>
        <Button type="submit" className="w-full">
          إضافة المهمة
        </Button>
      </form>
    </Drawer>
  );
}
