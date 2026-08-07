import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f4f9f5",
          100: "#e6f2e8",
          200: "#c8e4cc",
          300: "#9bc4a3",
          400: "#7aad84",
          500: "#5a9262",
          600: "#46764d",
          700: "#3a5f3f",
          800: "#2d5a3d",
          900: "#1e3d28",
        },
        offwhite: "#f9faf9",
        charcoal: "#171717",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;