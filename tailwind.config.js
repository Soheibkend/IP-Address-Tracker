/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pattern-bg': "url('./images/pattern-bg.png')",
      }
    },
  },
  plugins: [],
}
