import { useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { useShiftDraftStore } from "@/store/shiftDraftStore";
import { employeesByTeam } from "@/data/roster";
import { APPEARANCE_RATING_TONE, type AppearanceRating } from "@/lib/labels";

const APPEARANCE_OPTIONS: AppearanceRating[] = ["ممتاز", "جيد", "ضعيف"];

export default function ShiftEmployeesPage() {
  const teams = useOpsStore((s) => s.teams);
  const currentUser = useAuthStore((s) => s.currentUser);

  const employeeIds = useShiftDraftStore((s) => s.employeeIds);
  const attendance = useShiftDraftStore((s) => s.attendance);
  const appearance = useShiftDraftStore((s) => s.appearance);
  const toggleEmployee = useShiftDraftStore((s) => s.toggleEmployee);
  const setAttendance = useShiftDraftStore((s) => s.setAttendance);
  const setAppearanceRating = useShiftDraftStore((s) => s.setAppearanceRating);
  const setAppearanceReason = useShiftDraftStore((s) => s.setAppearanceReason);

  const teamId = currentUser?.teamId ?? "";
  const team = teams.find((t) => t.id === teamId);
  const teamRoster = useMemo(() => (teamId ? employeesByTeam(teamId) : []), [teamId]);

  if (!team) {
    return (
      <AppShell title="الموظفين">
        <Card>لا يوجد فريق مرتبط بحسابك حاليًا.</Card>
      </AppShell>
    );
  }

  return (
    <AppShell title={`الموظفين — ${team.name}`}>
      <Card title="الموظفين — الشفت، الحضور، والمظهر الخارجي">
        <p className="mb-4 text-sm text-muted">
          حددي الموظفين المسؤولين عن الشغل معك في هذا الشفت، وسجّلي حضورهم وتقييم مظهرهم فور تحديدهم.
        </p>
        <div className="space-y-2">
          {teamRoster.map((e) => {
            const inShift = employeeIds.has(e.id);
            const status = attendance[e.id];
            const current = appearance[e.id];
            return (
              <div key={e.id} className={`rounded-lg border px-4 py-3 transition ${inShift ? "border-accent" : "border-line"}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={inShift}
                      onChange={() => toggleEmployee(e.id)}
                      className="h-4 w-4 shrink-0 rounded border-line accent-[var(--color-accent)]"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{e.name}</p>
                      <p className="text-xs text-muted">{e.title}</p>
                    </div>
                  </label>

                  {inShift && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAttendance(e.id, "present")}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                          status === "present" ? "bg-success text-white" : "bg-bg text-muted hover:text-ink"
                        }`}
                      >
                        حاضر
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendance(e.id, "absent")}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                          status === "absent" ? "bg-danger text-white" : "bg-bg text-muted hover:text-ink"
                        }`}
                      >
                        غائب
                      </button>
                    </div>
                  )}
                </div>

                {inShift && (
                  <div className="mt-3 border-t border-line pt-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-muted">المظهر الخارجي</span>
                      <div className="flex gap-2">
                        {APPEARANCE_OPTIONS.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setAppearanceRating(e.id, option)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                              current?.rating === option
                                ? APPEARANCE_RATING_TONE[option] === "success"
                                  ? "bg-success text-white"
                                  : APPEARANCE_RATING_TONE[option] === "danger"
                                    ? "bg-danger text-white"
                                    : "bg-info text-white"
                                : "bg-bg text-muted hover:text-ink"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    {current?.rating === "ضعيف" && (
                      <div className="mt-3">
                        <Input
                          value={current.reason}
                          onChange={(ev) => setAppearanceReason(e.id, ev.target.value)}
                          placeholder="سبب التقييم..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </AppShell>
  );
}
