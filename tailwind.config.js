/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // "custom-bg": "#28282B",
        "custom-bg": "#333333",
        "custom-blue": "#1D4ED8",
        "custom-ylw": "#FDB623",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
      },
      boxShadow: {
        "3xl": "1px 1px 5px #fdb623",
      },
    },
  },
  plugins: [],
};
