/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': '#050505',
        'accent-color': '#00e5ff',
        'text-primary': '#ffffff',
        'text-secondary': '#999999',
      }
    },
  },
  plugins: [],
}
