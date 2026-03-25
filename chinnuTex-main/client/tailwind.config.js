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
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in-down': 'fadeInDown 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
        'slide-in-left': 'slideInLeft 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        'blur-in': 'blurIn 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-accent': 'glowAccent 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'pulse-ring': 'pulseRing 1.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
        'spin-slow': 'spin-slow 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'morph-blob': 'morphBlob 8s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'premium': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 12px 24px -8px rgba(0, 0, 0, 0.04)',
        'premium-lg': '0 40px 80px -20px rgba(0, 0, 0, 0.12), 0 20px 40px -12px rgba(0, 0, 0, 0.06)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3), 0 0 60px rgba(99, 102, 241, 0.1)',
        'glow-rose': '0 0 20px rgba(244, 63, 94, 0.3), 0 0 60px rgba(244, 63, 94, 0.1)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3), 0 0 60px rgba(245, 158, 11, 0.1)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
