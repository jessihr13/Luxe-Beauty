'use client';

import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';
import type { ProductProfitability } from '@/lib/analytics/profitabilityAnalysis';

interface ProfitabilityScatterProps {
    profitability: ProductProfitability[];
}

export default function ProfitabilityScatter({ profitability }: ProfitabilityScatterProps) {
    const chartData = useMemo(() => {
        return profitability.map(p => ({
            name: p.productName.substring(0, 20),
            margin: p.grossMargin,
            revenue: p.revenue,
            profit: p.grossProfit,
            category: p.abcCategory,
        }));
    }, [profitability]);

    const getColor = (category: string) => {
        if (category === 'A') return '#10b981'; // Green
        if (category === 'B') return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    return (
        <div className="card-luxury p-6">
            <h3 className="text-xl font-semibold mb-4">Margen vs Ingresos (Análisis ABC)</h3>
            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="revenue"
                        name="Ingresos"
                        label={{ value: 'Ingresos ($)', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis
                        type="number"
                        dataKey="margin"
                        name="Margen"
                        label={{ value: 'Margen (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <ZAxis type="number" dataKey="profit" range={[50, 400]} />
                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                        <p className="font-semibold">{data.name}</p>
                                        <p className="text-sm">Ingresos: ${data.revenue.toLocaleString()}</p>
                                        <p className="text-sm">Margen: {data.margin.toFixed(1)}%</p>
                                        <p className="text-sm">Ganancia: ${data.profit.toLocaleString()}</p>
                                        <p className="text-sm">Categoría: {data.category}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend />
                    {['A', 'B', 'C'].map(category => (
                        <Scatter
                            key={category}
                            name={`Categoría ${category}`}
                            data={chartData.filter(d => d.category === category)}
                            fill={getColor(category)}
                        />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>

            {/* Leyenda ABC */}
            <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span><strong>A:</strong> Top 80% ganancias</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                    <span><strong>B:</strong> Siguiente 15%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span><strong>C:</strong> Último 5%</span>
                </div>
            </div>
        </div>
    );
}
