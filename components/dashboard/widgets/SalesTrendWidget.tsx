'use client';

import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from 'recharts';
import ChartExportButton from '@/components/admin/ChartExportButton';

interface SalesTrendWidgetProps {
    data: any[];
}

export default function SalesTrendWidget({ data }: SalesTrendWidgetProps) {
    return (
        <div className="h-[300px] w-full">
            <div className="absolute top-6 right-6 z-10">
                <ChartExportButton chartId="sales-trend-chart" filename="ventas-gastos" />
            </div>
            <div id="sales-trend-chart" className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="ventas" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                        <Area type="monotone" dataKey="gastos" stackId="2" stroke="#ff8042" fill="#ff8042" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
