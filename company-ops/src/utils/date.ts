import { addDays, format, subDays, differenceInCalendarDays, parseISO } from "date-fns";

export function isoDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function isoDateTime(d: Date): string {
  return d.toISOString();
}

export function todayISO(): string {
  return isoDate(new Date());
}

export function daysFromToday(offset: number): string {
  return isoDate(offset >= 0 ? addDays(new Date(), offset) : subDays(new Date(), -offset));
}

export function daysUntil(isoDateStr: string): number {
  return differenceInCalendarDays(parseISO(isoDateStr), new Date());
}

export function formatArabicDate(isoDateStr: string): string {
  const d = parseISO(isoDateStr);
  return new Intl.DateTimeFormat("ar-SA-u-nu-latn", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function formatArabicDateTime(isoDateTimeStr: string): string {
  const d = parseISO(isoDateTimeStr);
  return new Intl.DateTimeFormat("ar-SA-u-nu-latn", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function currentDayOfMonth(): number {
  return new Date().getDate();
}

// A task is overdue if its due date has passed and it isn't done yet —
// this is computed, never stored, so it can't drift out of sync with today's date.
export function isTaskOverdue(dueDate: string, status: string): boolean {
  return status !== "مكتملة" && daysUntil(dueDate) < 0;
}
