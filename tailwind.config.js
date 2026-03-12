/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: "#224c87",
        brandRed: "#da3832",
        brandGray: "#919090",
      },
      fontFamily: {
        sans: ["Montserrat", "Arial", "Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
