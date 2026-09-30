import { useMemo, useState } from "react";
import { Wallet, TrendingUp, Users2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { subDays, isAfter, parseISO, startOfMonth } from "date-fns";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import KPICard from "@/components/ui/KPICard";
import Select from "@/components/ui/Select";
import { Input } from "@/components/ui/Field";
import StatusBadge from "@/components/ui/StatusBadge";
import { useOpsStore } from "@/store/opsStore";
import { PAYMENT_METHOD_LABEL } from "@/lib/labels";
import { formatSAR } from "@/utils/currency";

type RangeKey = "today" | "week" | "month" | "custom";

const RANGE_OPTIONS = [
  { value: "today", label: "اليوم" },
  { value: "week", label: "هذا الأسبوع" },
  { value: "month", label: "هذا الشهر" },
  { value: "custom", label: "نطاق مخصص" },
];

export default function TeamRevenuePage() {
  const teams = useOpsStore((s) => s.teams);
  const shiftReports = useOpsStore((s) => s.shiftReports);
  const [range, setRange] = useState<RangeKey>("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const filteredReports = useMemo(() => {
    const now = new Date();
    let from: Date;
    if (range === "today") from = subDays(now, 0);
    else if (range === "week") from = subDays(now, 7);
    else if (range === "month") from = startOfMonth(now);
    else from = customFrom ? parseISO(customFrom) : subDays(now, 30);

    const to = range === "custom" && customTo ? parseISO(customTo) : now;

    return shiftReports.filter((r) => {
      const d = parseISO(r.date);
      return (isAfter(d, from) || +d === +from) && (isAfter(to, d) || +to === +d);
    });
  }, [shiftReports, range, customFrom, customTo]);

  const chartData = teams.map((team) => {
    const teamReports = filteredReports.filter((r) => r.teamId === team.id);
    return { name: team.name, "إجمالي الدخل": teamReports.reduce((sum, r) => sum + r.totalIncome, 0) };
  });

  const summaryRows = teams.map((team) => {
    const teamReports = filteredReports.filter((r) => r.teamId === team.id);
    const collected = teamReports.reduce((sum, r) => sum + r.totalIncome, 0);
    const clients = teamReports.reduce((sum, r) => sum + r.clientsServed, 0);
    const methodsUsed = [...new Set(teamReports.flatMap((r) => r.paymentMethods))];
    return { team, reportsCount: teamReports.length, clients, collected, methodsUsed };
  });

  const totalIncome = summaryRows.reduce((sum, r) => sum + r.collected, 0);
  const bestTeam = summaryRows.reduce((best, r) => (r.collected > (best?.collected ?? -1) ? r : best), summaryRows[0]);
  const averageIncome = summaryRows.length > 0 ? Math.round(totalIncome / summaryRows.length) : 0;

  return (
    <AppShell title="دخل الفرق">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select value={range} onChange={(v) => setRange(v as RangeKey)} options={RANGE_OPTIONS} />
        {range === "custom" && (
          <>
            <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="w-40" />
            <span className="text-sm text-muted">إلى</span>
            <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="w-40" />
          </>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="إجمالي دخل الفرق" value={formatSAR(totalIncome)} icon={Wallet} tone="accent" />
        <KPICard label="أعلى فريق دخلاً" value={bestTeam ? bestTeam.team.name : "—"} icon={TrendingUp} tone="neutral" />
        <KPICard label="متوسط الدخل لكل فريق" value={formatSAR(averageIncome)} icon={Users2} tone="neutral" />
      </div>

      <Card title="مقارنة الفرق" className="mb-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="إجمالي الدخل" fill="#0a6e3d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="تفصيل الإيرادات — من تقارير المشرفين">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">الفريق</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">عدد التقارير</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">العملاء</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">طرق الدفع المستخدمة</th>
                <th className="px-3 py-2 text-start text-xs font-semibold text-muted">إجمالي الدخل</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((r) => (
                <tr key={r.team.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-3 font-semibold text-ink">{r.team.name}</td>
                  <td className="px-3 py-3 text-muted">{r.reportsCount}</td>
                  <td className="px-3 py-3 text-muted">{r.clients}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {r.methodsUsed.length === 0 ? (
                        <span className="text-muted">—</span>
                      ) : (
                        r.methodsUsed.map((m) => <StatusBadge key={m} label={PAYMENT_METHOD_LABEL[m]} tone="info" />)
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-bold text-ink">{formatSAR(r.collected)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
