/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
      },
      colors: {
        'bg': '#F8F8F8',
        'fg': '#FFFFFF',
        'h1': '#000',
        'text': '#00000096',
        'accent': '#cccccc',
        'primary': '#FAB5EC'
      },
      spacing: {
        'none': '0rem',
        '2xl': '9.5rem',
        'xxl': '7rem',
        'xlg': '2rem',
        'lg': '1.3rem',
        'md': '1rem',
        'base': '0.6rem',
        'sm': '0.3rem',
        'xs': '0.1rem',

        // temp
        'temp': '6rem',
        'temp2': '3rem',


      },
      fontFamily: {
        'Avenir': ['Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'lg': '1.1rem',
        'md': '0.95rem',
        'sm': '0.9rem',
        'xlg': '1.2rem',
      },
      fontWeight: {
        'normal': 400,
        'medium': 500,
        'base': 600,
        'heavy': 800,
      },
      boxShadow: {
        'base': '0px 1px 2px 0px #3C40434C, 0px 1px 3px 1px #3C404326',
        'hover': '0px 1px 2px 0px #ff8fc8, 0px 1px 3px 1px #ffbadd',
        'dialog': '0px 30px 90px rgba(0, 0, 0, 0.63)',
        'sidebar': '0px 20px 30px rgba(0, 0, 0, 0.30)',
        'none': 'none',
      },
      width: {
        'logo': '7rem',
        'sidebar': '18rem',
        'dialog': '74rem',
        'admin-dialog': '85%',
        'control-panel': '6rem',
      },
      borderRadius: {
        'gentle': '0.5rem',
        'steep': '5rem',
      },
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          '::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      });
    },
  ],
}

