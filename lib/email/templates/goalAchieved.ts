import { EmailLayout } from './base';

export interface GoalAchievedData {
    goalType: 'daily' | 'weekly' | 'monthly';
    goalAmount: number;
    actualAmount: number;
    percentage: number;
    period: string;
}

export function goalAchievedTemplate(data: GoalAchievedData): string {
    const goalTypeText = {
        daily: 'Diaria',
        weekly: 'Semanal',
        monthly: 'Mensual',
    }[data.goalType];

    const content = `
        <h1 style="color: #10B981; margin-top: 0;">🎉 ¡Meta Alcanzada!</h1>
        
        <div style="background-color: #D1FAE5; border-left: 4px solid #10B981; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #065F46;">
                ¡Felicitaciones! Se ha alcanzado la meta ${goalTypeText.toLowerCase()}
            </p>
        </div>

        <p>El equipo ha superado las expectativas para el período ${data.period}.</p>

        <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <div style="margin-bottom: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Meta ${goalTypeText}</p>
                <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #374151;">
                    $${data.goalAmount.toLocaleString()}
                </p>
            </div>

            <div style="margin: 20px 0;">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="10"/>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" stroke-width="10"
                            stroke-dasharray="${(data.percentage / 100) * 283} 283"
                            stroke-dashoffset="0"
                            transform="rotate(-90 50 50)"/>
                    <text x="50" y="55" text-anchor="middle" font-size="20" font-weight="bold" fill="#10B981">
                        ${data.percentage.toFixed(0)}%
                    </text>
                </svg>
            </div>

            <div style="margin-top: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Ventas Actuales</p>
                <p style="margin: 5px 0; font-size: 32px; font-weight: bold; color: #10B981;">
                    $${data.actualAmount.toLocaleString()}
                </p>
                <p style="margin: 5px 0; color: #10B981; font-size: 14px;">
                    +$${(data.actualAmount - data.goalAmount).toLocaleString()} sobre la meta
                </p>
            </div>
        </div>

        <h3 style="color: #374151;">Desglose del Período</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f9fafb;">
                <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">Meta Establecida</td>
                <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
                    $${data.goalAmount.toLocaleString()}
                </td>
            </tr>
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">Ventas Realizadas</td>
                <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #10B981;">
                    $${data.actualAmount.toLocaleString()}
                </td>
            </tr>
            <tr style="background-color: #f9fafb;">
                <td style="padding: 15px; font-weight: bold;">Excedente</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; color: #10B981; font-size: 18px;">
                    $${(data.actualAmount - data.goalAmount).toLocaleString()}
                </td>
            </tr>
        </table>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://luxebeauty.com/admin/reportes/ejecutivo" class="button">
                Ver Dashboard Ejecutivo
            </a>
        </div>

        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400E;">
                💡 <strong>Consejo:</strong> Mantén este impulso analizando qué estrategias funcionaron mejor este período.
            </p>
        </div>

        <p style="color: #6b7280; font-size: 14px; text-align: center;">
            ¡Sigue así! El éxito es el resultado del trabajo en equipo.
        </p>
    `;

    return EmailLayout({
        children: content,
        preheader: `¡Meta ${goalTypeText} alcanzada! ${data.percentage.toFixed(0)}% completado`,
    });
}
