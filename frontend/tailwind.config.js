/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        health: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Emerald health primary
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        clinical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7', // Professional clinical blue
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0a304e',
        },
        darkbg: {
          50: '#1e293b',
          100: '#0f172a', // Main dark page background
          200: '#070a13', // Deepest background
          300: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
