/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-primary': '#101D35',
        'navy-deep': '#1C3455',
        'blue-royal': '#1C3455',
        'gold-accent': '#D9A441',
        'glacier-teal': '#6FA8B2',
        'ivory-bg': '#F7F6F2',
        'dark-text': '#202A36',
        'muted-text': '#5E6B7A',
        'border-subtle': '#E2E6EB',
        'success-green': '#16845B',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        serif: ['Montserrat', 'sans-serif'],
        sans: ["'Segoe UI'", 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        body: ["'Segoe UI'", 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      maxWidth: {
        'site': '1440px',
      },
      objectPosition: {
        'mountain-focus': 'center 32%',
      },
    },
  },
  plugins: [],
};
