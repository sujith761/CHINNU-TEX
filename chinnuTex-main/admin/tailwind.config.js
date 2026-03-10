/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0b1120',
          50: '#0f172a',
          100: '#131c33',
          200: '#1a2540',
          300: '#243152',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          light: 'rgba(255,255,255,0.07)',
          border: 'rgba(255,255,255,0.08)',
        },
        neon: {
          violet: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-violet': 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        'glow-cyan': 'linear-gradient(135deg, #06b6d4, #3b82f6)',
        'glow-emerald': 'linear-gradient(135deg, #10b981, #06b6d4)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(139,92,246,0.3)',
        'glow-md': '0 0 25px -5px rgba(139,92,246,0.4)',
        'glow-cyan': '0 0 20px -5px rgba(6,182,212,0.35)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
