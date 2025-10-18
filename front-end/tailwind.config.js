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
      }
    },
  },
  plugins: [],
}