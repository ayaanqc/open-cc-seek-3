/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#000000',
        panel: '#0a0a0a',
        bone: '#f5f5f4',
        mute: '#8e8e93',
        faint: '#3f3f46',
        crystal: {
          violet: '#8b5cf6',
          purple: '#a855f7',
          pink: '#f0abfc',
          ember: '#fdba74',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
