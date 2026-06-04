/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Locked palette (see DESIGN.md): dominant navy neutrals, ONE calm teal-green
        // accent, blue as light secondary, red as a rare spice.
        ink: '#0B1220', // page background
        app: '#0F172A', // app surface
        panel: '#1E293B', // raised surfaces / cards
        line: '#243044', // borders
        accent: { DEFAULT: '#14B8A6', soft: '#2DD4BF', dim: '#0E8C81' }, // teal-green
        ocean: '#60A5FA', // secondary / info
        spice: '#F87171', // emphasis only (live dots, alerts)
        ink2: '#E2E8F0', // primary text
        muted: '#94A3B8', // secondary text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: { '2xl': '1rem' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
