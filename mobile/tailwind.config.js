/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2ECC71",
        secondary: "#F1C40F",
        background: "#F9F9F9",
        surface: "#FFFFFF",
        textPrimary: "#2C3E50",
        textSecondary: "#7F8C8D",
        accent: "#3498DB",
        error: "#E74C3C",
      },
    },
  },
  plugins: [],
}
