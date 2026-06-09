import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2A6BDB',
          cyan: '#3BC4E8',
        },
        bg: {
          base: '#07090F',
          surface: '#0B0E16',
          raised: '#10141E',
          overlay: '#090C14',
        },
        ink: {
          primary: '#F0F1F6',
          secondary: '#7E8394',
          muted: '#4A5168',
        },
        line: {
          DEFAULT: '#262A38',
          mid: '#343A4F',
        },
        ok: '#4CC38A',
        warn: '#D4A843',
        bad: '#D94A3A',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 16px rgba(42,107,219,0.35)',
        card: '0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease both',
      },
    },
  },
  plugins: [],
} satisfies Config
