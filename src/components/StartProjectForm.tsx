"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/types";

export default function StartProjectForm({
  dict,
  initialDetails,
}: {
  dict: Dictionary;
  initialDetails?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    const form = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          company: form.get("company"),
          email: form.get("email"),
          phone: form.get("phone"),
          projectType: form.get("projectType"),
          budget: form.get("budget"),
          timeline: form.get("timeline"),
          details: form.get("details"),
        }),
      });
      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-10 text-center">
        <h2 className="text-xl font-bold text-ink">{dict.startProject.successTitle}</h2>
        <p className="mt-3 text-muted">{dict.startProject.successBody}</p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none transition focus:border-accent";
  const labelClass = "mb-2 block text-sm font-medium text-ink";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">{dict.startProject.nameLabel}</label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="company">{dict.startProject.companyLabel}</label>
          <input id="company" name="company" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="email">{dict.startProject.emailLabel}</label>
          <input id="email" name="email" type="email" dir="ltr" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">{dict.startProject.phoneLabel}</label>
          <input id="phone" name="phone" type="tel" dir="ltr" required className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="projectType">{dict.startProject.projectTypeLabel}</label>
        <select id="projectType" name="projectType" required className={inputClass}>
          {dict.startProject.projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="budget">{dict.startProject.budgetLabel}</label>
          <input id="budget" name="budget" placeholder={dict.startProject.budgetPlaceholder} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="timeline">{dict.startProject.timelineLabel}</label>
          <input id="timeline" name="timeline" placeholder={dict.startProject.timelinePlaceholder} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="details">{dict.startProject.detailsLabel}</label>
        <textarea
          id="details"
          name="details"
          required
          rows={5}
          defaultValue={initialDetails}
          placeholder={dict.startProject.detailsPlaceholder}
          className={inputClass}
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{dict.startProject.errorGeneric}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent disabled:opacity-60"
      >
        {status === "submitting" ? dict.startProject.submitting : dict.startProject.submit}
      </button>
    </form>
  );
}
