/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        4.5: '1.125rem',
        18:'4.5rem'
      },
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
