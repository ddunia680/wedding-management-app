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
        darkClose: '#031024',
        lightestDBlue: '#051a3a',
        fromBack: '#e3e6e9',
        marOrange: '#ed4a45',
        maroon: '#2c1c1f',
        lightBlue: '#36c7cb',
        whitish: '#e9e0e1'
      }
    },
  },
  plugins: [],
}

