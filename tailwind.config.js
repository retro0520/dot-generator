/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberPink: '#ff007f',
        cyberCyan: '#00ffcc',
        cyberDark: '#090514',
      },
    },
  },
  plugins: [],
}
