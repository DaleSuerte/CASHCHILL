import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: "#FFE8EF",
        lilac: "#EDE3FF",
        mint: "#DDF6EE",
        ink: "#2A1F3D"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(42, 31, 61, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
