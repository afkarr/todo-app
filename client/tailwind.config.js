/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          500: '#1976d2',
          600: '#1565c0',
          700: '#0d47a1',
        },
        success: {
          500: '#4caf50',
          600: '#45a049',
        },
        error: {
          500: '#f44336',
          600: '#d32f2f',
        }
      },
    },
  },
  plugins: [],
}