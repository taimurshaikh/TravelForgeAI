/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-.*/,      
    },
    {
      pattern: /text-.*/,      
    },
    {
      pattern: /border-.*/,      
    },
    // Add more patterns here for from, via, to, etc.
    {
      pattern: /from-.*/,
    },
    {
      pattern: /via-.*/,
    },
    {
      pattern: /to-.*/,
    }
  ],
}
