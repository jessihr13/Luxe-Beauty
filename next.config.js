/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    // Deshabilitar generación estática para páginas admin que usan router.push en el render
    // Esto evita errores "location is not defined" durante el build en Vercel
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};

module.exports = nextConfig;
