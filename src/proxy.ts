import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { ADMIN_COOKIE, isValidAdminSessionToken } from "@/lib/adminAuth";

const LOCALE_COOKIE = "lumen_locale";

function detectLocale(request: NextRequest): string {
  // العربية هي اللغة الرسمية الافتراضية لأي زائر جديد — لا نعتمد على لغة
  // متصفحه (Accept-Language). فقط زائر عائد بدّل اللغة يدويًا من قبل (وله
  // كوكي محفوظة) يفتح الموقع باللغة اللي اختارها.
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // لوحة تحكم لومن (/admin) — مسار داخلي محمي بكلمة مرور، منفصل تمامًا عن
  // توجيه اللغة العام؛ لا نضيف له بادئة /ar أو /en.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const authed = await isValidAdminSessionToken(token);
    if (!authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\.).*)"],
};
