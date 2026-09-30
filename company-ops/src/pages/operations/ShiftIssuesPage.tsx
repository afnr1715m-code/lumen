import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Field";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { useShiftDraftStore } from "@/store/shiftDraftStore";
import { todayISO } from "@/utils/date";

export default function ShiftIssuesPage() {
  const teams = useOpsStore((s) => s.teams);
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const currentUser = useAuthStore((s) => s.currentUser);

  const issues = useShiftDraftStore((s) => s.issues);
  const setIssues = useShiftDraftStore((s) => s.setIssues);

  const today = todayISO();
  const teamId = currentUser?.teamId ?? "";
  const team = teams.find((t) => t.id === teamId);
  const submitted = Boolean(shiftReports.find((r) => r.teamId === teamId && r.date === today));

  return (
    <AppShell title={team ? `المشاكل والأعطال — ${team.name}` : "المشاكل والأعطال"}>
      <Card title="المشاكل والأعطال">
        <Textarea
          value={issues}
          onChange={(e) => setIssues(e.target.value)}
          rows={9}
          placeholder="اكتب هنا أي مشاكل أو أعطال حدثت أثناء العمل..."
          disabled={submitted}
        />
      </Card>
    </AppShell>
  );
}
