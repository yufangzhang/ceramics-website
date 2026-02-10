/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'gallery': '0.25em',
        'museum': '0.6em',
      },
      colors: {
        'warm-white': '#FAF9F6', // The "Paper" background
        'bg-gallery': '#FAF9F6', // Same as warm-white, for clarity
        'gallery-white': '#FAF9F6',
        'ink': '#1A1A1A', // Charcoal instead of pure black
        'stone-grey': '#1A1A1A', // Using ink color
        'clay-muted': '#71717A', // Updated muted color
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
