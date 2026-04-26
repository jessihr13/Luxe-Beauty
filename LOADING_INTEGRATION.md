# 🚀 Loading States - Quick Integration Script

## ✅ Completed (2/14)

- ✅ `app/admin/inventario/page.tsx`
- ✅ `app/admin/productos/nuevo/page.tsx`

## 📝 Integration Code (Copy-Paste Ready)

### For ALL pages with `if (!mounted)` - Add to imports:

```typescript
import { SkeletonTable } from "@/components/ui/Skeleton";
```

### Replace Pattern 1 (Simple spinner):

```typescript
// BEFORE:
if (!mounted) {
  return (
    <AdminPageLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold-600"></div>
      </div>
    </AdminPageLayout>
  );
}

// AFTER:
if (!mounted) {
  return (
    <AdminPageLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
        <SkeletonTable rows={10} />
      </div>
    </AdminPageLayout>
  );
}
```

### Replace Pattern 2 (Simple return null):

```typescript
// BEFORE:
if (!mounted) return null;

// AFTER:
if (!mounted) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold-600"></div>
    </div>
  );
}
```

### For Buttons - Add to imports:

```typescript
import { LoadingButton } from "@/components/ui/LoadingSpinner";
```

### Replace Button Pattern:

```typescript
// BEFORE:
<button
    type="submit"
    disabled={saving}
    className="btn-primary"
>
    {saving ? 'Guardando...' : 'Guardar'}
</button>

// AFTER:
<LoadingButton
    type="submit"
    loading={saving}
    className="btn-primary"
>
    <Save className="w-5 h-5" />
    {saving ? 'Guardando...' : 'Guardar'}
</LoadingButton>
```

## 🎯 Pages to Update (12 remaining)

1. ✅ `app/admin/dashboard/page.tsx` - Change return null to spinner
2. ⏳ `app/admin/reportes/rentabilidad/page.tsx` - Add SkeletonTable
3. ⏳ `app/admin/pedidos/page.tsx` - Add SkeletonTable
4. ⏳ `app/admin/marketing/page.tsx` - Add SkeletonTable
5. ⏳ `app/admin/inventario/movimientos/page.tsx` - Add SkeletonTable
6. ⏳ `app/admin/finanzas/reportes/page.tsx` - Add SkeletonTable
7. ⏳ `app/admin/finanzas/gastos/page.tsx` - Add SkeletonTable
8. ⏳ `app/admin/empleados/page.tsx` - Add SkeletonTable
9. ⏳ `app/admin/productos/[id]/page.tsx` - Add LoadingButton
10. ⏳ `app/admin/pedidos/[id]/page.tsx` - Add LoadingButton

## ✨ All components are ready - just need to import and use!
