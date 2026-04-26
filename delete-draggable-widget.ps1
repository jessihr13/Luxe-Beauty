# Script para eliminar archivo obsoleto DraggableWidget.tsx
# Este archivo fue reemplazado por SortableWidget.tsx que usa dnd-kit

Remove-Item "d:\Users\josep\OneDrive\Desktop\Pagina web maquillaje\components\dashboard\DraggableWidget.tsx" -Force

Write-Host "✓ Archivo DraggableWidget.tsx eliminado exitosamente" -ForegroundColor Green
Write-Host "Este archivo era obsoleto y usaba Framer Motion." -ForegroundColor Yellow
Write-Host "Ahora usamos SortableWidget.tsx con dnd-kit" -ForegroundColor Yellow
