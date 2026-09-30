import type { PaymentMethod, Service } from "@/types/domain";
import { teams, employeesByTeam } from "@/data/roster";
import { clients } from "@/data/clients";
import { daysFromToday } from "@/utils/date";

const SERVICE_TYPES = ["تنظيف عام", "تعقيم شامل", "غسيل واجهات", "تنظيف مكيفات", "صيانة دورية", "خدمة طارئة"];
const BASE_VALUE: Record<string, number> = {
  "تنظيف عام": 450,
  "تعقيم شامل": 650,
  "غسيل واجهات": 900,
  "تنظيف مكيفات": 380,
  "صيانة دورية": 520,
  "خدمة طارئة": 1100,
};
const PAYMENT_METHODS: PaymentMethod[] = ["cash", "card", "bank_transfer"];

// Every team gets services, but team_a/team_b carry more volume.
const teamPool = [teams[0], teams[0], teams[1], teams[1], teams[2], teams[3], teams[4]];

function buildServices(): Service[] {
  const list: Service[] = [];
  for (let i = 0; i < 30; i++) {
    const team = teamPool[i % teamPool.length];
    const teamStaff = employeesByTeam(team.id);
    const employee = teamStaff[i % Math.max(teamStaff.length, 1)] ?? teamStaff[0];
    const client = clients[i % clients.length];
    const serviceType = SERVICE_TYPES[i % SERVICE_TYPES.length];
    const dayOffset = -(i % 14);
    const value = BASE_VALUE[serviceType] + ((i * 37) % 150);
    const discount = i % 5 === 0 ? 50 : 0;
    const finalAmount = value - discount;
    const paymentMethod = PAYMENT_METHODS[i % PAYMENT_METHODS.length];

    // Deliberate revenue mismatch on team_b, a few records, to demo the
    // "service value != collected amount" automation warning.
    const isMismatch = team.id === "team_b" && i % 6 === 0;
    const collectedAmount = isMismatch ? finalAmount - 120 : finalAmount;

    list.push({
      id: `svc_${i + 1}`,
      clientName: client.name,
      serviceName: serviceType,
      teamId: team.id,
      supervisorId: team.supervisorId,
      employeeId: employee?.id ?? team.supervisorId,
      date: daysFromToday(dayOffset),
      value,
      discount,
      finalAmount,
      paymentMethod,
      paymentStatus: isMismatch ? "partial" : "paid",
      collectedAmount,
    });
  }
  return list;
}

export const services: Service[] = buildServices();
