/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'warm-white': '#FAF9F6', // The "Paper" background
        'gallery-white': '#FAF9F6',
        'stone-grey': '#2D2D2D',
        'clay-muted': '#A3A3A3',
        clay: {
          50: '#faf8f5',
          100: '#f2ede4',
          200: '#e5dac9',
          300: '#d4c2a6',
          400: '#c0a583',
          500: '#b08d6b',
          600: '#9d7659',
          700: '#83604b',
          800: '#6c5041',
          900: '#594237',
        },
      },
    },
  },
  plugins: [],
}
