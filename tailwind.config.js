/* eslint-disable no-undef */

const withMT = require("@material-tailwind/react/utils/withMT");

/** @see src/constants/brandPalette.js — keep hex values identical */
const brand = {
  blue: "#126094",
  "blue-hover": "#0f4f7c",
  "blue-soft": "#BFD2F0",
  "blue-tint": "#EEF4FF",
  "blue-border-soft": "#D9E6F7",
  "blue-text-muted": "#4A5B73",
  "card-blue": "#F9FBFF",
  green: "#76BC21",
  "green-dark": "#5A9A18",
  "green-muted": "#4E8E12",
  "green-pale": "#E8F5D7",
  "green-label-light": "#9ad45b",
  "green-footer": "#9fd05a",
  "green-nav-border": "#82B736",
  "mint-soft": "#EFF8EA",
  "mint-softer": "#F5FBF4",
};

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000",
        secondary: "#8dc63f",
        brand,
      },
    },
  },
  plugins: [],
});