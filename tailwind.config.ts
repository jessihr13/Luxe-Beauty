import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'rose-gold': {
                    50: '#FDF8F6',
                    100: '#F9EDE8',
                    200: '#F3DBD1',
                    300: '#E8C4B8',
                    400: '#DCAD9F',
                    500: '#D19686',
                    600: '#C57F6D',
                    700: '#B96854',
                    800: '#9A5545',
                    900: '#7B4436',
                },
                'nude': {
                    50: '#FDFCFB',
                    100: '#F9F7F5',
                    200: '#F5F1ED',
                    300: '#EBE5DF',
                    400: '#E1D9D1',
                    500: '#D7CDC3',
                    600: '#CDC1B5',
                    700: '#C3B5A7',
                    800: '#A89B8F',
                    900: '#8D8177',
                },
                'terracotta': {
                    50: '#FBF3F1',
                    100: '#F7E7E3',
                    200: '#EFCFC7',
                    300: '#E7B7AB',
                    400: '#DF9F8F',
                    500: '#D4816F',
                    600: '#C86B57',
                    700: '#BC553F',
                    800: '#9D4735',
                    900: '#7E392B',
                },
                'luxe-dark': {
                    900: '#1c1917', // Warm dark (Stone 900)
                    800: '#292524', // Stone 800
                    700: '#44403c', // Stone 700
                },
            },
            fontFamily: {
                serif: ['Cormorant Garamond', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
export default config
