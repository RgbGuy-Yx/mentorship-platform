/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        ripple: "ripple 2.5s ease-in forwards",
      },
      keyframes: {
        ripple: {
          "0%": {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(4)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
}
