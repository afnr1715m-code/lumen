import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Field, { Input, Textarea } from "@/components/ui/Field";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { formatArabicDateTime } from "@/utils/date";
import { employees } from "@/data/roster";

export default function CustomerServiceSuggestionsPage() {
  const suggestions = useOpsStore((s) => s.suggestions);
  const addSuggestion = useOpsStore((s) => s.addSuggestion);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;
    addSuggestion({ title, details, notes: "", createdBy: currentUser.id }, currentUser.id);
    setTitle("");
    setDetails("");
  }

  function authorName(id: string) {
    return employees.find((e) => e.id === id)?.name ?? "—";
  }

  const sorted = [...suggestions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <AppShell title="الاقتراحات">
      <Card title="إضافة اقتراح" className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="عنوان الاقتراح">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Field>
          <Field label="تفاصيل الاقتراح">
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} />
          </Field>
          <Button type="submit" className="w-full">
            إرسال الاقتراح
          </Button>
        </form>
      </Card>

      <Card title="الاقتراحات السابقة">
        {sorted.length === 0 ? (
          <EmptyState label="لا توجد اقتراحات بعد" />
        ) : (
          <div className="space-y-3">
            {sorted.map((s) => (
              <div key={s.id} className="rounded-xl border border-line p-4">
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-sm text-ink/80">{s.details}</p>
                {s.notes && <p className="mt-2 text-xs text-muted">ملاحظات: {s.notes}</p>}
                <p className="mt-2 text-xs text-muted">
                  {authorName(s.createdBy)} · {formatArabicDateTime(s.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppShell>
  );
}
