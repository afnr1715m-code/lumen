import type { DailyReport } from "@/types/domain";
import { teams, employeesByTeam } from "@/data/roster";
import { services } from "@/data/services";
import { attendanceRecords } from "@/data/attendance";
import { daysFromToday, isoDateTime } from "@/utils/date";

function buildReports(): DailyReport[] {
  const list: DailyReport[] = [];

  for (let dayOffset = -4; dayOffset <= 0; dayOffset++) {
    const date = daysFromToday(dayOffset);

    for (const team of teams) {
      const teamStaff = employeesByTeam(team.id);
      const staffIds = new Set(teamStaff.map((e) => e.id));
      const dayAttendance = attendanceRecords.filter((a) => a.date === date && staffIds.has(a.employeeId));
      const presentCount = dayAttendance.filter((a) => a.status === "present" || a.status === "late").length;
      const absentCount = dayAttendance.filter((a) => a.status === "absent").length;
      const lateCount = dayAttendance.filter((a) => a.status === "late").length;

      // Team C's report for *today* is deliberately not submitted yet, to
      // demonstrate the "overdue end-of-day report" automation.
      const isTodayUnsubmitted = team.id === "team_c" && dayOffset === 0;

      list.push({
        id: `rep_${team.id}_${date}_start`,
        teamId: team.id,
        date,
        kind: "start_of_day",
        status: "submitted",
        submittedAt: isoDateTime(new Date(new Date(date).setHours(7, 45))),
        presentCount,
        absentCount,
        lateCount,
        scheduledTasks: "تنفيذ الخدمات المجدولة حسب الجدول اليومي",
        neededEquipment: "لا يوجد",
        lowStockNotes: team.id === "team_a" ? "سائل التنظيف قارب على النفاد" : "",
      });

      const dayServices = services.filter((s) => s.teamId === team.id && s.date === date);
      const totalRevenue = dayServices.reduce((sum, s) => sum + s.finalAmount, 0);
      const cash = dayServices.filter((s) => s.paymentMethod === "cash").reduce((sum, s) => sum + s.collectedAmount, 0);
      const card = dayServices.filter((s) => s.paymentMethod === "card").reduce((sum, s) => sum + s.collectedAmount, 0);
      const bankTransfer = dayServices
        .filter((s) => s.paymentMethod === "bank_transfer")
        .reduce((sum, s) => sum + s.collectedAmount, 0);
      const uniqueClients = new Set(dayServices.map((s) => s.clientName)).size;

      list.push({
        id: `rep_${team.id}_${date}_end`,
        teamId: team.id,
        date,
        kind: "end_of_day",
        status: isTodayUnsubmitted ? "overdue" : dayServices.length > 0 ? "submitted" : "pending",
        submittedAt: isTodayUnsubmitted ? null : isoDateTime(new Date(new Date(date).setHours(19, 30))),
        servicesCount: dayServices.length,
        clientsCount: uniqueClients,
        totalRevenue,
        cash,
        card,
        bankTransfer,
        productsUsed: "مواد تنظيف عامة",
        issues: "",
        complaints: "",
        achievements: dayServices.length > 3 ? "تجاوز عدد الخدمات المستهدف لهذا اليوم" : "",
        notes: "",
      });
    }
  }

  return list;
}

export const dailyReports: DailyReport[] = buildReports();
