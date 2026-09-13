import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { candidateTimesForDate } from "@/lib/booking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const consultationTypeId = searchParams.get("consultationTypeId");
  const date = searchParams.get("date");

  if (!consultationTypeId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }

  const candidates = candidateTimesForDate(date);
  const supabase = supabaseAdmin();

  const { data: slots, error } = await supabase
    .from("availability_slots")
    .select("id, starts_at, bookings(status)")
    .eq("consultation_type_id", consultationTypeId)
    .in("starts_at", candidates);

  if (error) {
    console.error("availability lookup failed:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const takenTimes = new Set(
    (slots ?? [])
      .filter((slot) => {
        const bookings = Array.isArray(slot.bookings) ? slot.bookings : [slot.bookings];
        return bookings.some((b) => b && b.status !== "cancelled");
      })
      .map((slot) => new Date(slot.starts_at).toISOString())
  );

  const available = candidates.filter((iso) => !takenTimes.has(new Date(iso).toISOString()));

  return NextResponse.json({ slots: available });
}
