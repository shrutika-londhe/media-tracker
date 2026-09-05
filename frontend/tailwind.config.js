/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#FFF4F4',
          900: '#FFFFFF',
          800: '#F3F0FF',
          700: '#BDB2FF',
        },
        moss: {
          400: '#6FA1FF',
          500: '#3A86FF',
          600: '#2E6FD9',
        },
        ember: {
          400: '#FF6F91',
          500: '#F5567D',
        },
        stone: {
          50: '#FFFFFF',
          100: '#2B2A3A',
          200: '#383650',
          300: '#4A4568',
          400: '#6B6690',
          500: '#8B87AC',
          600: '#A9A6C4',
          700: '#C3C0DA',
          800: '#DAD8EA',
          900: '#EDEBF7',
          950: '#FFF4F4',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}