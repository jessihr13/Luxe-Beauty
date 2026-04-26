'use client';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/lib/store/useDashboardStore';
import WidgetWrapper from './WidgetWrapper';
import SortableWidget from './SortableWidget';
import dynamic from 'next/dynamic';

const MetricWidget = dynamic(() => import('./widgets/MetricWidget'), { loading: () => <div className="h-full w-full animate-pulse bg-gray-50 rounded-lg" /> });
const SalesTrendWidget = dynamic(() => import('./widgets/SalesTrendWidget'), { loading: () => <div className="h-full w-full animate-pulse bg-gray-50 rounded-lg" /> });
const CategoryDistributionWidget = dynamic(() => import('./widgets/CategoryDistributionWidget'), { loading: () => <div className="h-full w-full animate-pulse bg-gray-50 rounded-lg" /> });
const TopProductsWidget = dynamic(() => import('./widgets/TopProductsWidget'), { loading: () => <div className="h-full w-full animate-pulse bg-gray-50 rounded-lg" /> });
const ProductPerformanceWidget = dynamic(() => import('./widgets/ProductPerformanceWidget'), { loading: () => <div className="h-full w-full animate-pulse bg-gray-50 rounded-lg" /> });

interface DashboardGridProps {
    data: {
        metrics: any;
        salesData: any[];
        categoryData: any[];
        topProducts: any[];
        products: any[];
    };
}

export default function DashboardGrid({ data }: DashboardGridProps) {
    const {
        layouts,
        currentDevice,
        setDevice,
        updateWidgetOrder,
        isEditMode
    } = useDashboardStore();

    const widgets = layouts[currentDevice];
    const [activeId, setActiveId] = useState<string | null>(null);

    // Detect device type
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            const newDevice = isMobile ? 'mobile' : 'desktop';
            if (newDevice !== currentDevice) {
                setDevice(newDevice);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentDevice, setDevice]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = widgets.findIndex((w) => w.id === active.id);
            const newIndex = widgets.findIndex((w) => w.id === over.id);
            updateWidgetOrder(arrayMove(widgets, oldIndex, newIndex));
        }

        setActiveId(null);
    };

    // Filter visible widgets unless in edit mode
    const visibleWidgets = isEditMode ? widgets : widgets.filter(w => w.visible);

    const renderWidgetContent = (widget: any) => {
        switch (widget.type) {
            case 'KPI_REVENUE':
                return <MetricWidget
                    title="Ingresos Totales"
                    value={`$${data.metrics.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                    change={12.5}
                    icon="💰"
                    color="green"
                />;
            case 'KPI_PROFIT':
                return <MetricWidget
                    title="Ganancia Bruta"
                    value={`$${data.metrics.grossProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                    change={8.3}
                    icon="📈"
                    color="blue"
                />;
            case 'KPI_NET':
                return <MetricWidget
                    title="Ganancia Neta"
                    value={`$${data.metrics.netProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                    change={5.2}
                    icon="✨"
                    color="rose"
                />;
            case 'KPI_MARGIN':
                return <MetricWidget
                    title="Margen Neto"
                    value={`${data.metrics.netMargin.toFixed(1)}%`}
                    change={-3.1}
                    icon="📊"
                    color="terracotta"
                />;
            case 'CHART_SALES':
                return <SalesTrendWidget data={data.salesData} />;
            case 'CHART_CATEGORIES':
                return <CategoryDistributionWidget data={data.categoryData} />;
            case 'CHART_TOP_PRODUCTS':
                return <TopProductsWidget data={data.topProducts} />;
            case 'TABLE_PERFORMANCE':
                return <ProductPerformanceWidget products={data.products} />;
            default:
                return <div>Widget no encontrado</div>;
        }
    };

    const getGridClass = (size: string) => {
        switch (size) {
            case 'small': return 'col-span-1';
            case 'medium': return 'col-span-1 md:col-span-2';
            case 'large': return 'col-span-1 md:col-span-3';
            case 'full': return 'col-span-1 md:col-span-4';
            default: return 'col-span-1';
        }
    };

    if (!isEditMode) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleWidgets.map((widget) => (
                    <div key={widget.id} className={getGridClass(widget.size)}>
                        <WidgetWrapper id={widget.id} title={widget.title}>
                            {renderWidgetContent(widget)}
                        </WidgetWrapper>
                    </div>
                ))}
            </div>
        );
    }

    const activeWidget = widgets.find(w => w.id === activeId);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={widgets.map(w => w.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {widgets.map((widget) => (
                        <SortableWidget
                            key={widget.id}
                            widget={widget}
                            className={getGridClass(widget.size)}
                        >
                            {renderWidgetContent(widget)}
                        </SortableWidget>
                    ))}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeId && activeWidget ? (
                    <div className="opacity-80">
                        <WidgetWrapper id={activeWidget.id} title={activeWidget.title} className="bg-white shadow-2xl">
                            {renderWidgetContent(activeWidget)}
                        </WidgetWrapper>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
