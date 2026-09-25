import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a6e3d",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 56 56" fill="none">
          <g stroke="#ffffff" strokeWidth="5.4" strokeLinecap="round">
            <path d="M44.85 42.14 A22 22 0 1 1 42.14 11.15" />
            <path d="M47.05 17 A22 22 0 0 1 48.67 35.52" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
