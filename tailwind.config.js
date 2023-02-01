const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/pages/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}', './src/components/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      lato: ['Lato', 'sans-serif'],
    },
    screens: {
      xs: '380px',
      'mq-hover': { raw: '(hover: hover)' },
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        'dark-sea': '#22343C',
        'dark-sea-semi-transparent': '#22343CDD',
        'darker-sea': '#1D2C33',
        'lighter-sea': '#35525E',
        'bright-seaweed': '#3ED598',
        'hovered-seaweed': '#82E7BD',
        'dark-seaweed': '#005C53',
        'orange-sun': '#FF5C00',
        'default-font': '#F0F0F0',
        'star-color': '#FFE000',
        danger: '#D41C2D',
        'lighter-danger': '#DD4352',
        warning: '#FFC107',
      },
      boxShadow: {
        'shadow-darker-sea': '2px 2px 10px 7px #1D2C33',
        'shadow-inset-darker-sea': 'inset 2px 2px 10px 7px #1D2C33',
        'shadow-inset-thin-darker-sea': 'inset 0px 0px 4px 1px #1D2C33',
        'shadow-thin-bright-sea': 'inset 0px 0px 0px 1px #3ED598',
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
            transform: 'translateY(-100%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
    future: {
      hoverOnlyWhenSupported: true,
    },
  },
  plugins: [],
};
