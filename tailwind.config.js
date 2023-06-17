/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        specialGray: '#f7f1f1',
        specialPink: '#7c1828',
        extraPink: '#d13e56',
        darkLighterBlue: '#020c1b',
        fromBack: '#e3e6e9',
        marOrange: '#ed4a45'
      }
    },
  },
  plugins: [],
}

