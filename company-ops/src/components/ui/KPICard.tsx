import type { LucideIcon } from "lucide-react";

export default function KPICard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "neutral" | "accent" | "danger" | "warning";
}) {
  const iconWrap =
    tone === "accent"
      ? "bg-accent-soft text-accent"
      : tone === "danger"
        ? "bg-danger-soft text-danger"
        : tone === "warning"
          ? "bg-warning-soft text-warning"
          : "bg-slate-100 text-slate-500";

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconWrap}`}>
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-3 text-2xl font-extrabold text-ink">
        <bdi>{value}</bdi>
      </div>
    </div>
  );
}
