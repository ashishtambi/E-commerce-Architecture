/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './contexts/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#f8f5f0',
          dark: '#0f172a',
        },
        accent: {
          100: '#fdf2d8',
          200: '#f8dca3',
          400: '#d9a85d',
          600: '#9e6d30',
        },
      },
      fontFamily: {
        serifDisplay: ['var(--font-playfair)', 'serif'],
        sansBody: ['var(--font-manrope)', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 50px -22px rgba(158, 109, 48, 0.5)',
      },
      backgroundImage: {
        'linen-pattern': "radial-gradient(circle at 1px 1px, rgba(158, 109, 48, 0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
