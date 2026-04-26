/**
 * Datos mock para el sistema de puntos de lealtad
 */

import { LoyaltyAccount, createPointTransaction } from './pointsSystem';

// Cuenta de lealtad mock para el usuario de prueba
export const mockLoyaltyAccount: LoyaltyAccount = {
    userId: 'user_001',
    totalPoints: 2450,
    availablePoints: 2100,
    usedPoints: 350,
    tier: 'silver',
    tierProgress: 82,
    nextTierAt: 3000,
    history: [
        createPointTransaction('earn', 500, 'Bonus de primera compra', 'ORD-001'),
        createPointTransaction('earn', 150, 'Compra de $1,500', 'ORD-002'),
        createPointTransaction('earn', 50, 'Reseña con foto', 'ORD-002'),
        createPointTransaction('earn', 300, 'Referido exitoso'),
        createPointTransaction('earn', 200, 'Bonus de cumpleaños'),
        createPointTransaction('redeem', -200, 'Descuento en pedido', 'ORD-003'),
        createPointTransaction('earn', 180, 'Compra de $1,800', 'ORD-003'),
        createPointTransaction('earn', 120, 'Compra de $1,200', 'ORD-004'),
        createPointTransaction('redeem', -150, 'Descuento en pedido', 'ORD-005'),
        createPointTransaction('earn', 250, 'Compra de $2,500', 'ORD-005'),
        createPointTransaction('earn', 50, 'Reseña con foto', 'ORD-005'),
    ].reverse(), // Más recientes primero
};

// Función para obtener la cuenta de lealtad del usuario
export function getUserLoyaltyAccount(userId: string): LoyaltyAccount {
    // En producción, esto vendría de la base de datos
    return mockLoyaltyAccount;
}

// Función para actualizar puntos (mock)
export function updateUserPoints(
    userId: string,
    points: number,
    type: 'earn' | 'redeem',
    reason: string,
    orderId?: string
): LoyaltyAccount {
    const account = getUserLoyaltyAccount(userId);

    const transaction = createPointTransaction(type, points, reason, orderId);

    if (type === 'earn') {
        account.totalPoints += points;
        account.availablePoints += points;
    } else {
        account.availablePoints -= points;
        account.usedPoints += points;
    }

    account.history.unshift(transaction);

    return account;
}
