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
    screens: {
      xs: '380px',
    },
    extend: {
      colors: {
        'dark-sea': '#22343C',
        'dark-sea-hover': '#1d2c33',
        'dark-sea-semi-transparent': '#22343Cdd',
        'bright-seaweed': '#3ED598',
        'hovered-seaweed': '#82e7bd',
        'dark-seaweed': '#005C53',
        'orange-sun': '#FF5C00',
        'default-font': '#f0f0f0',
        'star-color': '#ffe000',
      },
      boxShadow: {
        'shadow-dark-sea-hover': '2px 2px 10px 7px #1d2c33',
        'glowing-bright-seaweed': '0 0 10px 3px #3ED598',
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      animation: {
        'custom-bounce': 'c-bounce 1s infinite',
        'custom-bounce-delay-1': 'c-bounce 1s 220ms infinite',
        'custom-bounce-delay-2': 'c-bounce 1s 440ms infinite',
      },
      keyframes: {
        'c-bounce': {
          '0%, 100%': {
            'transform': 'translateY(-100%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            'transform': 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  plugins: [],
};
