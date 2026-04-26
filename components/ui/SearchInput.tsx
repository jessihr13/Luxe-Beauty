// Search Input Component with Debounce
// components/ui/SearchInput.tsx

'use client';

import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    delay?: number;
    showLoading?: boolean;
    className?: string;
}

export function SearchInput({
    value,
    onChange,
    placeholder = 'Buscar...',
    delay = 300,
    showLoading = true,
    className = '',
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedValue = useDebounce(localValue, delay);

    // Update parent when debounced value changes
    useEffect(() => {
        if (debouncedValue !== value) {
            onChange(debouncedValue);
            setIsSearching(false);
        }
    }, [debouncedValue, onChange, value]);

    // Show loading indicator while typing
    useEffect(() => {
        if (localValue !== debouncedValue && localValue !== value) {
            setIsSearching(true);
        }
    }, [localValue, debouncedValue, value]);

    const handleClear = () => {
        setLocalValue('');
        onChange('');
        setIsSearching(false);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
            </div>
            
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent transition-all"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {showLoading && isSearching ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                ) : localValue ? (
                    <button
                        onClick={handleClear}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                ) : null}
            </div>
        </div>
    );
}

// Simplified version without loading indicator
export function SimpleSearchInput({
    value,
    onChange,
    placeholder = 'Buscar...',
    delay = 300,
}: Omit<SearchInputProps, 'showLoading' | 'className'>) {
    return (
        <SearchInput
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            delay={delay}
            showLoading={false}
        />
    );
}
