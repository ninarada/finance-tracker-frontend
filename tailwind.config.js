/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          10: "#f4f2f5",
          50: "#E9EAFE",
          100: "#BCBEFB",
          200: "#8F93F8",
          250: "#8184e6",
          300: "#5F66F5",
          400: "#644af7",
          500: "#5917d4",
          600: "#480da6",
          700: "#513380",
        },
        success: {
          DEFAULT: "#22C55E", // green-500
          light: "#BBF7D0",   // green-200
          dark: "#15803D",    // green-700
        },
        warning: {
          DEFAULT: "#FACC15", // yellow-400
          light: "#FEF9C3",   // yellow-200
          dark: "#CA8A04",    // yellow-700
        },
        error: {
          DEFAULT: "#EF4444", // red-500
          light: "#FECACA",   // red-200
          dark: "#B91C1C",    // red-700
        },
        text: {
          DEFAULT: "#1E293B", // slate-800
          light: "#64748B",   // slate-400
          muted: "#94A3B8",   // slate-300
          inverse: "#FFFFFF",
        },
        background: {
          light: "#FFFFFF",   // slate-50 F8FAFC
          dark: "#0F172A",    // slate-900
        },
      },
    },
  },
  plugins: [],
}