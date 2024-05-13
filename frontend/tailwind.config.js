/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/keep-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#309975',
        'custom-green1': 'rgba(88, 179, 104, 1)',
        'custom-green2': 'rgba(88, 179, 104, 0.5)',
        'custom-green3': 'rgba(93, 125, 99, 0.5)',
        'custom-green4': 'rgba(93, 125, 99, 1)'
      },
    },
  },
  plugins: [],
}

