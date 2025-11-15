/** @type {import('tailwindcss').Config} */
export default {
        content: [
                "./index.html",
                "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
                extend: {
                        fontFamily: {
                                poppins: ['Poppins', 'sans-serif'],
                        },
                        colors: {
                                'speedauto-sidebar': '#1A202C',
                                'speedauto-primary': '#2563EB',
                                'speedauto-primary-hover': '#1D4ED8',
                                'speedauto-red': '#DC2626',
                                'speedauto-green': '#16A34A',
                                'speedauto-yellow': '#F59E0B',
                                'speedauto-muted': '#718096',
                        },
                        animation: {
                                'fade-in-up': 'fadeInUp 0.3s ease-out',
                                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                'bounce-short': 'bounceShort 0.6s ease-out', // NOVO
                        },
                        keyframes: {
                                fadeInUp: {
                                        '0%': { opacity: '0', transform: 'translateY(10px)' },
                                        '100%': { opacity: '1', transform: 'translateY(0)' },
                                },
                                // NOVO
                                bounceShort: {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-10px)' },
                                }
                        },
                },
        },
        plugins: [],
}