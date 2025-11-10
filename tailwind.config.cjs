const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx,css}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'zoom-in': {
          '0%': {
            transform: 'scale(0.95)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('daisyui'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.animate-in': {
          animation: 'fade-in 0.2s ease-out, zoom-in 0.2s ease-out',
        },
      })
    }),
  ],
  daisyui: {
    themes: ['light', 'dark', 'cupcake', 'corporate'], // Add more themes as needed
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
  },
}
