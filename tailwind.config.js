/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '360px',
      },
      fontSize: {
        'xs-10': '10px',
      },
    },
  },
  plugins: [],
}
