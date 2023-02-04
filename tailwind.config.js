/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          DEFAULT: '#505468',
          50: '#F1F1F4',
          100: '#E8E9ED',
          150: '#E0E1E6',
          200: '#D8DAE3',
          250: '#D2D4DC',
          300: '#C0C2CE',
          350: '#A6AABF',
          400: '#9196A8',
          450: '#71758A',
          500: '#303544',
          550: '#20222d',
          600: '#171720',
          650: '#121219',
          700: '#121317',
          750: '#0D0E11',
          800: '#0C0C0F',
          850: '#08090D',
          900: '#060609',
          950: '#030303'
        }
      }
    },
  },
  plugins: [],
}
