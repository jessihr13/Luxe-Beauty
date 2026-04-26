// Form Field Component with Validation
// components/ui/FormField.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
    label: string;
    name: string;
    value: any;
    error?: string;
    touched?: boolean;
    type?: 'text' | 'email' | 'number' | 'tel' | 'url' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    onChange: (name: string, value: any) => void;
    onBlur: (name: string) => void;
    options?: { value: string; label: string }[];
    rows?: number;
    disabled?: boolean;
    helpText?: string;
}

export function FormField({
    label,
    name,
    value,
    error,
    touched,
    type = 'text',
    placeholder,
    required,
    onChange,
    onBlur,
    options,
    rows = 4,
    disabled,
    helpText,
}: FormFieldProps) {
    const hasError = touched && error;

    const baseInputClasses = `
        w-full px-4 py-3 border rounded-lg transition-all duration-200
        focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${hasError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 hover:border-gray-400'
        }
    `;

    const renderInput = () => {
        if (type === 'textarea') {
            return (
                <textarea
                    id={name}
                    name={name}
                    value={value || ''}
                    onChange={(e) => onChange(name, e.target.value)}
                    onBlur={() => onBlur(name)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    className={baseInputClasses}
                />
            );
        }

        if (type === 'select' && options) {
            return (
                <select
                    id={name}
                    name={name}
                    value={value || ''}
                    onChange={(e) => onChange(name, e.target.value)}
                    onBlur={() => onBlur(name)}
                    disabled={disabled}
                    className={baseInputClasses}
                >
                    <option value="">Seleccionar...</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                id={name}
                name={name}
                type={type}
                value={value || ''}
                onChange={(e) => {
                    const newValue = type === 'number' ? parseFloat(e.target.value) : e.target.value;
                    onChange(name, newValue);
                }}
                onBlur={() => onBlur(name)}
                placeholder={placeholder}
                disabled={disabled}
                className={baseInputClasses}
            />
        );
    };

    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-sm font-semibold text-gray-700"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {renderInput()}

            {/* Help Text */}
            {helpText && !hasError && (
                <p className="text-xs text-gray-500">{helpText}</p>
            )}

            {/* Error Message */}
            <AnimatePresence>
                {hasError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-red-600 text-sm"
                    >
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Simplified wrapper for common use cases
export function TextField(props: Omit<FormFieldProps, 'type'>) {
    return <FormField {...props} type="text" />;
}

export function EmailField(props: Omit<FormFieldProps, 'type'>) {
    return <FormField {...props} type="email" />;
}

export function NumberField(props: Omit<FormFieldProps, 'type'>) {
    return <FormField {...props} type="number" />;
}

export function TextAreaField(props: Omit<FormFieldProps, 'type'>) {
    return <FormField {...props} type="textarea" />;
}

export function SelectField(props: Omit<FormFieldProps, 'type'>) {
    return <FormField {...props} type="select" />;
}
