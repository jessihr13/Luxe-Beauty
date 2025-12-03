'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DemandForecast } from '@/lib/analytics/demandPrediction';

interface DemandForecastChartProps {
    forecast: DemandForecast;
}

export default function DemandForecastChart({ forecast }: DemandForecastChartProps) {
    const chartData = useMemo(() => {
        const data: Array<{
            month: string;
            historical: number | null;
            predicted: number | null;
        }> = [];

        // Datos históricos
        forecast.historicalSales.forEach((sales, index) => {
            data.push({
                month: `Mes ${index - forecast.historicalSales.length + 1}`,
                historical: sales,
                predicted: null,
            });
        });

        // Datos predichos
        forecast.predictedSales.forEach((sales, index) => {
            data.push({
                month: `Mes +${index + 1}`,
                historical: null,
                predicted: sales,
            });
        });

        return data;
    }, [forecast]);

    const getTrendColor = () => {
        if (forecast.trend === 'increasing') return '#10b981';
        if (forecast.trend === 'decreasing') return '#ef4444';
        return '#6b7280';
    };

    const getTrendIcon = () => {
        if (forecast.trend === 'increasing') return '📈';
        if (forecast.trend === 'decreasing') return '📉';
        return '➡️';
    };

    return (
        <div className="card-luxury p-6">
            <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{forecast.productName}</h3>
                <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                        {getTrendIcon()} <strong>Tendencia:</strong> {forecast.trend === 'increasing' ? 'Creciente' : forecast.trend === 'decreasing' ? 'Decreciente' : 'Estable'}
                    </span>
                    <span>
                        <strong>Confianza:</strong> {forecast.confidence.toFixed(1)}%
                    </span>
                    <span>
                        <strong>Stock Recomendado:</strong> {forecast.recommendedStock} unidades
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="historical"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Histórico"
                        dot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke={getTrendColor()}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicción"
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
