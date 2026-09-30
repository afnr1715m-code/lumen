export function formatSAR(amount: number): string {
  return `${amount.toLocaleString("ar-SA-u-nu-latn", { maximumFractionDigits: 0 })} ر.س`;
}
