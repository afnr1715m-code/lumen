"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import Reveal from "./Reveal";

export default function Faq({ dict }: { dict: Dictionary }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="text-center">
          <div className="mx-auto h-1 w-12 rounded-full bg-accent" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{dict.faq.headline}</h2>
        </Reveal>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {dict.faq.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.question} className={`transition-colors duration-300 ${open ? "bg-accent-soft/40" : ""}`}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-1 py-5 text-start"
                >
                  <span className={`text-base font-semibold transition-colors ${open ? "text-accent" : "text-ink"}`}>
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 text-xl transition-all duration-300 ${open ? "rotate-45 text-accent" : "text-muted"}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"} overflow-hidden`}>
                  <p className="min-h-0 px-1 text-sm leading-relaxed text-muted">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
