import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Eye } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import DataTable, { type Column } from "@/components/ui/DataTable";
import EmployeeFormDrawer from "@/components/forms/EmployeeFormDrawer";
import { useOpsStore } from "@/store/opsStore";
import { CONTRACT_TYPE_LABEL } from "@/lib/labels";
import { formatSAR } from "@/utils/currency";
import { formatArabicDate } from "@/utils/date";
import type { Employee } from "@/types/domain";

export default function EmployeesPage() {
  const employees = useOpsStore((s) => s.employees);
  const teams = useOpsStore((s) => s.teams);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [contractFilter, setContractFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filtered = useMemo(
    () =>
      employees.filter((e) => {
        if (search && !e.name.includes(search)) return false;
        if (teamFilter !== "all" && e.teamId !== teamFilter) return false;
        if (contractFilter !== "all" && e.contractType !== contractFilter) return false;
        return true;
      }),
    [employees, search, teamFilter, contractFilter]
  );

  function teamName(id: string) {
    return teams.find((t) => t.id === id)?.name ?? "—";
  }

  function openAdd() {
    setEditingEmployee(null);
    setDrawerOpen(true);
  }
  function openEdit(e: Employee) {
    setEditingEmployee(e);
    setDrawerOpen(true);
  }

  const columns: Column<Employee>[] = [
    {
      key: "name",
      header: "الاسم",
      render: (e) => (
        <div>
          <p className="font-semibold text-ink">{e.name}</p>
          <p className="text-xs text-muted">{e.title}</p>
        </div>
      ),
    },
    { key: "salary", header: "الراتب", render: (e) => formatSAR(e.salary) },
    { key: "hireDate", header: "تاريخ المباشرة", render: (e) => formatArabicDate(e.hireDate) },
    { key: "nationalId", header: "رقم الإقامة / الهوية", render: (e) => e.nationalId || "—" },
    { key: "nationality", header: "الجنسية", render: (e) => e.nationality || "—" },
    { key: "contractType", header: "نوع العقد", render: (e) => CONTRACT_TYPE_LABEL[e.contractType] },
    { key: "email", header: "البريد الإلكتروني", render: (e) => e.email || "—" },
    { key: "birthDate", header: "تاريخ الميلاد", render: (e) => formatArabicDate(e.birthDate) },
    { key: "team", header: "الفريق", render: (e) => teamName(e.teamId) },
    {
      key: "actions",
      header: "",
      render: (e) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(ev) => {
              ev.stopPropagation();
              navigate(`/employees/${e.id}`);
            }}
            aria-label="عرض التفاصيل"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-bg hover:text-ink"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            onClick={(ev) => {
              ev.stopPropagation();
              openEdit(e);
            }}
            aria-label="تعديل"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-bg hover:text-accent"
          >
            <Pencil size={15} />
          </button>
        </div>
      ),
      className: "text-end",
    },
  ];

  return (
    <AppShell title="الموظفون">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="ابحث عن موظف..." className="w-64" />
            <Select
              value={teamFilter}
              onChange={setTeamFilter}
              options={[{ value: "all", label: "كل الفرق" }, ...teams.map((t) => ({ value: t.id, label: t.name }))]}
            />
            <Select
              value={contractFilter}
              onChange={setContractFilter}
              options={[
                { value: "all", label: "كل أنواع العقود" },
                ...Object.entries(CONTRACT_TYPE_LABEL).map(([value, label]) => ({ value, label })),
              ]}
            />
          </div>
          <Button onClick={openAdd}>
            <Plus size={16} /> إضافة موظف
          </Button>
        </div>

        <DataTable columns={columns} rows={filtered} onRowClick={(e) => navigate(`/employees/${e.id}`)} emptyLabel="لا يوجد موظفون مطابقون" />
      </Card>

      <EmployeeFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} employee={editingEmployee} />
    </AppShell>
  );
}

