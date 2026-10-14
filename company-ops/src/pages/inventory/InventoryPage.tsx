import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle, PackageMinus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable, { type Column } from "@/components/ui/DataTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Field";
import ProductFormDrawer from "@/components/forms/ProductFormDrawer";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import { stockStatusLabel, stockStatusTone } from "@/lib/labels";
import type { Product } from "@/types/domain";

export default function InventoryPage() {
  const products = useOpsStore((s) => s.products);
  const deleteProduct = useOpsStore((s) => s.deleteProduct);
  const logProductUsage = useOpsStore((s) => s.logProductUsage);
  const currentUser = useAuthStore((s) => s.currentUser);
  const isManager = currentUser?.role === "manager";
  const isCoordinator = currentUser?.role === "coordinator";
  // The coordinator gets the same full view as the manager (add + edit, so
  // they can update stock quantities) but never delete products.
  const canSeeFullView = isManager || isCoordinator;
  const canEditProducts = isManager || isCoordinator;
  const canDeleteProducts = isManager;

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [usingProduct, setUsingProduct] = useState<Product | null>(null);
  const [usageQty, setUsageQty] = useState(0);

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
  function openUsage(p: Product) {
    setUsingProduct(p);
    setUsageQty(0);
  }
  function submitUsage() {
    if (!usingProduct || !currentUser || usageQty <= 0) return;
    logProductUsage(usingProduct.id, usageQty, currentUser.id);
    setUsingProduct(null);
    setUsageQty(0);
  }

  const columns: Column<Product>[] = [
    { key: "name", header: "اسم الصنف", render: (p) => <span className="font-semibold text-ink">{p.name}</span> },
    ...(canSeeFullView ? [{ key: "quantity", header: "الكمية", render: (p) => p.quantity } satisfies Column<Product>] : []),
    { key: "unit", header: "الوحدة", render: (p) => p.unit },
    ...(canSeeFullView
      ? ([
          { key: "min", header: "الحد الأدنى", render: (p) => p.minimumStock },
          {
            key: "remaining",
            header: "المتبقي",
            render: (p) => (
              <span className={p.currentStock <= p.minimumStock ? "font-semibold text-danger" : "text-ink"}>{p.currentStock}</span>
            ),
          },
          {
            key: "status",
            header: "حالة المخزون",
            render: (p) => (
              <StatusBadge label={stockStatusLabel(p.currentStock, p.minimumStock)} tone={stockStatusTone(p.currentStock, p.minimumStock)} />
            ),
          },
          { key: "notes", header: "ملاحظات", render: (p) => <span className="text-muted">{p.notes || "—"}</span> },
        ] satisfies Column<Product>[])
      : [{ key: "remaining", header: "المتبقي", render: (p) => p.currentStock } satisfies Column<Product>]),
    {
      key: "actions",
      header: "",
      render: (p) =>
        canEditProducts ? (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => openEdit(p)}
              aria-label="تعديل"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-bg hover:text-accent"
            >
              <Pencil size={15} />
            </button>
            {canDeleteProducts && (
              <button
                type="button"
                onClick={() => setDeletingProduct(p)}
                aria-label="حذف"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-danger-soft hover:text-danger"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => openUsage(p)} className="!px-3 !py-1.5 text-xs">
              <PackageMinus size={14} /> تسجيل استخدام
            </Button>
          </div>
        ),
      className: "text-end",
    },
  ];

  return (
    <AppShell title="المخزون">
      {canSeeFullView && lowStockCount > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
          <AlertTriangle size={16} /> {lowStockCount} صنف وصل إلى الحد الأدنى أو أقل — يحتاج إعادة طلب
        </div>
      )}

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="ابحث عن صنف..." className="w-64" />
            {canSeeFullView && (
              <Select
                value={stockFilter}
                onChange={setStockFilter}
                options={[
                  { value: "all", label: "كل الأصناف" },
                  { value: "low", label: "منخفض فقط" },
                  { value: "ok", label: "طبيعي فقط" },
                ]}
              />
            )}
          </div>
          {canEditProducts && (
            <Button onClick={openAdd}>
              <Plus size={16} /> إضافة صنف
            </Button>
          )}
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

      <Modal open={Boolean(usingProduct)} onClose={() => setUsingProduct(null)} title="تسجيل استخدام من المخزون">
        {usingProduct && (
          <div className="space-y-4">
            <p className="text-sm text-ink">
              الصنف: <span className="font-semibold">{usingProduct.name}</span> — المتبقي حاليًا: {usingProduct.currentStock}{" "}
              {usingProduct.unit}
            </p>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted">كم استخدمت؟</label>
              <Input
                type="number"
                min={0}
                max={usingProduct.currentStock}
                value={usageQty}
                onChange={(e) => setUsageQty(Number(e.target.value))}
                className="max-w-xs"
              />
            </div>
            <Button onClick={submitUsage} disabled={usageQty <= 0} className="w-full">
              تأكيد الاستخدام
            </Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
