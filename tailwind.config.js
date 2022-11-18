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
        'dark-sea-hover': '#1d2c33',
        'bright-seaweed': '#3ED598',
        'hovered-seaweed': '#82e7bd',
        'dark-seaweed': '#005C53',
        'orange-sun': '#FF5C00',
        'default-font': '#f0f0f0',
        'star-color': '#ffe000',
      },
      boxShadow: {
        custom: '2px 2px 10px 7px rgba(29, 44, 51, 1)',
      },
      backgroundImage: {
        'dark-linear-135':
          'linear-gradient(135deg, rgba(36,61,65,1) 0%, rgba(0,92,83,1) 100%)',
        'light-linear-135':
          'linear-gradient(135deg, rgba(0,92,83,1) 0%, rgba(62,213,152,1) 100%)',
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
