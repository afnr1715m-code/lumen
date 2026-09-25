import { ImageResponse } from "next/og";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og (Satori) needs a real font buffer to shape non-Latin scripts like
// Arabic — without this it throws "substFormat: 3 is not yet supported".
// Google Fonts only serves .ttf (what Satori needs) to old browsers that
// predate woff2 support, hence the outdated user-agent below.
async function loadGoogleFont(family: string, weight: string, text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(cssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
      },
    })
  ).text();
  const fontUrlMatch = css.match(/src: url\(([^)]+)\)/);
  if (!fontUrlMatch) throw new Error(`Could not find font URL for ${family}`);
  const fontRes = await fetch(fontUrlMatch[1]);
  return fontRes.arrayBuffer();
}

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale: Locale = isLocale(locale) ? locale : "ar";
  const dict = getDictionary(typedLocale);

  const fontFamily = typedLocale === "ar" ? "Tajawal" : "Inter";
  const text = `${dict.nav.brand}${dict.hero.title}${dict.hero.subtitle}`;
  const [regular, bold] = await Promise.all([
    loadGoogleFont(fontFamily, "500", text),
    loadGoogleFont(fontFamily, "800", text),
  ]);

  const dir = typedLocale === "ar" ? "rtl" : "ltr";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0b0f17",
          color: "#f5f6f8",
          fontFamily: fontFamily,
          direction: dir,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 56 56" fill="none">
            <g stroke="#0a6e3d" strokeWidth="4.6" strokeLinecap="round">
              <path d="M44.85 42.14 A22 22 0 1 1 42.14 11.15" />
              <path d="M47.05 17 A22 22 0 0 1 48.67 35.52" />
            </g>
          </svg>
          <span style={{ fontSize: 34, fontWeight: 800 }}>{dict.nav.brand}</span>
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 52, fontWeight: 800, lineHeight: 1.25, maxWidth: 920 }}>
          {dict.hero.title}
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 26, color: "rgba(245,246,248,0.65)", maxWidth: 820 }}>
          {dict.hero.subtitle}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: fontFamily, data: regular, weight: 500, style: "normal" },
        { name: fontFamily, data: bold, weight: 800, style: "normal" },
      ],
    }
  );
}
