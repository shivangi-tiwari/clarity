/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          900: '#2C1810',
          800: '#3D2B1F',
          700: '#5C4033',
          600: '#6F4E37',
          500: '#8B6F47',
          400: '#A0845C',
          300: '#C4A882',
          200: '#D4C5A9',
          100: '#E8DCC8',
        },
        cream: {
          50: '#FFFCF7',
          100: '#FFF8F0',
          200: '#FAF3E8',
          300: '#F5EDE0',
          400: '#EDE3D0',
        },
        sage: {
          600: '#5A6B4E',
          500: '#7D8B6E',
          400: '#94A187',
          300: '#B0BDA3',
          200: '#D0D9C6',
        },
        rose: {
          500: '#B8706A',
          400: '#C9908A',
          300: '#DBBAB5',
          200: '#EDD5D2',
        },
      },
      boxShadow: {
        soft: '0 4px 16px rgba(61, 43, 31, 0.08)',
        deep: '0 8px 32px rgba(61, 43, 31, 0.10)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      maxWidth: {
        '8xl': '1200px',
      },
    },
  },
  plugins: [],
};
