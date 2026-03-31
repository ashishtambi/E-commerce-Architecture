/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#f8f7f4',
          dark: '#111827',
          accent: '#b7791f',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
