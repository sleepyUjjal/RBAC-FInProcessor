/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#333333', // Dark text & sidebars
        gold: '#A4863D',     // Buttons & highlights
        lavender: '#E6E6FA', // Light backgrounds/accents
        forest: '#0E300E',   // Success states or dark accents
      },
      fontFamily: {
        serif: ['"Libre Baskerville"', 'Baskerville', 'serif'],
        sans: ['"Josefin Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}