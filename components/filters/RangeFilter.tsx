'use client';

interface RangeFilterProps {
    label: string;
    min: number;
    max: number;
    value: { min: number; max: number };
    onChange: (value: { min: number; max: number }) => void;
    step?: number;
    prefix?: string;
    suffix?: string;
}

export default function RangeFilter({
    label,
    min,
    max,
    value,
    onChange,
    step = 1,
    prefix = '',
    suffix = ''
}: RangeFilterProps) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                    <div className="relative">
                        {prefix && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {prefix}
                            </span>
                        )}
                        <input
                            type="number"
                            min={min}
                            max={value.max}
                            step={step}
                            value={value.min}
                            onChange={(e) => onChange({ ...value, min: Number(e.target.value) })}
                            className={`w-full ${prefix ? 'pl-7' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent`}
                        />
                        {suffix && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {suffix}
                            </span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                    <div className="relative">
                        {prefix && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {prefix}
                            </span>
                        )}
                        <input
                            type="number"
                            min={value.min}
                            max={max}
                            step={step}
                            value={value.max}
                            onChange={(e) => onChange({ ...value, max: Number(e.target.value) })}
                            className={`w-full ${prefix ? 'pl-7' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent`}
                        />
                        {suffix && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {suffix}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
                {prefix}{value.min}{suffix} - {prefix}{value.max}{suffix}
            </div>
        </div>
    );
}
