'use client';

import { useMemo } from 'react';
import type { CohortData } from '@/lib/analytics/cohortAnalysis';

interface CohortHeatmapProps {
    cohortData: CohortData[];
}

export default function CohortHeatmap({ cohortData }: CohortHeatmapProps) {
    const maxMonths = 12;

    const getColor = (retention: number): string => {
        if (retention >= 80) return 'bg-green-600';
        if (retention >= 60) return 'bg-green-500';
        if (retention >= 40) return 'bg-yellow-500';
        if (retention >= 20) return 'bg-orange-500';
        if (retention > 0) return 'bg-red-500';
        return 'bg-gray-200';
    };

    return (
        <div className="card-luxury p-6 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Heatmap de Retención</h3>
            <div className="min-w-max">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 bg-gray-50 text-left">Cohorte</th>
                            <th className="border border-gray-300 px-4 py-2 bg-gray-50 text-center">Clientes</th>
                            {Array.from({ length: maxMonths + 1 }, (_, i) => (
                                <th key={i} className="border border-gray-300 px-3 py-2 bg-gray-50 text-center text-sm">
                                    M{i}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {cohortData.map((cohort) => (
                            <tr key={cohort.cohortMonth}>
                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                    {cohort.cohortMonth}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {cohort.customersCount}
                                </td>
                                {Array.from({ length: maxMonths + 1 }, (_, i) => {
                                    const retention = cohort.retention[`month${i}`];
                                    return (
                                        <td
                                            key={i}
                                            className={`border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white ${getColor(retention || 0)}`}
                                            title={`${retention?.toFixed(1)}%`}
                                        >
                                            {retention !== undefined ? `${retention.toFixed(0)}%` : '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Leyenda */}
            <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="font-medium">Leyenda:</span>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600"></div>
                    <span>80%+</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500"></div>
                    <span>60-79%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500"></div>
                    <span>40-59%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500"></div>
                    <span>20-39%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span>0-19%</span>
                </div>
            </div>
        </div>
    );
}
