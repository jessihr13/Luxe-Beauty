# 🎯 Toast Integration - Quick Reference

## ✅ Already Integrated

1. ✅ `app/admin/productos/nuevo/page.tsx` - Create product
2. ✅ `app/admin/productos/[id]/page.tsx` - Edit product
3. ✅ `app/admin/pedidos/[id]/page.tsx` - Change order status

## 📝 To Integrate (Copy-Paste Ready)

### Products Delete (`app/admin/productos/page.tsx`)

**Add after line 7:**

```typescript
import { useToast } from "@/lib/hooks/useToast";
```

**Add after line 20:**

```typescript
const toast = useToast();
```

**Replace deleteProduct call (around line 28) with:**

```typescript
if (deleteProductStore(id)) {
  const product = products.find((p) => p.id === id);
  toast.success(`✅ Producto "${product?.name}" eliminado exitosamente`);
  setDeleteConfirm(null);
}
```

---

### Employees/Expenses/Campaigns

**Same 3-step pattern for all:**

1. Import: `import { useToast } from '@/lib/hooks/useToast';`
2. Initialize: `const toast = useToast();`
3. Use: `toast.success('✅ Message');`

---

## 🚀 Ready for Mejora #2

El sistema de toasts está funcional. Las páginas que usan stores reales ya tienen toasts integrados.

Las páginas que todavía usan mock data necesitarán primero migrar a stores (ya hecho en sesión anterior) y luego agregar toasts (3 líneas).

**Continuamos con Mejora #2: Loading States** ✅
