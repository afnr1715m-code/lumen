import { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Field, { Input } from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { employeesByTeam, teams } from "@/data/roster";
import { clients } from "@/data/clients";
import { PAYMENT_METHOD_LABEL } from "@/lib/labels";
import { todayISO } from "@/utils/date";
import type { PaymentMethod } from "@/types/domain";

const SERVICE_TYPES = ["تنظيف عام", "تعقيم شامل", "غسيل واجهات", "تنظيف مكيفات", "صيانة دورية", "خدمة طارئة"];

// Always logs against the signed-in supervisor's own team — a supervisor
// only ever reports on their own team's work, never picks a different one.
export default function ServiceFormDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createService = useOpsStore((s) => s.createService);
  const currentUser = useAuthStore((s) => s.currentUser);
  const teamId = currentUser?.teamId ?? teams[0].id;
  const team = teams.find((t) => t.id === teamId) ?? teams[0];
  const teamStaff = employeesByTeam(team.id);

  const [clientName, setClientName] = useState(clients[0]?.name ?? "");
  const [serviceName, setServiceName] = useState(SERVICE_TYPES[0]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [value, setValue] = useState(500);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [collectedAmount, setCollectedAmount] = useState(500);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    createService(
      {
        clientName,
        serviceName,
        teamId: team.id,
        supervisorId: team.supervisorId,
        employeeId: employeeId || team.supervisorId,
        date,
        value,
        discount,
        paymentMethod,
        paymentStatus: collectedAmount >= value - discount ? "paid" : "partial",
        collectedAmount,
      },
      currentUser.id
    );
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose} title={`تسجيل خدمة — ${team.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="العميل">
          <Select value={clientName} onChange={setClientName} options={clients.map((c) => ({ value: c.name, label: c.name }))} />
        </Field>
        <Field label="نوع الخدمة">
          <Select value={serviceName} onChange={setServiceName} options={SERVICE_TYPES.map((s) => ({ value: s, label: s }))} />
        </Field>
        <Field label="الموظف المنفّذ">
          <Select
            value={employeeId}
            onChange={setEmployeeId}
            options={[{ value: "", label: "بدون تحديد" }, ...teamStaff.map((e) => ({ value: e.id, label: e.name }))]}
          />
        </Field>
        <Field label="التاريخ">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="القيمة (ر.س)">
            <Input type="number" min={0} value={value} onChange={(e) => setValue(Number(e.target.value))} required />
          </Field>
          <Field label="الخصم (ر.س)">
            <Input type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </Field>
        </div>
        <Field label="طريقة الدفع">
          <Select
            value={paymentMethod}
            onChange={(v) => setPaymentMethod(v as PaymentMethod)}
            options={Object.entries(PAYMENT_METHOD_LABEL).map(([v, l]) => ({ value: v, label: l }))}
          />
        </Field>
        <Field label="المبلغ المحصّل فعليًا (ر.س)">
          <Input type="number" min={0} value={collectedAmount} onChange={(e) => setCollectedAmount(Number(e.target.value))} />
        </Field>
        <div className="rounded-lg bg-bg px-3 py-2 text-sm text-muted">
          المبلغ النهائي: <span className="font-bold text-ink">{Math.max(value - discount, 0).toLocaleString("ar-SA-u-nu-latn")} ر.س</span>
        </div>
        <Button type="submit" className="w-full">
          تسجيل الخدمة
        </Button>
      </form>
    </Drawer>
  );
}
