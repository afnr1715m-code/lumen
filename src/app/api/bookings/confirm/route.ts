import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { bookingReference } from "@/lib/booking";
import { notifyNewBooking } from "@/lib/notify";

export async function POST(request: Request) {
  const body = await request.json();
  const { consultationTypeId, isoDateTime, name, email, phone, notes } = body ?? {};

  if (!consultationTypeId || !isoDateTime || !name || !email || !phone) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  const { data: consultationType, error: typeError } = await supabase
    .from("consultation_types")
    .select("id, title, price_cents, currency")
    .eq("id", consultationTypeId)
    .single();

  if (typeError || !consultationType) {
    return NextResponse.json({ error: "invalid_consultation_type" }, { status: 400 });
  }

  const { data: slot, error: slotError } = await supabase
    .from("availability_slots")
    .upsert(
      { consultation_type_id: consultationTypeId, starts_at: isoDateTime },
      { onConflict: "consultation_type_id,starts_at" }
    )
    .select("id")
    .single();

  if (slotError || !slot) {
    console.error("slot upsert failed:", slotError);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("id")
    .eq("slot_id", slot.id)
    .neq("status", "cancelled")
    .maybeSingle();

  if (existingBooking) {
    return NextResponse.json({ error: "slot_taken" }, { status: 409 });
  }

  // Bookings start "pending" — there's no payment gateway wired up yet, so
  // Lumen follows up with the customer by email to arrange a bank transfer
  // and confirms the booking manually (in Supabase) once payment is received.
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      consultation_type_id: consultationTypeId,
      slot_id: slot.id,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      notes: notes || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (bookingError || !booking) {
    if (bookingError?.code === "23505") {
      return NextResponse.json({ error: "slot_taken" }, { status: 409 });
    }
    console.error("booking insert failed:", bookingError);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    booking_id: booking.id,
    amount_cents: consultationType.price_cents ?? 0,
    currency: consultationType.currency,
    status: "pending",
    provider: "bank_transfer",
  });

  if (paymentError) {
    console.error("payment insert failed:", paymentError);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const reference = bookingReference(booking.id);
  await notifyNewBooking({
    reference,
    consultationTitle: consultationType.title,
    isoDateTime,
    name,
    email,
    phone,
    notes,
  });

  return NextResponse.json({ reference });
}
