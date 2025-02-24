/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        brand: '#0EA5E9',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
    darkTheme: "light",
  },
} 