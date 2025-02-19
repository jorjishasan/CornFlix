/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Netflix Sans', 'Graphik', 'Helvetica Neue', 'sans-serif'],
        display: ['Netflix Sans Display', 'Graphik', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
