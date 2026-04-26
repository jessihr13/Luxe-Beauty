'use client';

import { Download } from 'lucide-react';
import { exportChartToPNG } from '@/lib/utils/export-utils';

interface ChartExportButtonProps {
    chartId: string;
    filename: string;
    className?: string;
}

export default function ChartExportButton({ chartId, filename, className = '' }: ChartExportButtonProps) {
    const handleExport = async () => {
        await exportChartToPNG(chartId, filename);
    };

    return (
        <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
            title="Exportar gráfico como imagen"
        >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar PNG</span>
        </button>
    );
}
