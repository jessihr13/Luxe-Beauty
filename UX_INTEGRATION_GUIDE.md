# 🚀 Quick UX Integration Guide

## Copy-Paste Ready Code

### 1. Employees List Page (`app/admin/empleados/page.tsx`)

**Add to imports:**

```typescript
import { useToast } from "@/lib/hooks/useToast";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
```

**Add after other hooks:**

```typescript
const toast = useToast();
const [deleteConfirm, setDeleteConfirm] = useState<{
  id: string;
  name: string;
} | null>(null);
```

**Replace loading state:**

```typescript
if (!mounted) {
  return (
    <AdminPageLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
        <SkeletonTable rows={8} />
      </div>
    </AdminPageLayout>
  );
}
```

**Update delete handler:**

```typescript
const handleDelete = (id: string, name: string) => {
  deleteEmployee(id);
  setDeleteConfirm(null);
  toast.success(`✅ Empleado "${name}" eliminado exitosamente`);
};
```

**Add modal before closing tag:**

```typescript
<ConfirmModal
  isOpen={!!deleteConfirm}
  onClose={() => setDeleteConfirm(null)}
  onConfirm={() => handleDelete(deleteConfirm!.id, deleteConfirm!.name)}
  title="¿Eliminar empleado?"
  message={`¿Estás seguro de eliminar a ${deleteConfirm?.name}? Esta acción no se puede deshacer.`}
  type="danger"
  confirmText="Eliminar"
/>
```

---

### 2. Employees Create Page (`app/admin/empleados/nuevo/page.tsx`)

**Add to imports:**

```typescript
import { useToast } from "@/lib/hooks/useToast";
import { LoadingButton } from "@/components/ui/LoadingSpinner";
```

**Add after other hooks:**

```typescript
const toast = useToast();
```

**Update submit handler:**

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    addEmployee(formData);
    toast.success(`✅ Empleado "${formData.name}" creado exitosamente`);
    router.push("/admin/empleados");
  } catch (error) {
    toast.error("❌ Error al crear el empleado");
  } finally {
    setSaving(false);
  }
};
```

**Replace submit button:**

```typescript
<LoadingButton
  type="submit"
  loading={saving}
  className="btn-primary flex items-center gap-2"
>
  <Save className="w-5 h-5" />
  {saving ? "Guardando..." : "Crear Empleado"}
</LoadingButton>
```

---

### 3. Same Pattern for All Other Pages

**Expenses, Marketing, Reports** - Use the same patterns above:

- List pages: SkeletonTable + Toast + ConfirmModal
- Create/Edit pages: LoadingButton + Toast
- Reports: SkeletonCard + Toast for exports

---

## ✅ Integration Checklist

- [ ] Employees List - SkeletonTable, Toast, Modal
- [ ] Employees Create - LoadingButton, Toast
- [ ] Employees Edit - LoadingButton, Toast
- [ ] Expenses List - SkeletonTable, Toast, Modal
- [ ] Expenses Create - LoadingButton, Toast
- [ ] Marketing List - SkeletonTable, Toast, Modal
- [ ] Marketing Create - LoadingButton, Toast
- [ ] Marketing Edit - LoadingButton, Toast
- [ ] Reports Rentabilidad - SkeletonCard, Toast
- [ ] Reports Finanzas - SkeletonCard, Toast
- [ ] Inventory Movements - SkeletonTable, Toast
- [ ] Dashboard - SkeletonCard, Toast

**Total: 0/12 pages integrated**
