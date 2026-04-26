/**
 * Form Validation Functions for Checkout
 */

import { ShippingInfo, PaymentMethod, FormErrors } from './types';

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it has 10 digits (US format)
    return digitsOnly.length === 10;
}

export function validateZipCode(zipCode: string): boolean {
    // US zip code format: 12345 or 12345-6789
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
}

export function validateCardNumber(cardNumber: string): boolean {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    // Check if it's 13-19 digits
    return /^\d{13,19}$/.test(cleaned);
}

export function validateExpiryDate(expiryDate: string): boolean {
    // Format: MM/YY
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
}

export function validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
}

export function validateShippingInfo(shipping: Partial<ShippingInfo>): FormErrors {
    const errors: FormErrors = {};
    
    if (!shipping.fullName || shipping.fullName.trim().length < 2) {
        errors.fullName = 'El nombre completo es requerido';
    }
    
    if (!shipping.email || !validateEmail(shipping.email)) {
        errors.email = 'Email inválido';
    }
    
    if (!shipping.phone || !validatePhone(shipping.phone)) {
        errors.phone = 'Teléfono inválido (10 dígitos)';
    }
    
    if (!shipping.address?.street || shipping.address.street.trim().length < 5) {
        errors.street = 'Dirección inválida';
    }
    
    if (!shipping.address?.city || shipping.address.city.trim().length < 2) {
        errors.city = 'Ciudad requerida';
    }
    
    if (!shipping.address?.state || shipping.address.state.trim().length < 2) {
        errors.state = 'Estado requerido';
    }
    
    if (!shipping.address?.zipCode || !validateZipCode(shipping.address.zipCode)) {
        errors.zipCode = 'Código postal inválido';
    }
    
    return errors;
}

export function validatePaymentInfo(payment: Partial<PaymentMethod>): FormErrors {
    const errors: FormErrors = {};
    
    if (!payment.type) {
        errors.type = 'Selecciona un método de pago';
        return errors;
    }
    
    if (payment.type === 'card' && payment.cardDetails) {
        const { cardNumber, cardHolder, expiryDate, cvv } = payment.cardDetails;
        
        if (!cardNumber || !validateCardNumber(cardNumber)) {
            errors.cardNumber = 'Número de tarjeta inválido';
        }
        
        if (!cardHolder || cardHolder.trim().length < 3) {
            errors.cardHolder = 'Nombre del titular requerido';
        }
        
        if (!expiryDate || !validateExpiryDate(expiryDate)) {
            errors.expiryDate = 'Fecha de expiración inválida (MM/YY)';
        }
        
        if (!cvv || !validateCVV(cvv)) {
            errors.cvv = 'CVV inválido (3-4 dígitos)';
        }
    }
    
    return errors;
}

export function hasErrors(errors: FormErrors): boolean {
    return Object.keys(errors).length > 0;
}
