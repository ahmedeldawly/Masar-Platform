import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#050507",
          soft: "#090A12",
          deep: "#0D1020",
        },
        neon: {
          blue: "#00A8FF",
          bluedeep: "#2563EB",
          pink: "#FF2D95",
          pinksoft: "#EC4899",
          purple: "#8B5CF6",
        },
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #2563EB 0%, #8B5CF6 50%, #FF2D95 100%)",
        "gradient-glow":
          "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.25), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(139,92,246,0.35)",
        "glow-pink": "0 0 40px rgba(255,45,149,0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
