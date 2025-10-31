/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4338CA",
        accent: "#3B82F6",
        success: "#10B981",
        warning: "#EF4444",
        neutral: "#F9FAFB",
        textF: "#6B7280",
        textM: "#1F2937",
      },
    },
  },
  plugins: [],
};
