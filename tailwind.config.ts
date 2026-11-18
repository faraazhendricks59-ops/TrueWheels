import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080A", 900: "#0B0D10", 800: "#14161A", 700: "#1C1F24",
          600: "#262A31",
          // 500 and 400 are the muted text steps, and they flip with the theme.
          // They cannot be a fixed value: a grey dark enough to pass AA on white
          // (#5A616B, 6.3:1) is illegible on the dark page (3.1:1), and the
          // lighter grey that reads on the dark page fails on white. Declared as
          // raw channels so the opacity modifier (`text-ink-400/50`) still works;
          // the two sets of values live in globals.css and swap under `.dark`.
          500: "rgb(var(--ink-500) / <alpha-value>)",
          400: "rgb(var(--ink-400) / <alpha-value>)",
          300: "#8A919C",
          200: "#C3C8D0", 100: "#E4E7EB", 50: "#F2F4F6",
        },
        brand: {
          DEFAULT: "#E10600", 700: "#8F0400", 600: "#B30500",
          500: "#FF2D20", 400: "#FF5A4E", 100: "#FFE1DF", 50: "#FFF1F0",
        },
        // The "aurora" family was five saturated hues (Google blue, neon cyan,
        // violet, hot pink, neon lime) used as chrome on informational notes,
        // relevance badges and AI pills. Five competing accents is the palette of a
        // demo; a marketplace uses one brand colour and a neutral. These are muted
        // to conventional, accessible tones, and `purple` in particular — which
        // marked every "AI" affordance — is now a neutral slate, so AI chrome stops
        // shouting in a different colour from everything else.
        aurora: {
          blue: "#2563EB", cyan: "#0891B2", purple: "#475569",
          pink: "#BE185D", lime: "#15803D",
          // Badge text sits on a 5% tint of its own colour, and sometimes on a
          // second tinted cell beneath that, which lifts the backdrop enough that
          // the base blue lands at 3.9:1. This darker step clears AA on the
          // stacked tint. Icons keep the base blue.
          "blue-dark": "#1D4ED8",
          // The base blue is 3.8:1 on the dark page background. Link and tag text
          // in dark mode uses this lighter step instead.
          "blue-light": "#60A5FA",
          // `purple` is a slate used for AI chrome, and at 2.50:1 on the dark
          // page it is the worst offender in the palette. This lighter step is
          // for text in dark mode; the base stays for fills and borders.
          "purple-light": "#94A3B8",
        },
        surface: {
          paper: "#F7F8FA", white: "#FFFFFF",
          glass: "rgba(255,255,255,0.65)", dark: "#0B0D10",
        },
        // Accessible, print-like values. The previous set (#00E38C neon green,
        // #FFB020) read as a game HUD rather than a marketplace: the green failed
        // contrast on white for any text use, and the trio together was the single
        // loudest "this is a demo" signal in the palette. These clear 4.5:1 on white.
        semantic: {
          success: "#15803D",
          warning: "#B45309",
          error: "#DC2626",
          // Badge text on a 5% tint of its own colour, over a second tinted cell,
          // reaches only 4.41:1. This darker step clears AA on the stacked tint.
          // Icons and larger text keep `success`.
          "success-dark": "#166534",
          // On the dark palette the base green reaches only 3.45:1 on its own
          // tint. This lighter step is for text in dark mode; fills keep the base.
          "success-light": "#22C55E",
        },
        // Chat surfaces. The messaging screens use the outgoing/incoming pair a
        // chat app is recognised by, plus the two wallpaper tints the thread sits
        // on. Kept separate from `brand` (a red) because an outgoing bubble is
        // green in every chat product a reader has used, and red would read as an
        // error rather than a message they wrote.
        chat: {
          outgoing: "#D9FDD3",
          "outgoing-dark": "#005C4B",
          incoming: "#FFFFFF",
          "incoming-dark": "#202C33",
          wallpaper: "#EFEAE2",
          "wallpaper-dark": "#0B141A",
        },
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
      // A marketplace is closer to print than to a mobile app: tight corners read
      // as considered, large ones as a toy. The old scale (2xl at 24px) rounded
      // every card like a pill; this one keeps cards crisp and buttons nearly square.
      borderRadius: {
        sm: "3px", DEFAULT: "6px", md: "8px", lg: "10px",
        xl: "12px", "2xl": "14px", "3xl": "18px", full: "9999px",
      },
      // Elevation is a neutral, low-spread shadow. The red "glow" that sat under
      // every primary button and the 40px "lift" under every card were the most
      // obviously synthetic effects on the site. `glow` is kept as a name so no
      // surface breaks, but it now resolves to the same quiet card shadow.
      boxShadow: {
        card: "0 1px 2px 0 rgb(16 24 40 / 0.05), 0 1px 3px 0 rgb(16 24 40 / 0.05)",
        lift: "0 4px 12px -2px rgb(16 24 40 / 0.10), 0 2px 6px -2px rgb(16 24 40 / 0.06)",
        glass: "0 4px 16px rgb(11 13 16 / 0.06)",
        glow: "0 1px 2px 0 rgb(16 24 40 / 0.05), 0 1px 3px 0 rgb(16 24 40 / 0.05)",
        "glow-aurora": "0 1px 2px 0 rgb(16 24 40 / 0.05)",
      },
      transitionTimingFunction: {
        swift: "cubic-bezier(0.22, 1, 0.36, 1)",
        snap: "cubic-bezier(0.2, 0, 0, 1)",
        glide: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // Motion scale. Four steps so durations stop being ad-hoc `0.3s`/`0.6s`
      // literals scattered across components. `fast` is for a control answering a
      // pointer (hover, press); `base` for a small state change; `slow` for
      // something entering the viewport; `hero` for a one-off, page-level moment.
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
        hero: "600ms",
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
        // A single diagonal highlight crossing a control on hover. The whole effect
        // is one pass of a soft gradient, so it reads as a polished surface catching
        // the light rather than as decoration.
        sheen: {
          "0%": { transform: "translateX(-160%) skewX(-12deg)" },
          "100%": { transform: "translateX(340%) skewX(-12deg)" },
        },
        // Entrance that resolves out of a blur. This is the "high clarity" motion:
        // the content arrives soft and snaps into focus, which draws the eye to what
        // just appeared far better than a slide alone.
        "focus-in": {
          "0%": { opacity: "0", filter: "blur(10px)", transform: "translateY(8px) scale(0.99)" },
          "100%": { opacity: "1", filter: "blur(0px)", transform: "translateY(0) scale(1)" },
        },
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
        // Exposed as an animation as well as a keyframe so the entrance can be
        // replayed imperatively (a tab switch) without a transition pair.
        "focus-in": "focus-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        sheen: "sheen 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-down": "slide-down 0.2s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-up": "slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-left": "slide-left 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
