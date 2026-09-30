import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Users2, CheckSquare, FileText } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useOpsStore } from "@/store/opsStore";

interface SearchResult {
  id: string;
  label: string;
  meta: string;
  href: string;
  icon: typeof User;
}

export default function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const employees = useOpsStore((s) => s.employees);
  const teams = useOpsStore((s) => s.teams);
  const tasks = useOpsStore((s) => s.tasks);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim();
    if (!q) return [];
    const results: SearchResult[] = [];

    employees
      .filter((e) => e.name.includes(q))
      .forEach((e) => results.push({ id: e.id, label: e.name, meta: `موظف · ${e.title}`, href: `/employees/${e.id}`, icon: User }));

    teams
      .filter((t) => t.name.includes(q))
      .forEach((t) => results.push({ id: t.id, label: t.name, meta: "فريق", href: `/teams/${t.id}`, icon: Users2 }));

    tasks
      .filter((t) => t.title.includes(q))
      .forEach((t) => results.push({ id: t.id, label: t.title, meta: "مهمة", href: `/tasks`, icon: CheckSquare }));

    return results.slice(0, 12);
  }, [query, employees, teams, tasks]);

  function go(href: string) {
    navigate(href);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="بحث عام" maxWidth="max-w-xl">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن موظف، فريق، أو مهمة..."
          className="w-full rounded-lg border border-line bg-surface py-3 ps-9 pe-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      <div className="mt-4 space-y-1">
        {query && results.length === 0 && (
          <div className="flex items-center gap-2 px-2 py-6 text-sm text-muted">
            <FileText size={16} />
            لا توجد نتائج مطابقة لـ "{query}"
          </div>
        )}
        {results.map((r) => (
          <button
            key={`${r.icon.name}_${r.id}`}
            type="button"
            onClick={() => go(r.href)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start hover:bg-bg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
              <r.icon size={15} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">{r.label}</span>
              <span className="block text-xs text-muted">{r.meta}</span>
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
