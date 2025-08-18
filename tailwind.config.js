/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        medical: {
          blue: '#4f8cc9',
          lightBlue: '#e6f3ff',
          green: '#10b981',
          red: '#ef4444',
          orange: '#f59e0b',
        }
      },
    },
  },
  plugins: [],
}
