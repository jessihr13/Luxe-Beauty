// Form Validation Hook and Components
// lib/hooks/useFormValidation.tsx

'use client';

import { useState, useCallback } from 'react';

export type ValidationRule = {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    email?: boolean;
    phone?: boolean;
    url?: boolean;
    custom?: (value: any) => string | null;
};

export type FieldValidation = {
    [key: string]: ValidationRule;
};

export type FormErrors = {
    [key: string]: string;
};

export function useFormValidation<T extends Record<string, any>>(
    initialValues: T,
    validationRules: FieldValidation
) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateField = useCallback(
        (name: string, value: any): string => {
            const rules = validationRules[name];
            if (!rules) return '';

            // Required
            if (rules.required && (!value || value.toString().trim() === '')) {
                return 'Este campo es requerido';
            }

            // Skip other validations if empty and not required
            if (!value) return '';

            // Min length
            if (rules.minLength && value.length < rules.minLength) {
                return `Mínimo ${rules.minLength} caracteres`;
            }

            // Max length
            if (rules.maxLength && value.length > rules.maxLength) {
                return `Máximo ${rules.maxLength} caracteres`;
            }

            // Min value
            if (rules.min !== undefined && Number(value) < rules.min) {
                return `Valor mínimo: ${rules.min}`;
            }

            // Max value
            if (rules.max !== undefined && Number(value) > rules.max) {
                return `Valor máximo: ${rules.max}`;
            }

            // Email
            if (rules.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Email inválido';
                }
            }

            // Phone
            if (rules.phone) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(value)) {
                    return 'Teléfono inválido';
                }
            }

            // URL
            if (rules.url) {
                try {
                    new URL(value);
                } catch {
                    return 'URL inválida';
                }
            }

            // Pattern
            if (rules.pattern && !rules.pattern.test(value)) {
                return 'Formato inválido';
            }

            // Custom validation
            if (rules.custom) {
                const customError = rules.custom(value);
                if (customError) return customError;
            }

            return '';
        },
        [validationRules]
    );

    const handleChange = useCallback(
        (name: string, value: any) => {
            setValues((prev) => ({ ...prev, [name]: value }));

            // Validate on change if field was touched
            if (touched[name]) {
                const error = validateField(name, value);
                setErrors((prev) => ({ ...prev, [name]: error }));
            }
        },
        [touched, validateField]
    );

    const handleBlur = useCallback(
        (name: string) => {
            setTouched((prev) => ({ ...prev, [name]: true }));
            const error = validateField(name, values[name]);
            setErrors((prev) => ({ ...prev, [name]: error }));
        },
        [values, validateField]
    );

    const validateAll = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach((name) => {
            const error = validateField(name, values[name]);
            if (error) {
                newErrors[name] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched(
            Object.keys(validationRules).reduce(
                (acc, key) => ({ ...acc, [key]: true }),
                {}
            )
        );

        return isValid;
    }, [values, validationRules, validateField]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll,
        reset,
        setValues,
    };
}
