import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f8ff",
          100: "#e6f1ff",
          200: "#bfdcff",
          300: "#99c7ff",
          400: "#4d9dff",
          500: "#0073ff",
          600: "#0068e6",
          700: "#004599",
          800: "#003375",
          900: "#002450"
        }
      }
    }
  },
  plugins: []
};

export default config;
