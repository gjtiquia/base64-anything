/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#3498db',
          dark: '#2980b9',
        },
        green: {
          DEFAULT: '#2ecc71',
          dark: '#27ae60',
        }
      },
      boxShadow: {
        'custom': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 2px 10px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'custom': '8px',
      },
    },
  },
  plugins: [],
}

