import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080A", 900: "#0B0D10", 800: "#14161A", 700: "#1C1F24",
          600: "#262A31", 500: "#3A3F47", 400: "#5A616B", 300: "#8A919C",
          200: "#C3C8D0", 100: "#E4E7EB", 50: "#F2F4F6",
        },
        brand: {
          DEFAULT: "#E10600", 700: "#8F0400", 600: "#B30500",
          500: "#FF2D20", 400: "#FF5A4E", 100: "#FFE1DF", 50: "#FFF1F0",
        },
        aurora: {
          blue: "#4285F4", cyan: "#00C8E5", purple: "#A142F4",
          pink: "#F439A0", lime: "#00E38C",
        },
        surface: {
          paper: "#F7F8FA", white: "#FFFFFF",
          glass: "rgba(255,255,255,0.65)", dark: "#0B0D10",
        },
        semantic: { success: "#00E38C", warning: "#FFB020", error: "#FF4438" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
        "6xl": ["3.75rem", { lineHeight: "1.1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
      },
      spacing: {
        "0": "0px", "0.5": "2px", "1": "4px", "1.5": "6px", "2": "8px",
        "2.5": "10px", "3": "12px", "3.5": "14px", "4": "16px", "5": "20px",
        "6": "24px", "7": "28px", "8": "32px", "9": "36px", "10": "40px",
        "11": "44px", "12": "48px", "14": "56px", "16": "64px", "20": "80px",
      },
      borderRadius: {
        sm: "4px", DEFAULT: "8px", md: "12px", lg: "16px",
        xl: "20px", "2xl": "24px", "3xl": "32px", full: "9999px",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(225,6,0,0.45)",
        "glow-aurora": "0 0 60px -12px rgba(161,66,244,0.35)",
        glass: "0 8px 32px rgba(11,13,16,0.08)",
        lift: "0 20px 40px -12px rgba(11,13,16,0.18)",
      },
      transitionTimingFunction: {
        swift: "cubic-bezier(0.22, 1, 0.36, 1)",
        snap: "cubic-bezier(0.2, 0, 0, 1)",
        glide: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        aurora: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
        rise: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "slash-in": { "0%": { opacity: "0", transform: "skewX(-18deg) translateX(-1.4em)" }, "100%": { opacity: "1", transform: "skewX(-18deg) translateX(0)" } },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: ".5" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-33.3333%)" } },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "70%": { transform: "scale(2.2)", opacity: "0" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-down": { "0%": { opacity: "0", transform: "translateY(-8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        aurora: "aurora 8s ease infinite",
        marquee: "marquee 40s linear infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        shimmer: "shimmer 1.4s infinite linear",
        rise: "rise 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "slash-in": "slash-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scale-in": "scale-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.3s ease-out both",
        "slide-down": "slide-down 0.2s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-up": "slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-left": "slide-left 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
