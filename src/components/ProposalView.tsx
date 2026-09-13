"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

export interface MilestoneData {
  id: string;
  name: string;
  amount_cents: number;
  status: "pending" | "awaiting_confirmation" | "paid";
}

interface Props {
  locale: Locale;
  dict: Dictionary;
  projectName: string;
  clientName: string;
  currency: string;
  milestones: MilestoneData[];
}

function formatMoney(cents: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export default function ProposalView({ locale, dict, projectName, clientName, currency, milestones: initial }: Props) {
  const p = dict.proposal;
  const [milestones, setMilestones] = useState(initial);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const total = milestones.reduce((sum, m) => sum + m.amount_cents, 0);

  const statusLabel = (status: MilestoneData["status"]) => {
    if (status === "paid") return p.statusPaid;
    if (status === "awaiting_confirmation") return p.statusAwaitingConfirmation;
    return p.statusPending;
  };

  const statusClass = (status: MilestoneData["status"]) => {
    if (status === "paid") return "bg-accent/10 text-accent";
    if (status === "awaiting_confirmation") return "bg-surface text-muted";
    return "bg-surface text-muted";
  };

  const handleConfirm = async (milestoneId: string) => {
    setSubmittingId(milestoneId);
    setError("");
    try {
      const res = await fetch("/api/proposals/confirm-milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneId }),
      });
      if (!res.ok) throw new Error("failed");
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, status: "awaiting_confirmation" } : m))
      );
    } catch {
      setError(p.errorGeneric);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-20 lg:px-10 lg:py-28">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{projectName}</h1>
      <p className="mt-2 text-muted">{clientName}</p>

      <div className="mt-10 rounded-2xl border border-line p-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="text-sm font-semibold text-muted">{p.totalLabel}</span>
          <span className="text-lg font-bold text-ink">{formatMoney(total, currency, locale)}</span>
        </div>

        <h2 className="mt-6 text-sm font-semibold text-muted">{p.milestonesTitle}</h2>
        <div className="mt-4 space-y-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="rounded-xl border border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-ink">{milestone.name}</div>
                  <div className="mt-1 text-sm text-muted">{formatMoney(milestone.amount_cents, currency, locale)}</div>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(milestone.status)}`}>
                  {statusLabel(milestone.status)}
                </span>
              </div>

              {milestone.status === "pending" && (
                <button
                  type="button"
                  disabled={submittingId === milestone.id}
                  onClick={() => handleConfirm(milestone.id)}
                  className="mt-4 w-full rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent disabled:opacity-60"
                >
                  {submittingId === milestone.id ? p.confirmingButton : p.confirmButton}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <p className="mt-6 text-xs text-muted">{p.followUpNote}</p>
    </section>
  );
}
