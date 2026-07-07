import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Heraldic Kingdom. Token names are kept stable (gold/deepGold/lightGold)
        // so existing markup re-skins automatically; the values are now brass.
        zn: {
          black: "#100f0c",
          ink: "#0c0b09",
          charcoal: "#171510",
          surface: "#1b1913",
          line: "rgba(200, 162, 74, 0.24)",
          gold: "#c8a24a",
          deepGold: "#8a6d28",
          lightGold: "#e6c874",
          crimson: "#9b3535",
          crimsonBright: "#c0554f",
          emerald: "#6aa84f",
          danger: "#b23b3b",
          parchment: "#efe9db"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Cinzel", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        gold: "0 0 26px rgba(200, 162, 74, 0.18)",
        panel: "0 14px 54px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "gold-radial": "radial-gradient(circle at top, rgba(200,162,74,.22), transparent 36%)"
      }
    }
  },
  plugins: []
};

export default config;
