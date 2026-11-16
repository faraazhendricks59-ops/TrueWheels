import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "rgb(var(--brand-red) / <alpha-value>)",
          "red-dark": "rgb(var(--brand-red-dark) / <alpha-value>)",
          graphite: "rgb(var(--brand-graphite) / <alpha-value>)",
          silver: "rgb(var(--brand-silver) / <alpha-value>)",
        },
        surface: {
          white: "rgb(var(--surface-white) / <alpha-value>)",
          grey: "rgb(var(--surface-grey) / <alpha-value>)",
        },
        semantic: {
          success: "rgb(var(--semantic-success) / <alpha-value>)",
          warning: "rgb(var(--semantic-warning) / <alpha-value>)",
          "warning-soft": "rgb(var(--semantic-warning-soft) / <alpha-value>)",
          error: "rgb(var(--semantic-error) / <alpha-value>)",
        },
        neutral: {
          muted: "rgb(var(--neutral-muted) / <alpha-value>)",
          subtle: "rgb(var(--neutral-subtle) / <alpha-value>)",
          line: "rgb(var(--neutral-line) / <alpha-value>)",
          hover: "rgb(var(--neutral-hover) / <alpha-value>)",
          strong: "rgb(var(--neutral-strong) / <alpha-value>)",
        },
      },
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"] },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
