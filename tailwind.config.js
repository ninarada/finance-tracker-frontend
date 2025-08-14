/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    'bg-error',
    'bg-error-light',
    'bg-error-dark',
    'bg-success',
    'bg-success-light',
    'bg-success-dark',
    'bg-warning',
    'bg-warning-light',
    'bg-warning-dark',
    'bg-primary-10',
    'bg-primary-50',
    'bg-primary-100',
    'bg-primary-200',
    'bg-primary-300',
    'bg-primary-400',
    'bg-primary-500',
    'bg-primary-600',
    'bg-primary-700',
  ],
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
          DEFAULT: "#22C55E", 
          light: "#BBF7D0",   
          dark: "#15803D",   
        },
        warning: {
          DEFAULT: "#FACC15",
          light: "#FEF9C3",   
          dark: "#CA8A04",    
        },
        error: {
          DEFAULT: "#EF4444", 
          light: "#FECACA",   
          dark: "#B91C1C",    
        },
        text: {
          DEFAULT: "#1E293B", 
          light: "#64748B",   
          muted: "#94A3B8",   
          inverse: "#FFFFFF",
        },
        background: {
          light: "#FFFFFF",   
          dark: "#0F172A",    
        },
      },
    },
  },
  plugins: [],
}