import type { LegacyOrder } from '../data/orders';

export interface CohortData {
    cohortMonth: string; // YYYY-MM
    customersCount: number;
    retention: {
        [key: string]: number; // month0, month1, month2, etc.
    };
    revenue: {
        [key: string]: number;
    };
    ltv: number;
}

/**
 * Agrupa clientes por cohorte (mes de primera compra)
 */
export function generateCohortAnalysis(orders: LegacyOrder[]): CohortData[] {
    // Agrupar pedidos por cliente
    const customerOrders = new Map<string, LegacyOrder[]>();

    orders.forEach(order => {
        const existing = customerOrders.get(order.customerEmail) || [];
        customerOrders.set(order.customerEmail, [...existing, order]);
    });

    // Determinar primera compra de cada cliente
    const customerFirstPurchase = new Map<string, Date>();
    customerOrders.forEach((orders, email) => {
        const firstOrder = orders.reduce((earliest, order) =>
            new Date(order.createdAt) < new Date(earliest.createdAt) ? order : earliest
        );
        customerFirstPurchase.set(email, new Date(firstOrder.createdAt));
    });

    // Agrupar clientes por cohorte (mes de primera compra)
    const cohorts = new Map<string, Set<string>>();
    customerFirstPurchase.forEach((firstPurchase, email) => {
        const cohortMonth = `${firstPurchase.getFullYear()}-${String(firstPurchase.getMonth() + 1).padStart(2, '0')}`;
        if (!cohorts.has(cohortMonth)) {
            cohorts.set(cohortMonth, new Set());
        }
        cohorts.get(cohortMonth)!.add(email);
    });

    // Calcular retención y revenue por cohorte
    const cohortDataArray: CohortData[] = [];

    cohorts.forEach((customers, cohortMonth) => {
        const cohortDate = new Date(cohortMonth + '-01');
        const retention: { [key: string]: number } = {};
        const revenue: { [key: string]: number } = {};
        let totalLTV = 0;

        // Calcular retención para cada mes después de la primera compra
        for (let monthOffset = 0; monthOffset <= 12; monthOffset++) {
            const targetDate = new Date(cohortDate);
            targetDate.setMonth(targetDate.getMonth() + monthOffset);

            let activeCustomers = 0;
            let monthRevenue = 0;

            customers.forEach(email => {
                const customerOrdersInMonth = customerOrders.get(email)!.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate.getFullYear() === targetDate.getFullYear() &&
                        orderDate.getMonth() === targetDate.getMonth();
                });

                if (customerOrdersInMonth.length > 0) {
                    activeCustomers++;
                    monthRevenue += customerOrdersInMonth.reduce((sum, o) => sum + o.total, 0);
                }
            });

            const retentionRate = (activeCustomers / customers.size) * 100;
            retention[`month${monthOffset}`] = retentionRate;
            revenue[`month${monthOffset}`] = monthRevenue;
            totalLTV += monthRevenue;
        }

        cohortDataArray.push({
            cohortMonth,
            customersCount: customers.size,
            retention,
            revenue,
            ltv: totalLTV / customers.size,
        });
    });

    // Ordenar por fecha
    return cohortDataArray.sort((a, b) => a.cohortMonth.localeCompare(b.cohortMonth));
}

/**
 * Calcula la tasa de churn promedio
 */
export function calculateChurnRate(cohortData: CohortData[]): number {
    if (cohortData.length === 0) return 0;

    let totalChurn = 0;
    let count = 0;

    cohortData.forEach(cohort => {
        const month0 = cohort.retention.month0 || 100;
        const month1 = cohort.retention.month1 || 0;
        const churn = month0 - month1;
        totalChurn += churn;
        count++;
    });

    return count > 0 ? totalChurn / count : 0;
}

/**
 * Calcula el LTV promedio
 */
export function calculateAverageLTV(cohortData: CohortData[]): number {
    if (cohortData.length === 0) return 0;

    const totalLTV = cohortData.reduce((sum, cohort) => sum + cohort.ltv, 0);
    return totalLTV / cohortData.length;
}
