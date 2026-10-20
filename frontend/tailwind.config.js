/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          50: '#fdfcf9',
          100: '#faf8f5',
          200: '#f2ece4',
          300: '#e5dcce',
          400: '#d1c2ad',
        },
        timber: {
          50: '#fdfbf7',
          100: '#f6f1e8',
          200: '#ebe2d2',
          300: '#d9c8b0',
          400: '#bf9d75',
          500: '#9e754a',
          600: '#825936',
          700: '#67442a',
          800: '#4a2f1b',
          900: '#2b1a0e',
          950: '#1a0e07',
        },
        darkbg: {
          base: '#140d08',
          card: '#1f150e',
          cardHover: '#291c13',
          border: '#382518',
          textMuted: '#a89a8c',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
      }
    },
  },
  plugins: [],
}
