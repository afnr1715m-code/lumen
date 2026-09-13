"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { ConsultationCategory, Dictionary } from "@/lib/i18n/types";

interface Props {
  locale: Locale;
  dict: Dictionary;
  category: ConsultationCategory;
  consultationTypeId: string;
  durationMinutes: number;
  priceLabel: string;
}

type Step = "details" | "schedule" | "review" | "confirmed";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(iso: string, locale: Locale) {
  return new Date(iso).toLocaleTimeString(locale === "ar" ? "ar-SA" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Riyadh",
  });
}

export default function BookingFlow({ locale, dict, category, consultationTypeId, priceLabel }: Props) {
  const b = dict.booking;
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [date, setDate] = useState(todayIso());
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (step !== "schedule") return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for a data fetch triggered by step/date change
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetch(`/api/bookings/availability?consultationTypeId=${consultationTypeId}&date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [step, date, consultationTypeId]);

  const minDate = useMemo(() => todayIso(), []);

  const handleDetailsSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStep("schedule");
  };

  const handleSubmitRequest = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationTypeId,
          isoDateTime: selectedSlot,
          name,
          email,
          phone,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "server_error");
      setReference(data.reference);
      setStep("confirmed");
    } catch {
      setError(b.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none transition focus:border-accent";
  const labelClass = "mb-2 block text-sm font-medium text-ink";

  if (step === "confirmed") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-10 text-center">
        <h2 className="text-2xl font-bold text-ink">{b.confirmedTitle}</h2>
        <p className="mt-3 text-muted">{b.confirmedBody}</p>
        <p className="mt-4 text-sm text-muted">
          {b.confirmationRef}: <span className="font-mono font-semibold text-ink">{reference}</span>
        </p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
        >
          {b.backHome}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex items-center gap-3 text-sm font-medium">
        {[b.stepDetails, b.stepSchedule, b.stepReview].map((label, i) => {
          const stepKeys: Step[] = ["details", "schedule", "review"];
          const isActive = stepKeys[i] === step;
          const isDone = stepKeys.indexOf(step) > i;
          return (
            <div key={label} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  isActive || isDone ? "bg-ink text-white" : "bg-surface text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span className={isActive ? "text-ink" : "text-muted"}>{label}</span>
              {i < 2 && <span className="mx-1 h-px w-6 bg-line" />}
            </div>
          );
        })}
      </div>

      {step === "details" && (
        <form onSubmit={handleDetailsSubmit} className="space-y-5">
          <div>
            <label className={labelClass} htmlFor="name">{b.nameLabel}</label>
            <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">{b.emailLabel}</label>
            <input id="email" type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">{b.phoneLabel}</label>
            <input id="phone" type="tel" dir="ltr" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="notes">{b.notesLabel}</label>
            <textarea id="notes" rows={3} placeholder={b.notesPlaceholder} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" className="w-full rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent">
            {b.continueButton}
          </button>
        </form>
      )}

      {step === "schedule" && (
        <div className="space-y-6">
          <div>
            <label className={labelClass} htmlFor="date">{b.dateLabel}</label>
            <input
              id="date"
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
              dir="ltr"
            />
          </div>

          <div>
            <span className={labelClass}>{b.timeLabel}</span>
            {loadingSlots ? (
              <p className="text-sm text-muted">…</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted">{b.noSlotsForDay}</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                      selectedSlot === slot
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-line text-ink hover:border-accent"
                    }`}
                  >
                    {formatTime(slot, locale)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep("details")} className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink">
              {b.backButton}
            </button>
            <button
              type="button"
              disabled={!selectedSlot}
              onClick={() => setStep("review")}
              className="flex-1 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent disabled:opacity-40"
            >
              {b.continueButton}
            </button>
          </div>
        </div>
      )}

      {step === "review" && selectedSlot && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="text-sm font-semibold text-muted">{b.summaryTitle}</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">{category.title}</dt>
                <dd className="font-medium text-ink">
                  {new Date(selectedSlot).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
                    timeZone: "Asia/Riyadh",
                    day: "numeric",
                    month: "long",
                  })}
                  {" · "}
                  {formatTime(selectedSlot, locale)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base">
                <dt className="font-semibold text-ink">{b.totalLabel}</dt>
                <dd className="font-semibold text-ink">{priceLabel}</dd>
              </div>
            </dl>
          </div>

          <p className="text-xs text-muted">{b.followUpNote}</p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep("schedule")} className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink">
              {b.backButton}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitRequest}
              className="flex-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
            >
              {submitting ? b.processingButton : b.submitButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
