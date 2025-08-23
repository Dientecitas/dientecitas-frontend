/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
    },
  },
  plugins: [],
};
