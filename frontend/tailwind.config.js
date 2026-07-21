/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0F1115',
          900: '#161922',
          800: '#1F2430',
          700: '#2A3140',
        },
        moss: {
          50: '#F3F7F1',
          100: '#E1EBDC',
          400: '#7FA875',
          500: '#5C8A52',
          600: '#476B3E',
        },
        ember: {
          400: '#E8A15C',
          500: '#D98B3F',
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
