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
          DEFAULT: "#00AEEF",    // brand-blue
          weak: "#BFEBFF",       // light blue
          primary: "#00AEEF",
          secondary: "#00C6FF",  // lighter blue
          accent: "#0096D6",     // darker blue
          light: "#E6F7FF",
          dark: "#1E355A"
        },
        "brand-teal": "#00AEEF",
        "brand-blue": "#00AEEF"
      },
      maxWidth: {
        'container': '1120px',
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "system-ui", "sans-serif"]
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],
        'sm': ['1rem', { lineHeight: '1.5rem' }],
        'base': ['1.125rem', { lineHeight: '1.75rem' }],
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],
        'xl': ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.25rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
        '5xl': ['3.5rem', { lineHeight: '1.1' }],
        'h1': ['3.5rem', { lineHeight: '1.06', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h1-lg': ['5rem', { lineHeight: '1.06', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h2-lg': ['2.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'lead': ['1.25rem', { lineHeight: '2rem', letterSpacing: '0.01em' }],
        'body': ['1.125rem', { lineHeight: '2rem', letterSpacing: '0.02em' }],
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
