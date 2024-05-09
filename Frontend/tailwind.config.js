/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gradientBorder: {
          'red-yellow-green': 'linear-gradient(to right, red, yellow, green)',
          // Define any other gradient colors you need here
        },
      },
    },
  },
  plugins: [],
}

