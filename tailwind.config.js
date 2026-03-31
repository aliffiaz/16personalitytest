/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F46E5',   // Indigo-600
          secondary: '#8B5CF6', // Violet-500
          accent: '#F59E0B',    // Amber-500
          bg: '#F8FAFC',        // Slate-50
          surface: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(226, 232, 240, 0.8)', // Slate-200 with opacity
        },
        group: {
          analyst: '#A855F7',   // Purple
          diplomat: '#22C55E',  // Green
          sentinel: '#3B82F6',  // Blue
          explorer: '#EAB308',  // Yellow
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      letterSpacing: {
        'tightest': '-0.06em',
      }
    },
  },
  plugins: [],
}
