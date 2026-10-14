import { useEffect, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Field, { Input, Textarea } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { useOpsStore } from "@/store/opsStore";
import { useAuthStore } from "@/store/authStore";
import type { Product } from "@/types/domain";

const EMPTY_FORM = { name: "", unit: "", quantity: 0, minimumStock: 0, notes: "" };

export default function ProductFormDrawer({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}) {
  const addProduct = useOpsStore((s) => s.addProduct);
  const updateProduct = useOpsStore((s) => s.updateProduct);
  const currentUser = useAuthStore((s) => s.currentUser);
  const isEdit = Boolean(product);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    setForm(
      product
        ? { name: product.name, unit: product.unit, quantity: product.quantity, minimumStock: product.minimumStock, notes: product.notes }
        : EMPTY_FORM
    );
  }, [open, product]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !currentUser) return;
    if (isEdit && product) {
      updateProduct(product.id, form, currentUser.id);
    } else {
      addProduct(form, currentUser.id);
    }
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? "تعديل صنف" : "إضافة صنف"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="اسم الصنف">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="الوحدة">
            <Input value={form.unit} onChange={(e) => set("unit", e.target.value)} placeholder="جالون / قطعة / كرتون" />
          </Field>
          <Field label="الكمية">
            <Input type="number" min={0} value={form.quantity} onChange={(e) => set("quantity", Number(e.target.value))} />
          </Field>
        </div>
        <Field label="الحد الأدنى للمخزون">
          <Input type="number" min={0} value={form.minimumStock} onChange={(e) => set("minimumStock", Number(e.target.value))} />
        </Field>
        {isEdit && (
          <p className="text-xs text-muted">
            تنبيه: تغيير الكمية هنا يعيد ضبط "المتبقي" ليطابقها — استخدمي هذا لإعادة التخزين، مو لتسجيل استخدام.
          </p>
        )}
        <Field label="ملاحظات">
          <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
        <Button type="submit" className="w-full">
          {isEdit ? "حفظ التعديلات" : "إضافة الصنف"}
        </Button>
      </form>
    </Drawer>
  );
}
