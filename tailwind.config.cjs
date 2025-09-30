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
          DEFAULT: "#10B981",    // emerald-500
          weak: "#A7F3D0",       // emerald-200
          primary: "#10B981",
          secondary: "#0EA5E9",  // sky-500
          accent: "#059669",     // emerald-600
          light: "#D1FAE5",
          dark: "#065F46"
        },
        "brand-teal": "#10B981",
        "brand-blue": "#0EA5E9"
      },
      maxWidth: {
        'container': '1120px',
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "system-ui", "sans-serif"]
      },
      fontSize: {
        'h1': ['3rem', { lineHeight: '1.06', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h1-lg': ['4.5rem', { lineHeight: '1.06', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h2-lg': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'lead': ['18px', { lineHeight: '2rem', letterSpacing: '0.01em' }],
        'body': ['17px', { lineHeight: '2rem', letterSpacing: '0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
      },
      boxShadow: {
        'card': '0 8px 30px rgba(15, 23, 42, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 220ms ease-out',
        'slide-up': 'slideUp 220ms ease-out',
        'scale-in': 'scaleIn 160ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    }
  },
  plugins: []
};
