import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050208",      // near-black backdrop, faint blue-black depth
        panel: "#0c0509",     // slightly lifted panel black
        crimson: {
          deep: "#5c0a17",    // shadow red
          core: "#b3122b",    // primary brand red
          hot: "#ff2f47",     // rim-light / glow red
          glow: "#ff6b7a",    // hottest highlight
        },
        ash: "#9c9198",       // muted body text
        bone: "#f5ecec",      // near-white text
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "crimson-radial":
          "radial-gradient(circle at 50% 30%, rgba(179,18,43,0.35), rgba(5,2,8,0) 60%)",
        "crimson-fade":
          "linear-gradient(180deg, #050208 0%, #180509 45%, #05020a 100%)",
      },
      letterSpacing: {
        widest2: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
