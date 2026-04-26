import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';
export type DeviceType = 'desktop' | 'mobile';

export interface DashboardWidget {
    id: string;
    type: string;
    title: string;
    size: WidgetSize;
    order: number;
    visible: boolean;
}

interface DashboardState {
    // State
    currentDevice: DeviceType;
    layouts: {
        desktop: DashboardWidget[];
        mobile: DashboardWidget[];
    };
    isEditMode: boolean;
    dateRange: {
        start: Date | null;
        end: Date | null;
    };

    // Actions
    setDevice: (device: DeviceType) => void;
    toggleEditMode: () => void;
    addWidget: (type: string, title: string, size: WidgetSize) => void;
    removeWidget: (id: string) => void;
    updateWidgetOrder: (widgets: DashboardWidget[]) => void;
    toggleWidgetVisibility: (id: string) => void;
    setDateRange: (start: Date | null, end: Date | null) => void;
    resetLayout: () => void;

    // Helper to get current widgets
    getWidgets: () => DashboardWidget[];
}

const DEFAULT_WIDGETS_DESKTOP: DashboardWidget[] = [
    { id: 'kpi-revenue', type: 'KPI_REVENUE', title: 'Ingresos Totales', size: 'small', order: 0, visible: true },
    { id: 'kpi-profit', type: 'KPI_PROFIT', title: 'Ganancia Bruta', size: 'small', order: 1, visible: true },
    { id: 'kpi-net', type: 'KPI_NET', title: 'Ganancia Neta', size: 'small', order: 2, visible: true },
    { id: 'kpi-margin', type: 'KPI_MARGIN', title: 'Margen Neto', size: 'small', order: 3, visible: true },
    { id: 'chart-sales', type: 'CHART_SALES', title: 'Ventas vs Gastos', size: 'medium', order: 4, visible: true },
    { id: 'chart-categories', type: 'CHART_CATEGORIES', title: 'Distribución por Categoría', size: 'medium', order: 5, visible: true },
    { id: 'chart-top', type: 'CHART_TOP_PRODUCTS', title: 'Top 5 Productos', size: 'full', order: 6, visible: true },
    { id: 'table-performance', type: 'TABLE_PERFORMANCE', title: 'Rendimiento por Producto', size: 'full', order: 7, visible: true },
];

const DEFAULT_WIDGETS_MOBILE: DashboardWidget[] = DEFAULT_WIDGETS_DESKTOP.map(w => ({
    ...w,
    size: 'full', // Force full width on mobile
    visible: true
}));

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set, get) => ({
            currentDevice: 'desktop',
            layouts: {
                desktop: DEFAULT_WIDGETS_DESKTOP,
                mobile: DEFAULT_WIDGETS_MOBILE,
            },
            isEditMode: false,
            dateRange: { start: null, end: null },

            setDevice: (device) => set({ currentDevice: device }),

            toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

            getWidgets: () => {
                const state = get();
                return state.layouts[state.currentDevice];
            },

            addWidget: (type, title, size) => set((state) => {
                const newWidget: DashboardWidget = {
                    id: `${type.toLowerCase()}-${Date.now()}`,
                    type,
                    title,
                    size,
                    order: state.layouts[state.currentDevice].length,
                    visible: true,
                };

                return {
                    layouts: {
                        ...state.layouts,
                        [state.currentDevice]: [...state.layouts[state.currentDevice], newWidget]
                    }
                };
            }),

            removeWidget: (id) => set((state) => ({
                layouts: {
                    ...state.layouts,
                    [state.currentDevice]: state.layouts[state.currentDevice].filter((w) => w.id !== id)
                }
            })),

            updateWidgetOrder: (widgets) => set((state) => ({
                layouts: {
                    ...state.layouts,
                    [state.currentDevice]: widgets
                }
            })),

            toggleWidgetVisibility: (id) => set((state) => ({
                layouts: {
                    ...state.layouts,
                    [state.currentDevice]: state.layouts[state.currentDevice].map((w) =>
                        w.id === id ? { ...w, visible: !w.visible } : w
                    )
                }
            })),

            setDateRange: (start, end) => set({ dateRange: { start, end } }),

            resetLayout: () => set((state) => ({
                layouts: {
                    ...state.layouts,
                    [state.currentDevice]: state.currentDevice === 'desktop' ? DEFAULT_WIDGETS_DESKTOP : DEFAULT_WIDGETS_MOBILE
                }
            })),
        }),
        {
            name: 'dashboard-storage-v2', // Changed version to reset storage
            partialize: (state) => ({ layouts: state.layouts }),
        }
    )
);
