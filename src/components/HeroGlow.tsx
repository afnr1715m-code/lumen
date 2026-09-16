"use client";

import { useEffect, useRef } from "react";

export default function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", mx.toFixed(3));
        el.style.setProperty("--my", my.toFixed(3));
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="hero-glow pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-24 start-1/2 h-[520px] w-[520px] -translate-x-1/2">
        <div className="hero-glow-blob hero-glow-blob--a h-full w-full rounded-full bg-accent/12 blur-3xl" />
      </div>
      <div className="absolute top-1/4 -end-[6%] h-[360px] w-[360px]">
        <div className="hero-glow-blob hero-glow-blob--b h-full w-full rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="absolute -bottom-[8%] start-[8%] h-[300px] w-[300px]">
        <div className="hero-glow-blob hero-glow-blob--c h-full w-full rounded-full bg-accent/8 blur-3xl" />
      </div>
    </div>
  );
}
