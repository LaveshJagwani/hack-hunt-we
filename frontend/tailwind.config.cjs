/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#fbf4e8",
        ink: "#111111",
        sand: "#f1e2ca",
        mustard: "#ffc93c",
        cherry: "#ff6b4a",
        sky: "#7ac4ff",
        mint: "#a9d98f",
        butter: "#ffe588",
        blush: "#ffc4d6"
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"]
      },
      boxShadow: {
        brutal: "8px 8px 0 #111111",
        "brutal-sm": "5px 5px 0 #111111",
        tape: "0 16px 35px rgba(17, 17, 17, 0.14)"
      }
    }
  },
  plugins: []
};
