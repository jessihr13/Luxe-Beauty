'use client';

import MetricCard from '@/components/admin/MetricCard';

interface MetricWidgetProps {
    title: string;
    value: string;
    change: number;
    icon: string;
    color: 'green' | 'blue' | 'rose' | 'terracotta';
}

export default function MetricWidget(props: MetricWidgetProps) {
    return <MetricCard {...props} />;
}
