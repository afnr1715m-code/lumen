import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable, { type Column } from "@/components/ui/DataTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProductFormDrawer from "@/components/forms/ProductFormDrawer";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { stockStatusLabel, stockStatusTone } from "@/lib/labels";
import type { Product } from "@/types/domain";

export default function InventoryPage() {
  const products = useOpsStore((s) => s.products);
  const deleteProduct = useOpsStore((s) => s.deleteProduct);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const lowStockCount = products.filter((p) => p.currentStock <= p.minimumStock).length;

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (search && !p.name.includes(search)) return false;
        if (stockFilter === "low" && p.currentStock > p.minimumStock) return false;
        if (stockFilter === "ok" && p.currentStock <= p.minimumStock) return false;
        return true;
      }),
    [products, search, stockFilter]
  );

  function openAdd() {
    setEditingProduct(null);
    setDrawerOpen(true);
  }
  function openEdit(p: Product) {
    setEditingProduct(p);
    setDrawerOpen(true);
  }

  const columns: Column<Product>[] = [
    { key: "name", header: "اسم الصنف", render: (p) => <span className="font-semibold text-ink">{p.name}</span> },
    { key: "quantity", header: "الكمية", render: (p) => p.currentStock },
    { key: "unit", header: "الوحدة", render: (p) => p.unit },
    { key: "min", header: "الحد الأدنى", render: (p) => p.minimumStock },
    {
      key: "status",
      header: "حالة المخزون",
      render: (p) => <StatusBadge label={stockStatusLabel(p.currentStock, p.minimumStock)} tone={stockStatusTone(p.currentStock, p.minimumStock)} />,
    },
    { key: "notes", header: "ملاحظات", render: (p) => <span className="text-muted">{p.notes || "—"}</span> },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEdit(p)}
            aria-label="تعديل"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-bg hover:text-accent"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => setDeletingProduct(p)}
            aria-label="حذف"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-danger-soft hover:text-danger"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      className: "text-end",
    },
  ];

  return (
    <AppShell title="المخزون">
      {lowStockCount > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
          <AlertTriangle size={16} /> {lowStockCount} صنف وصل إلى الحد الأدنى أو أقل — يحتاج إعادة طلب
        </div>
      )}

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="ابحث عن صنف..." className="w-64" />
            <Select
              value={stockFilter}
              onChange={setStockFilter}
              options={[
                { value: "all", label: "كل الأصناف" },
                { value: "low", label: "منخفض فقط" },
                { value: "ok", label: "طبيعي فقط" },
              ]}
            />
          </div>
          <Button onClick={openAdd}>
            <Plus size={16} /> إضافة صنف
          </Button>
        </div>
        <DataTable columns={columns} rows={filtered} emptyLabel="لا توجد أصناف مطابقة" />
      </Card>

      <ProductFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} product={editingProduct} />

      <ConfirmDialog
        open={Boolean(deletingProduct)}
        title="حذف صنف"
        description={`هل تريدين حذف "${deletingProduct?.name}" من المخزون؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        danger
        onCancel={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct && currentUser) deleteProduct(deletingProduct.id, currentUser.id);
          setDeletingProduct(null);
        }}
      />
    </AppShell>
  );
}
