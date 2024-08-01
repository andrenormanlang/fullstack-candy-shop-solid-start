/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Include all JS, TS, JSX, and TSX files in the src directory
    './app/**/*.{js,ts,jsx,tsx}', // Include all JS, TS, JSX, and TSX files in the app directory
    './index.html', // Include the main HTML file if applicable
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


