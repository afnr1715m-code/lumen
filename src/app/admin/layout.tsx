import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "../globals.css";
import AdminNav from "./AdminNav";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "لوحة تحكم لومن",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface text-ink">
        <AdminNav />
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
