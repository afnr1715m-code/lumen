import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Field, { Input, Textarea } from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { NOTIFICATION_PRIORITY_LABEL } from "@/lib/labels";
import type { NotificationPriority } from "@/types/domain";

export default function ManualNotificationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addManualNotification = useOpsStore((s) => s.addManualNotification);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<NotificationPriority>("follow_up");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;
    addManualNotification(
      { title, description, priority, module: "tasks", relatedId: null, actionLabel: "عرض", actionHref: null },
      currentUser.id
    );
    setTitle("");
    setDescription("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="إضافة تنبيه">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="عنوان التنبيه">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <Field label="التفاصيل">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="الأولوية">
          <Select
            value={priority}
            onChange={(v) => setPriority(v as NotificationPriority)}
            options={Object.entries(NOTIFICATION_PRIORITY_LABEL).map(([value, label]) => ({ value, label }))}
          />
        </Field>
        <Button type="submit" className="w-full">
          إضافة التنبيه
        </Button>
      </form>
    </Modal>
  );
}
