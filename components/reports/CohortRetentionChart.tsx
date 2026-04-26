'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CohortData } from '@/lib/analytics/cohortAnalysis';

interface CohortRetentionChartProps {
    cohortData: CohortData[];
}

export default function CohortRetentionChart({ cohortData }: CohortRetentionChartProps) {
    const chartData = useMemo(() => {
        const months = 12;
        const data = [];

        for (let i = 0; i <= months; i++) {
            const monthData: any = { month: `Mes ${i}` };

            cohortData.forEach(cohort => {
                const retention = cohort.retention[`month${i}`];
                if (retention !== undefined) {
                    monthData[cohort.cohortMonth] = retention.toFixed(1);
                }
            });

            data.push(monthData);
        }

        return data;
    }, [cohortData]);

    const colors = [
        '#d4816f', // Rose gold
        '#e8c4b8', // Nude
        '#10b981', // Green
        '#3b82f6', // Blue
        '#f59e0b', // Amber
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#06b6d4', // Cyan
    ];

    return (
        <div className="card-luxury p-6">
            <h3 className="text-xl font-semibold mb-4">Retención por Cohorte</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Retención (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {cohortData.map((cohort, index) => (
                        <Line
                            key={cohort.cohortMonth}
                            type="monotone"
                            dataKey={cohort.cohortMonth}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
