"use client";

import { useState } from "react";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-4">
      <code className="flex-1 overflow-x-auto whitespace-nowrap text-sm text-ink" dir="ltr">
        {link}
      </code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(link);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="shrink-0 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-accent"
      >
        {copied ? "تم النسخ" : "نسخ رابط العميل"}
      </button>
    </div>
  );
}
