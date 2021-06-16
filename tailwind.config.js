const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit', // Just-In-Time Compiler
  purge: ['./src/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
      },
      boxShadow: {
        blur: '0 4px 20px 0 rgb(34 41 47 / 10%)',
      },
      fontFamily: {
        sans: ['"Inter var"', ...fontFamily.sans],
      },
      spacing: {
        68: '17rem',
      },
    },
  },
  variants: {
    extend: {
      margin: ['first'],
      padding: ['odd'],
    },
  },
  plugins: [],
}
