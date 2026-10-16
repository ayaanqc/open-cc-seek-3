/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep charcoal base.
        void: '#0A0A0D',
        coal: '#101014',
        panel: '#141419',
        // Bone / near-white for type.
        bone: '#F4F1EA',
        mute: '#8A8A96',
        // Singular accent family (violet -> fuchsia). Kept tight so the
        // palette reads as one controlled hue, not a rainbow.
        accent: {
          DEFAULT: '#C724E8',
          soft: '#D96BF2',
          deep: '#7C3AED',
          ink: '#3B0A52',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        ultra: '0.24em',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
