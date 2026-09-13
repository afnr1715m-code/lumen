// مصادقة لوحة تحكم لومن — أداة داخلية لصاحبة الموقع فقط، بدون نظام مستخدمين
// متعدد ولا جدول جلسات بقاعدة البيانات. الجلسة عبارة عن توقيع HMAC ثابت
// لكلمة سر مشتركة (ADMIN_PASSWORD)، محسوب بـ Web Crypto حتى يشتغل نفسه
// بمسار proxy.ts (Edge) وبأكشنات الخادم (Node.js) بدون فرق.

export const ADMIN_COOKIE = "lumen_admin";

const SESSION_PAYLOAD = "lumen-admin-session-v1";

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return secret;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSessionToken(): Promise<string> {
  return hmacHex(getSecret(), SESSION_PAYLOAD);
}

export async function isValidAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const expected = await createAdminSessionToken();
  return token === expected;
}
