import type { AttendanceRecord, AttendanceStatus } from "@/types/domain";
import { employees } from "@/data/roster";
import { daysFromToday } from "@/utils/date";

const STATUS_CYCLE: AttendanceStatus[] = [
  "present",
  "present",
  "present",
  "present",
  "late",
  "present",
  "present",
  "absent",
  "present",
  "present",
];

function buildAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  for (let dayOffset = 0; dayOffset > -7; dayOffset--) {
    const date = daysFromToday(dayOffset);
    employees.forEach((emp, empIndex) => {
      if (emp.status === "inactive") return;
      const seed = (empIndex * 3 + Math.abs(dayOffset) * 7) % STATUS_CYCLE.length;
      let status = STATUS_CYCLE[seed];
      if (emp.status === "on_leave" && dayOffset === 0) status = "leave";

      records.push({
        id: `att_${emp.id}_${date}`,
        employeeId: emp.id,
        date,
        status,
        checkIn: status === "absent" || status === "leave" ? null : status === "late" ? "08:35" : "07:55",
        checkOut: status === "absent" || status === "leave" ? null : "16:10",
      });
    });
  }
  return records;
}

export const attendanceRecords: AttendanceRecord[] = buildAttendance();
