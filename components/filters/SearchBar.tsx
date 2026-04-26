'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Buscar...',
    className = ''
}: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className={`relative ${className}`}>
            <div className={`relative flex items-center border rounded-lg transition-all ${isFocused ? 'border-rose-gold-500 ring-2 ring-rose-gold-100' : 'border-gray-300'
                }`}>
                <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 bg-transparent focus:outline-none"
                />
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
