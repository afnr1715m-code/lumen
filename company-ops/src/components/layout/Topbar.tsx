import { useState } from "react";
import { Search } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import GlobalSearch from "./GlobalSearch";

export default function Topbar({ title }: { title: string }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-surface px-6">
      <h1 className="text-lg font-bold text-ink">{title}</h1>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted hover:border-accent hover:text-ink"
        >
          <Search size={15} />
          بحث عام
        </button>
        <NotificationBell />
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
