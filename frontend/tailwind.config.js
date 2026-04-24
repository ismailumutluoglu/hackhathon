/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf0',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#3d8b37',
          600: '#2d6a27',
          700: '#1e4a1a',
          800: '#14321a',
          900: '#0a1f0d',
          DEFAULT: '#3d8b37',
        },
        earth: {
          50:  '#fdf8f0',
          100: '#f9edd8',
          200: '#f1d9aa',
          300: '#e8c07a',
          400: '#d4994f',
          500: '#b87333',
          600: '#8b5a2b',
          700: '#6b3f1e',
          800: '#4a2b12',
          900: '#2d1a0a',
          DEFAULT: '#b87333',
        },
        cream: {
          DEFAULT: '#fef9ee',
          50: '#fffef7',
          100: '#fffbeb',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

