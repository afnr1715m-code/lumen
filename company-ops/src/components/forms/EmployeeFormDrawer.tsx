import { useEffect, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Field, { Input } from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { teams } from "@/data/roster";
import { CONTRACT_TYPE_LABEL } from "@/lib/labels";
import { daysFromToday } from "@/utils/date";
import type { ContractType, Employee } from "@/types/domain";

const EMPTY_FORM = {
  name: "",
  title: "",
  teamId: teams[0].id,
  phone: "",
  email: "",
  nationalId: "",
  nationality: "",
  birthDate: daysFromToday(-365 * 25),
  contractType: "permanent" as ContractType,
  contractEndDate: daysFromToday(365),
  iqamaEndDate: daysFromToday(365),
  salary: 3500,
};

export default function EmployeeFormDrawer({
  open,
  onClose,
  employee,
}: {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null;
}) {
  const addEmployee = useOpsStore((s) => s.addEmployee);
  const updateEmployee = useOpsStore((s) => s.updateEmployee);
  const currentUser = useAuthStore((s) => s.currentUser);
  const isEdit = Boolean(employee);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    if (employee) {
      setForm({
        name: employee.name,
        title: employee.title,
        teamId: employee.teamId || teams[0].id,
        phone: employee.phone,
        email: employee.email,
        nationalId: employee.nationalId,
        nationality: employee.nationality,
        birthDate: employee.birthDate,
        contractType: employee.contractType,
        contractEndDate: employee.contractEndDate,
        iqamaEndDate: employee.iqamaEndDate,
        salary: employee.salary,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, employee]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !currentUser) return;
    const team = teams.find((t) => t.id === form.teamId)!;
    const payload: Omit<Employee, "id"> = {
      name: form.name,
      title: form.title || "فني تشغيل",
      teamId: form.teamId,
      supervisorId: team.supervisorId,
      status: employee?.status ?? "active",
      phone: form.phone,
      email: form.email,
      nationalId: form.nationalId,
      nationality: form.nationality,
      birthDate: form.birthDate,
      hireDate: employee?.hireDate ?? daysFromToday(0),
      contractType: form.contractType,
      contractEndDate: form.contractEndDate,
      iqamaEndDate: form.iqamaEndDate,
      salary: form.salary,
      salaryPlatform: employee?.salaryPlatform ?? "mudad",
      notes: employee?.notes ?? "",
    };

    if (isEdit && employee) {
      updateEmployee(employee.id, payload, currentUser.id);
    } else {
      addEmployee(payload, currentUser.id);
    }
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? "تعديل بيانات موظف" : "إضافة موظف"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="الاسم الكامل">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <Field label="المسمى الوظيفي">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="فني تشغيل" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="الفريق">
            <Select value={form.teamId} onChange={(v) => set("teamId", v)} options={teams.map((t) => ({ value: t.id, label: t.name }))} />
          </Field>
          <Field label="نوع العقد">
            <Select
              value={form.contractType}
              onChange={(v) => set("contractType", v as ContractType)}
              options={Object.entries(CONTRACT_TYPE_LABEL).map(([value, label]) => ({ value, label }))}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="رقم الجوال">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="05XXXXXXXX" />
          </Field>
          <Field label="البريد الإلكتروني">
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="رقم الإقامة / الهوية">
            <Input value={form.nationalId} onChange={(e) => set("nationalId", e.target.value)} />
          </Field>
          <Field label="الجنسية">
            <Input value={form.nationality} onChange={(e) => set("nationality", e.target.value)} placeholder="سعودي" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="تاريخ الميلاد">
            <Input type="date" value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
          </Field>
          <Field label="الراتب (ر.س)">
            <Input type="number" min={0} value={form.salary} onChange={(e) => set("salary", Number(e.target.value))} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="تاريخ انتهاء العقد">
            <Input type="date" value={form.contractEndDate} onChange={(e) => set("contractEndDate", e.target.value)} />
          </Field>
          <Field label="تاريخ انتهاء الإقامة">
            <Input type="date" value={form.iqamaEndDate} onChange={(e) => set("iqamaEndDate", e.target.value)} />
          </Field>
        </div>
        <Button type="submit" className="w-full">
          {isEdit ? "حفظ التعديلات" : "إضافة الموظف"}
        </Button>
      </form>
    </Drawer>
  );
}
