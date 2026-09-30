import { useMemo, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { isoDate } from "@/utils/date";

const WEEKDAYS = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

export interface CalendarMarker {
  date: string; // ISO date
  tone: "success" | "warning" | "danger" | "info" | "neutral";
  label: string;
}

const DOT_TONE: Record<CalendarMarker["tone"], string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-slate-400",
};

export default function MonthCalendar({
  markers,
  onDayClick,
  selectedDate,
}: {
  markers: CalendarMarker[];
  onDayClick: (date: string) => void;
  selectedDate: string | null;
}) {
  const [cursor, setCursor] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const markersByDate = useMemo(() => {
    const map = new Map<string, CalendarMarker[]>();
    for (const m of markers) {
      const list = map.get(m.date) ?? [];
      list.push(m);
      map.set(m.date, list);
    }
    return map;
  }, [markers]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => setCursor((c) => subMonths(c, 1))} className="rounded-lg p-2 hover:bg-bg">
          <ChevronRight size={18} />
        </button>
        <p className="text-sm font-bold text-ink">{format(cursor, "MMMM yyyy")}</p>
        <button type="button" onClick={() => setCursor((c) => addMonths(c, 1))} className="rounded-lg p-2 hover:bg-bg">
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = isoDate(day);
          const dayMarkers = markersByDate.get(iso) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate === iso;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onDayClick(iso)}
              className={`flex h-20 flex-col items-start gap-1 rounded-lg border p-1.5 text-start transition ${
                isSelected
                  ? "border-accent bg-accent-soft"
                  : inMonth
                    ? "border-line bg-surface hover:border-accent"
                    : "border-transparent bg-transparent text-muted/50"
              }`}
            >
              <span className={`text-xs font-semibold ${isToday ? "flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white" : "text-ink"}`}>
                {format(day, "d")}
              </span>
              <div className="flex flex-wrap gap-1">
                {dayMarkers.slice(0, 4).map((m, i) => (
                  <span key={i} className={`h-1.5 w-1.5 rounded-full ${DOT_TONE[m.tone]}`} title={m.label} />
                ))}
                {dayMarkers.length > 4 && <span className="text-[10px] text-muted">+{dayMarkers.length - 4}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
