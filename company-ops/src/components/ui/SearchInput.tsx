import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "بحث...",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-surface py-2.5 ps-9 pe-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
      />
    </div>
  );
}
