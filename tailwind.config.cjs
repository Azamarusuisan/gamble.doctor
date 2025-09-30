/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0EA5E9",
          teal: "#10B981",
          accent: "#22C55E",
          light: "#e4f1ef"
        }
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "system-ui", "sans-serif"]
      },
      fontSize: {
        'hero': ['clamp(3rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'body-lg': ['18px', { lineHeight: '2rem', letterSpacing: '0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    }
  },
  plugins: []
};
