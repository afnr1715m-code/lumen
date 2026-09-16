type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "lg" | "touch";
type ButtonSurface = "light" | "dark";

const BASE_CLASS =
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition duration-200 ease-out active:scale-[0.97]";

const SIZE_CLASS: Record<ButtonSize, string> = {
  lg: "px-7 py-3.5",
  sm: "px-5 py-2",
  // Same visual weight as "sm", but with enough vertical padding to clear the
  // 44px touch-target minimum — for menus opened by tap, not by mouse hover.
  touch: "px-5 py-3",
};

const VARIANT_CLASS: Record<ButtonSurface, Record<ButtonVariant, string>> = {
  light: {
    primary: "bg-ink text-white hover:bg-accent",
    secondary: "border border-line text-ink hover:border-accent hover:text-accent",
  },
  dark: {
    primary: "bg-accent text-white hover:bg-accent-strong",
    secondary: "border border-white/20 text-white hover:border-white/40",
  },
};

export function buttonClass({
  variant,
  size = "lg",
  surface = "light",
}: {
  variant: ButtonVariant;
  size?: ButtonSize;
  surface?: ButtonSurface;
}) {
  return `${BASE_CLASS} ${SIZE_CLASS[size]} ${VARIANT_CLASS[surface][variant]}`;
}
