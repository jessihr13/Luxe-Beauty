'use client';

import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface TopProductsWidgetProps {
    data: any[];
}

export default function TopProductsWidget({ data }: TopProductsWidgetProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#E8C4B8" name="Unidades Vendidas" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
