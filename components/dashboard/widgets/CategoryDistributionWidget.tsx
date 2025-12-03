'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import ChartExportButton from '@/components/admin/ChartExportButton';

interface CategoryDistributionWidgetProps {
    data: any[];
}

const COLORS = ['#E8C4B8', '#D4816F', '#C19A6B'];

export default function CategoryDistributionWidget({ data }: CategoryDistributionWidgetProps) {
    return (
        <div className="h-[300px] w-full">
            <div className="absolute top-6 right-6 z-10">
                <ChartExportButton chartId="category-chart" filename="distribucion-categorias" />
            </div>
            <div id="category-chart" className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
