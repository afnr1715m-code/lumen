import { create } from "zustand";
import type { AppearanceRating } from "@/lib/labels";
import type { PaymentMethod } from "@/types/domain";

interface AppearanceEntry {
  rating: AppearanceRating;
  reason: string;
}

/**
 * Working state for the field supervisor's current shift — which employees
 * are on shift, their attendance/appearance, and the in-progress shift
 * report fields. Lives in its own store (separate from the mock "database"
 * in opsStore) so it survives navigating between the shift's separate pages,
 * without pretending it's persisted business data — it resets once the
 * shift report is submitted.
 */
interface ShiftDraftState {
  employeeIds: Set<string>;
  attendance: Record<string, "present" | "absent">;
  appearance: Record<string, AppearanceEntry>;
  clientsServed: number;
  totalIncome: number;
  paymentMethods: Set<PaymentMethod>;
  issues: string;
  notes: string;

  toggleEmployee: (id: string) => void;
  setAttendance: (id: string, status: "present" | "absent") => void;
  setAppearanceRating: (id: string, rating: AppearanceRating) => void;
  setAppearanceReason: (id: string, reason: string) => void;
  setClientsServed: (value: number) => void;
  setTotalIncome: (value: number) => void;
  togglePaymentMethod: (method: PaymentMethod) => void;
  setIssues: (value: string) => void;
  setNotes: (value: string) => void;
  reset: () => void;
}

export const useShiftDraftStore = create<ShiftDraftState>()((set) => ({
  employeeIds: new Set(),
  attendance: {},
  appearance: {},
  clientsServed: 0,
  totalIncome: 0,
  paymentMethods: new Set(),
  issues: "",
  notes: "",

  toggleEmployee: (id) =>
    set((state) => {
      const next = new Set(state.employeeIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { employeeIds: next };
    }),

  setAttendance: (id, status) => set((state) => ({ attendance: { ...state.attendance, [id]: status } })),

  setAppearanceRating: (id, rating) =>
    set((state) => ({
      appearance: { ...state.appearance, [id]: { rating, reason: state.appearance[id]?.reason ?? "" } },
    })),

  setAppearanceReason: (id, reason) =>
    set((state) => ({
      appearance: { ...state.appearance, [id]: { rating: state.appearance[id]?.rating ?? "ممتاز", reason } },
    })),

  setClientsServed: (value) => set({ clientsServed: value }),
  setTotalIncome: (value) => set({ totalIncome: value }),

  togglePaymentMethod: (method) =>
    set((state) => {
      const next = new Set(state.paymentMethods);
      if (next.has(method)) next.delete(method);
      else next.add(method);
      return { paymentMethods: next };
    }),

  setIssues: (value) => set({ issues: value }),
  setNotes: (value) => set({ notes: value }),

  reset: () =>
    set({
      employeeIds: new Set(),
      attendance: {},
      appearance: {},
      clientsServed: 0,
      totalIncome: 0,
      paymentMethods: new Set(),
      issues: "",
      notes: "",
    }),
}));
