/**
 * Mock Email Service
 * En producción, reemplazar con Resend
 * Para usar Resend: npm install resend
 */

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}

export interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

class EmailService {
    private fromEmail: string;
    private isDevelopment: boolean;

    constructor() {
        this.fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@luxebeauty.com';
        this.isDevelopment = process.env.NODE_ENV !== 'production';
    }

    /**
     * Envía un email
     * En desarrollo: simula envío con log
     * En producción: usar Resend
     */
    async sendEmail(options: EmailOptions): Promise<EmailResponse> {
        try {
            const recipients = Array.isArray(options.to) ? options.to : [options.to];

            if (this.isDevelopment) {
                // Modo desarrollo: simular envío
                console.log('📧 [EMAIL MOCK] Email enviado:');
                console.log('  De:', options.from || this.fromEmail);
                console.log('  Para:', recipients.join(', '));
                console.log('  Asunto:', options.subject);
                console.log('  HTML:', options.html.substring(0, 100) + '...');
                console.log('---');

                return {
                    success: true,
                    messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                };
            }

            // Producción: usar Resend
            // Descomentar cuando tengas API key:
            /*
            const { Resend } = require('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            
            const response = await resend.emails.send({
                from: options.from || this.fromEmail,
                to: recipients,
                subject: options.subject,
                html: options.html,
            });

            return {
                success: true,
                messageId: response.id,
            };
            */

            // Por ahora, simular en producción también
            return {
                success: true,
                messageId: `mock_${Date.now()}`,
            };

        } catch (error) {
            console.error('Error enviando email:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    /**
     * Envía múltiples emails en batch
     */
    async sendBatch(emails: EmailOptions[]): Promise<EmailResponse[]> {
        const results = await Promise.all(
            emails.map(email => this.sendEmail(email))
        );
        return results;
    }

    /**
     * Valida formato de email
     */
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Singleton instance
export const emailService = new EmailService();
