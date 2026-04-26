'use client';

import { useDashboardStore } from '@/lib/store/useDashboardStore';
import { GripVertical, X, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CSS } from '@dnd-kit/utilities';

interface WidgetWrapperProps {
    id: string;
    title: string;
    children: React.ReactNode;
    className?: string;
    // dnd-kit props
    attributes?: any;
    listeners?: any;
    setNodeRef?: (node: HTMLElement | null) => void;
    transform?: any;
    transition?: any;
    isDragging?: boolean;
}

export default function WidgetWrapper({
    id,
    title,
    children,
    className,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
}: WidgetWrapperProps) {
    const { isEditMode, removeWidget, toggleWidgetVisibility, getWidgets } = useDashboardStore();
    const widget = getWidgets().find(w => w.id === id);

    if (!widget?.visible && !isEditMode) return null;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "card-luxury p-6 relative group transition-all duration-200 h-full flex flex-col dark:bg-luxe-dark-800 dark:border-luxe-dark-700",
                isEditMode && "border-2 border-dashed border-rose-gold-300 hover:border-rose-gold-500 bg-white dark:bg-luxe-dark-800 shadow-lg",
                !widget?.visible && isEditMode && "opacity-50 grayscale",
                className
            )}
        >
            {isEditMode && (
                <div className="absolute top-2 right-2 flex items-center gap-2 z-10 bg-white/80 backdrop-blur-sm p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => toggleWidgetVisibility(id)}
                        className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-700"
                        title={widget?.visible ? "Ocultar" : "Mostrar"}
                    >
                        {widget?.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => removeWidget(id)}
                        className="p-1.5 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-500"
                        title="Eliminar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div
                        className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-gray-600 touch-none"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="w-4 h-4" />
                    </div>
                </div>
            )}

            {title && (
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    {title && (
                        <div className="flex items-center justify-between mb-4 flex-shrink-0">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-100">{title}</h3>
                        </div>
                    )}
                </div>
            )}

            <div className={cn("transition-opacity flex-1 min-h-0", !widget?.visible && isEditMode && "opacity-50")}>
                {children}
            </div>
        </div>
    );
}
