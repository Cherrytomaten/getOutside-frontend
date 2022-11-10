/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/pages/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/components/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      lato: ['Lato', 'sans-serif'],
    },
    extend: {
      colors: {
        'dark-sea': '#22343C',
        'bright-seaweed': '#3ED598',
        'hovered-seaweed': '#82e7bd',
        'dark-seaweed': '#005C53',
        'orange-sun': '#FF5C00'
      }
    },
  },
  plugins: [],
};
