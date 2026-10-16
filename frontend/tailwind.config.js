/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep near-black / purple base (matches reference).
        void: '#05050a',
        panel: 'rgba(10, 10, 18, 0.6)',
        border: 'rgba(255, 255, 255, 0.08)',
        bone: '#ffffff',
        mute: '#a8a2b3',
        // Single controlled accent family: purple -> pink -> blue.
        accent: {
          purple: '#a855f7',
          pink: '#ec4899',
          blue: '#8b5cf6',
          deep: '#3b0764',
          glow: 'rgba(168, 85, 247, 0.45)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        morph: 'morph 10s ease-in-out infinite',
        spinSlow: 'spin 28s linear infinite',
        fadeIn: 'fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -16px, 0)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '45% 55% 48% 52% / 50% 45% 55% 50%' },
          '50%': { borderRadius: '55% 45% 52% 48% / 45% 55% 50% 50%' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translate3d(0, 20px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
};
