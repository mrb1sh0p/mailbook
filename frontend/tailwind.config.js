/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          600: '#2563eb',
          700: '#1d4ed8'
        },
        'green': {
          600: '#16a34a',
          700: '#15803d'
        }
      }
    }
  },
  plugins: [],
}

