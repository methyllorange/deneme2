/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                aso: {
                    blue:        '#114B95',
                    'blue-deep': '#292562',
                    teal:        '#1394B9',
                    orange:      '#F68B1F',
                    lavender:    '#9B92C6',
                    green:       '#019963',
                    coral:       '#D7604D',
                    red:         '#B1172B',
                },
                brand: {
                    bg: '#0b1120',
                    card: '#1e293b',
                    text: '#f8fafc',
                    muted: '#94a3b8',
                    accent1: '#114B95',
                    accent2: '#F68B1F',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
