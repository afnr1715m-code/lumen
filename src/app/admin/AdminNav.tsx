"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "./actions";

const LINKS = [
  { href: "/admin", label: "الرئيسية" },
  { href: "/admin/inquiries", label: "طلبات المشاريع" },
  { href: "/admin/bookings", label: "الحجوزات" },
  { href: "/admin/proposals", label: "المقترحات والدفعات" },
];

export default function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <span className="text-lg font-extrabold text-ink">لوحة تحكم لومن</span>
        <nav className="flex flex-wrap items-center gap-5 text-sm font-semibold text-muted">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "text-accent" : "hover:text-ink"}
            >
              {link.label}
            </Link>
          ))}
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-line px-4 py-1.5 text-muted transition hover:text-ink"
            >
              تسجيل الخروج
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
