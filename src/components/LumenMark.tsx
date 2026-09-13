export default function LumenMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="4.6" strokeLinecap="round">
        <path d="M44.85 42.14 A22 22 0 1 1 42.14 11.15" />
        <path d="M47.05 17 A22 22 0 0 1 48.67 35.52" />
      </g>
    </svg>
  );
}
