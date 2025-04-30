/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind schaut in all diesen Dateien nach, ob Klassen vorkommen
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        // "Inter" als Standardschrift für Sans-Serif
        sans: ["Inter", "sans-serif"],

        // "Playfair Display" als Option "font-playfair"
        playfair: ["Playfair Display", "serif"],
      },

      // Wenn du weitere Theme-Einstellungen vornehmen willst (Farben, Spacing etc.), kannst du das hier ergänzen
      colors: {
        // Beispiel: Du könntest hier deine Corporate Farben definieren.
        // 'brand-creme': '#F8F5F2',
        // 'brand-brown': '#4B2E2B',
        // ...
      },
    },
  },
  plugins: [],
};
