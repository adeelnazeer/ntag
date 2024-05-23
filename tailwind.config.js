/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000",
        secondary: "#88C140",
        primaryLight: "#4D4D4D",
      },
      text: {
        20: "20px",
      },
    },
  },
  plugins: [],
};
