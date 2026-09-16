import { supabaseAdmin, unwrapRelation } from "@/lib/supabase/server";
import { updateBookingStatusAction } from "../actions";
import { formatRiyadhDateTime } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  pending: "بانتظار التحويل",
  confirmed: "مؤكد",
  cancelled: "ملغي",
};

interface BookingRow {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string | null;
  status: string;
  created_at: string;
  consultation_types: { title: string } | { title: string }[] | null;
  availability_slots: { starts_at: string } | { starts_at: string }[] | null;
}

export default async function AdminBookingsPage() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("bookings")
    .select(
      "id, customer_name, customer_email, customer_phone, notes, status, created_at, consultation_types(title), availability_slots(starts_at)"
    )
    .order("created_at", { ascending: false });

  const bookings = (data ?? []) as BookingRow[];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">الحجوزات</h1>

      <div className="mt-6 space-y-4">
        {bookings.map((booking) => {
          const consultationType = unwrapRelation(booking.consultation_types);
          const slot = unwrapRelation(booking.availability_slots);

          return (
            <div key={booking.id} className="rounded-2xl border border-line bg-bg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-ink">
                    {booking.customer_name}
                    {consultationType ? ` — ${consultationType.title}` : ""}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {booking.customer_email} · {booking.customer_phone}
                  </div>
                  {slot?.starts_at && (
                    <div className="mt-1 text-sm text-muted">{formatRiyadhDateTime(slot.starts_at)}</div>
                  )}
                  {booking.notes && <p className="mt-2 text-sm text-ink">{booking.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
                    {STATUS_LABEL[booking.status] ?? booking.status}
                  </span>
                  {booking.status === "pending" && (
                    <form action={updateBookingStatusAction} className="flex gap-2">
                      <input type="hidden" name="booking_id" value={booking.id} />
                      <button
                        type="submit"
                        name="status"
                        value="confirmed"
                        className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-accent"
                      >
                        تأكيد الاستلام
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="cancelled"
                        className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-muted transition hover:text-ink"
                      >
                        إلغاء
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {bookings.length === 0 && <p className="text-muted">ما فيه حجوزات حتى الآن.</p>}
      </div>
    </div>
  );
}
