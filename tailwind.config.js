/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxHeight: {
        '[300px]': '300px',
      },
      minHeight: {
        '[200px]': '200px',
      },
    },
  },
  plugins: [],
}
