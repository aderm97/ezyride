import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Deep Navy
        secondary: "#334155", // Slate
        cta: "#0369A1", // Vibrant High Contrast Blue
        background: "#020617", // Very Dark background
        card: "rgba(15, 23, 42, 0.4)", // Glassmorphism base
        surface: "rgba(255, 255, 255, 0.05)",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)"],
        body: ["var(--font-montserrat)"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "morph": "morph 8s ease-in-out infinite",
        "liquid": "liquid 10s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", filter: "blur(20px)" },
          "50%": { opacity: "1", filter: "blur(30px)" },
        },
        morph: {
          "0%": { borderRadius: "40% 60% 70% 30% / 40% 40% 60% 50%" },
          "34%": { borderRadius: "70% 30% 50% 50% / 30% 30% 70% 70%" },
          "67%": { borderRadius: "100% 60% 60% 100% / 100% 100% 60% 60%" },
          "100%": { borderRadius: "40% 60% 70% 30% / 40% 40% 60% 50%" },
        },
        liquid: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
