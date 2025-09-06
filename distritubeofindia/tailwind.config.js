/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0077CC',   // For logo, headings, main buttons
        secondary: '#28A745', // For "Create Post" or success actions
        accent: '#FF8800',    // For highlights like "Donate"
        textdark: '#333333',  // For body text
        background: '#FFFFFF' // For page background
      }
    }
  },
  plugins: [],
}
