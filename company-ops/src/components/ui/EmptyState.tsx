import { Inbox } from "lucide-react";

export default function EmptyState({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Inbox size={22} />
      </span>
      <p className="text-sm font-medium text-muted">{label}</p>
      {hint && <p className="text-xs text-muted/80">{hint}</p>}
    </div>
  );
}
