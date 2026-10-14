import { useEffect, useRef, useState, type ReactNode } from "react";

export default function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  if (props.type === "number") return <NumberInput {...props} />;
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

// Zero reads as "unfilled" everywhere in this app's number fields, so the
// box shows blank instead of a literal "0" sitting in front of the cursor.
function displayValue(value: React.InputHTMLAttributes<HTMLInputElement>["value"]): string {
  if (value === undefined || value === null || value === 0 || value === "0") return "";
  return String(value);
}

// A plain controlled <input type="number"> snaps back to "0" the moment you
// backspace it empty, because the parent's onChange reads Number("") as 0
// and re-renders with value=0 before you can type a new digit. This keeps
// its own draft text while focused (only resyncing from the real value on
// blur) so backspacing and retyping a number works like any text field.
function NumberInput({ value, onChange, onFocus, onBlur, className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  const [draft, setDraft] = useState(displayValue(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(displayValue(value));
  }, [value]);

  return (
    <input
      {...rest}
      type="number"
      value={draft}
      className={`${inputClass} ${className ?? ""}`}
      onFocus={(e) => {
        focused.current = true;
        onFocus?.(e);
      }}
      onBlur={(e) => {
        focused.current = false;
        setDraft(displayValue(value));
        onBlur?.(e);
      }}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange?.(e);
      }}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={props.rows ?? 3} className={`${inputClass} resize-none ${props.className ?? ""}`} />;
}
