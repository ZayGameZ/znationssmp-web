import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        zn: {
          black: "#050505",
          ink: "#090909",
          charcoal: "#0d0f10",
          surface: "#141414",
          line: "rgba(212, 175, 55, 0.22)",
          gold: "#d4af37",
          deepGold: "#9f741c",
          lightGold: "#f5d76e",
          emerald: "#22c55e",
          danger: "#ef4444"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        gold: "0 0 28px rgba(212, 175, 55, 0.18)",
        panel: "0 14px 60px rgba(0, 0, 0, 0.4)"
      },
      backgroundImage: {
        "gold-radial": "radial-gradient(circle at top, rgba(212,175,55,.25), transparent 36%)"
      }
    }
  },
  plugins: []
};

export default config;
