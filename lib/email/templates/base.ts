/**
 * Base template para todos los emails
 * Proporciona estructura HTML consistente
 */

interface EmailLayoutProps {
    children: string;
    preheader?: string;
}

export function EmailLayout({ children, preheader }: EmailLayoutProps): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Luxe Beauty</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #D4816F 0%, #E8C4B8 100%);
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #ffffff;
            text-decoration: none;
        }
        .content {
            padding: 40px 30px;
            color: #374151;
            line-height: 1.6;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #D4816F;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }
        .divider {
            border-top: 1px solid #e5e7eb;
            margin: 30px 0;
        }
        @media only screen and (max-width: 480px) {
            .content {
                padding: 20px 15px;
            }
            .button {
                display: block;
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    ${preheader ? `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ''}
    
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <a href="https://luxebeauty.com" class="logo">Luxe Beauty</a>
        </div>

        <!-- Content -->
        <div class="content">
            ${children}
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 10px 0;">
                <strong>Luxe Beauty</strong><br>
                Tu tienda de belleza premium
            </p>
            <p style="margin: 10px 0;">
                <a href="https://luxebeauty.com" style="color: #D4816F; text-decoration: none;">Visitar tienda</a> |
                <a href="https://luxebeauty.com/contacto" style="color: #D4816F; text-decoration: none;">Contacto</a> |
                <a href="https://luxebeauty.com/ayuda" style="color: #D4816F; text-decoration: none;">Ayuda</a>
            </p>
            <p style="margin: 10px 0; font-size: 12px;">
                © ${new Date().getFullYear()} Luxe Beauty. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}
