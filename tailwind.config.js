import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#064e3b",
        secondary: "#22c55e",
        accent: "#10b981",
        dark: "#064e3b",
      },
    },
  },
  plugins: [tailwindAnimate],
};
