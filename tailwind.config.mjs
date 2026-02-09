/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
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
