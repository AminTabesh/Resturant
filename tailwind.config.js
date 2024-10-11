/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}", "./public/cms/*.{html,js}"],  // Ensure consistent paths
  theme: {
    extend: {
      fontFamily: {
        'Dana': ['"Dana"'],
      },
      boxShadow: {
        'green': '0px 0px 10px 2px rgba(23,212,48,1)',
        'white': '0px 0px 10px 2px rgba(255,255,255,1)',
        'red': '0px 0px 10px 2px rgb(244,67,54)',
        'small': '0px 0px 6px 0px rgba(0,0,0,0.2)',
        'regular': '0px 0px 6px 0px rgba(0,0,0,0.3)',
        'big': '0px 0px 6px 0px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'pattern': "url('/public/images/texture.png')",
        'pattern-2': "url('/public/images/pattern.png')",
        'pattern-3': "url('/public/images/pattern2.png')",
      },
      keyframes: {
        'come-in': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0%)' },
        },
        'go-out': {
          '0%': { opacity: '1', transform: 'translateX(0%)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        'modal': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '33%': { opacity: '1', transform: 'translateX(0%)' },
          '66%': { opacity: '1', transform: 'translateX(0%)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        'modal-bar': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        }
      },
      animation: {
        'come-in': 'come-in .5s ease-out',
        'go-out': 'go-out .5s ease-out',
        'modal': 'modal 5s ease-out',
        'modal-bar': 'modal-bar 2s linear'
      },
      opacity: {
        '0': '0',
        '100': '1',
      },
    },
    pointerEvents: {
      'none': 'none',
      'auto': 'auto',
    },
    screens: {
      'desktop': { 'max': '1280px' },
      'tablet': { 'max': '768px' },
      'mobile': { 'max': '578px' },
    },
  },
  plugins: [],
}
