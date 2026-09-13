// Simple fixed business-hours slot generator (Asia/Riyadh, Sun–Thu, 10:00–16:00).
// This stands in for a real admin-managed availability calendar — the
// `availability_slots` table is still the source of truth for what's
// actually bookable; slots are lazily created here on first reference.

export const BUSINESS_HOURS = [10, 11, 12, 13, 14, 15, 16];
export const WEEKEND_DAYS = [5, 6]; // Friday, Saturday (JS getDay(): 0=Sun..6=Sat)

export function isBusinessDay(date: Date): boolean {
  return !WEEKEND_DAYS.includes(date.getDay());
}

export function candidateTimesForDate(dateStr: string): string[] {
  // dateStr: "YYYY-MM-DD" — returns ISO datetime strings (fixed +03:00,
  // Saudi Arabia has no DST) for each business hour that day.
  return BUSINESS_HOURS.map((hour) => `${dateStr}T${String(hour).padStart(2, "0")}:00:00+03:00`);
}

export function bookingReference(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}
