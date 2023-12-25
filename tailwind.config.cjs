/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{index,vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      Cookie: ['Cookie'],
      Quicksand: ['Quicksand'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
