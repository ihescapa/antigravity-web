/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        field: ['"Courier Prime"', 'Courier New', 'monospace'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        earth: {
          50:  '#fdf6ee',
          100: '#f5e6cc',
          200: '#e6d5b8',
          300: '#d4b896',
          400: '#c49a6c',
          500: '#a67c52',
          600: '#8b6342',
          700: '#6e4e34',
          800: '#4d3624',
          900: '#2e2014',
        },
        fossil: {
          green:  '#166534',
          orange: '#92400e',
          purple: '#5b21b6',
        }
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'card-flip': 'cardFlip 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        cardFlip: { '0%': { transform: 'rotateY(90deg)' }, '100%': { transform: 'rotateY(0deg)' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(250,204,21,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(250,204,21,0.9)' },
        }
      }
    },
  },
  plugins: [],
}
