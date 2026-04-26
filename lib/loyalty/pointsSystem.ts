/**
 * Sistema de Puntos de Lealtad
 * Maneja la lógica de ganancia, redención y niveles VIP
 */

export type TierLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface PointTransaction {
    id: string;
    type: 'earn' | 'redeem';
    points: number;
    reason: string;
    orderId?: string;
    createdAt: Date;
}

export interface LoyaltyAccount {
    userId: string;
    totalPoints: number;
    availablePoints: number;
    usedPoints: number;
    tier: TierLevel;
    tierProgress: number; // 0-100%
    nextTierAt: number;
    history: PointTransaction[];
}

export interface TierConfig {
    name: string;
    minPoints: number;
    maxPoints: number;
    benefits: {
        discountPercentage: number;
        freeShipping: boolean;
        earlyAccess: boolean;
        birthdayBonus: number;
    };
    color: string;
    icon: string;
}

// Configuración de niveles VIP
export const TIER_CONFIGS: Record<TierLevel, TierConfig> = {
    bronze: {
        name: 'Bronce',
        minPoints: 0,
        maxPoints: 999,
        benefits: {
            discountPercentage: 0,
            freeShipping: false,
            earlyAccess: false,
            birthdayBonus: 200,
        },
        color: '#CD7F32',
        icon: '🥉',
    },
    silver: {
        name: 'Plata',
        minPoints: 1000,
        maxPoints: 2999,
        benefits: {
            discountPercentage: 5,
            freeShipping: false,
            earlyAccess: false,
            birthdayBonus: 300,
        },
        color: '#C0C0C0',
        icon: '🥈',
    },
    gold: {
        name: 'Oro',
        minPoints: 3000,
        maxPoints: 9999,
        benefits: {
            discountPercentage: 10,
            freeShipping: true,
            earlyAccess: true,
            birthdayBonus: 500,
        },
        color: '#FFD700',
        icon: '🥇',
    },
    platinum: {
        name: 'Platino',
        minPoints: 10000,
        maxPoints: Infinity,
        benefits: {
            discountPercentage: 15,
            freeShipping: true,
            earlyAccess: true,
            birthdayBonus: 1000,
        },
        color: '#E5E4E2',
        icon: '💎',
    },
};

// Reglas de ganancia de puntos
export const POINTS_RULES = {
    PURCHASE_RATE: 0.1, // 1 punto por cada $10 MXN
    FIRST_PURCHASE_BONUS: 500,
    REVIEW_WITH_PHOTO: 50,
    REVIEW_WITHOUT_PHOTO: 25,
    REFERRAL_BONUS: 300,
    BIRTHDAY_BONUS: 200,
};

// Reglas de redención
export const REDEMPTION_RULES = {
    POINTS_TO_CURRENCY: 0.1, // 100 puntos = $10 MXN
    MIN_POINTS_TO_REDEEM: 500,
    MAX_REDEMPTION_PERCENTAGE: 50, // Máximo 50% del total
};

/**
 * Calcula puntos ganados por una compra
 */
export function calculatePointsFromPurchase(amount: number): number {
    return Math.floor(amount * POINTS_RULES.PURCHASE_RATE);
}

/**
 * Calcula el descuento en pesos por puntos
 */
export function calculateDiscountFromPoints(points: number): number {
    return points * REDEMPTION_RULES.POINTS_TO_CURRENCY;
}

/**
 * Determina el nivel VIP basado en puntos totales
 */
export function getTierFromPoints(totalPoints: number): TierLevel {
    if (totalPoints >= TIER_CONFIGS.platinum.minPoints) return 'platinum';
    if (totalPoints >= TIER_CONFIGS.gold.minPoints) return 'gold';
    if (totalPoints >= TIER_CONFIGS.silver.minPoints) return 'silver';
    return 'bronze';
}

/**
 * Calcula el progreso hacia el siguiente nivel
 */
export function calculateTierProgress(totalPoints: number): {
    currentTier: TierLevel;
    progress: number;
    pointsToNext: number;
    nextTier: TierLevel | null;
} {
    const currentTier = getTierFromPoints(totalPoints);
    const currentConfig = TIER_CONFIGS[currentTier];

    // Si ya está en el nivel máximo
    if (currentTier === 'platinum') {
        return {
            currentTier,
            progress: 100,
            pointsToNext: 0,
            nextTier: null,
        };
    }

    // Encontrar el siguiente nivel
    const tiers: TierLevel[] = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    const nextTier = tiers[currentIndex + 1];
    const nextConfig = TIER_CONFIGS[nextTier];

    const pointsInCurrentTier = totalPoints - currentConfig.minPoints;
    const pointsNeededForNextTier = nextConfig.minPoints - currentConfig.minPoints;
    const progress = (pointsInCurrentTier / pointsNeededForNextTier) * 100;
    const pointsToNext = nextConfig.minPoints - totalPoints;

    return {
        currentTier,
        progress: Math.min(progress, 100),
        pointsToNext,
        nextTier,
    };
}

/**
 * Valida si se pueden redimir puntos
 */
export function canRedeemPoints(
    availablePoints: number,
    pointsToRedeem: number,
    orderTotal: number
): { valid: boolean; error?: string } {
    // Verificar mínimo de puntos
    if (pointsToRedeem < REDEMPTION_RULES.MIN_POINTS_TO_REDEEM) {
        return {
            valid: false,
            error: `Mínimo ${REDEMPTION_RULES.MIN_POINTS_TO_REDEEM} puntos para redimir`,
        };
    }

    // Verificar puntos disponibles
    if (pointsToRedeem > availablePoints) {
        return {
            valid: false,
            error: 'No tienes suficientes puntos disponibles',
        };
    }

    // Verificar porcentaje máximo del pedido
    const discount = calculateDiscountFromPoints(pointsToRedeem);
    const maxDiscount = orderTotal * (REDEMPTION_RULES.MAX_REDEMPTION_PERCENTAGE / 100);

    if (discount > maxDiscount) {
        return {
            valid: false,
            error: `Máximo ${REDEMPTION_RULES.MAX_REDEMPTION_PERCENTAGE}% del total del pedido`,
        };
    }

    return { valid: true };
}

/**
 * Crea una transacción de puntos
 */
export function createPointTransaction(
    type: 'earn' | 'redeem',
    points: number,
    reason: string,
    orderId?: string
): PointTransaction {
    return {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        points,
        reason,
        orderId,
        createdAt: new Date(),
    };
}

/**
 * Obtiene el beneficio de descuento por nivel
 */
export function getTierDiscount(tier: TierLevel): number {
    return TIER_CONFIGS[tier].benefits.discountPercentage;
}

/**
 * Verifica si el usuario tiene envío gratis por nivel
 */
export function hasFreeShipping(tier: TierLevel): boolean {
    return TIER_CONFIGS[tier].benefits.freeShipping;
}
