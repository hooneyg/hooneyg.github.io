/**
 * TailwindCSS Config
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a0c',
          lighter: '#16161a',
        },
        emerald: {
          500: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
