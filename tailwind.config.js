/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // "custom-bg": "#28282B",
        "custom-bg": "#FFF3E0",
        "custom-blue": "#1D4ED8",
        "custom-green": "#43A047",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
      },
      boxShadow: {
        "3xl": "1px 1px 5px #43A047",
      },
    },
  },
  plugins: [],
};
