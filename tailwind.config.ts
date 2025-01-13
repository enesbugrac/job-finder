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
        primary: {
          DEFAULT: "#0F172A",
          hover: "#1E293B",
        },
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8FAFC",
        },
        text: {
          DEFAULT: "#0F172A",
          secondary: "#64748B",
        },
        border: {
          DEFAULT: "#E2E8F0",
          hover: "#CBD5E1",
        },
        error: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
        },
      },
    },
  },
  plugins: [],
};

export default config;
