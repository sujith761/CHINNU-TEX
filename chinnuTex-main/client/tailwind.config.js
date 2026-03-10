/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft oceanic palette inspired by the provided gradient
        primary: {
          50: '#f0f8ff',
          100: '#e5f2ff',
          200: '#cfe8ff',
          300: '#b7daf8',
          400: '#7bb6eb',
          500: '#4a94d8',
          600: '#2d72b5',
          700: '#245a8f',
          800: '#1d486f',
          900: '#163754',
        },
        accent: {
          light: '#9ad5d7',
          DEFAULT: '#5bb0b7',
          dark: '#3c7d84',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
