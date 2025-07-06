import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Core Colors
        "deep-navy": "#1a1b26",
        "dark-slate": "#24283b",
        "slate-gray": "#414868",
        "text-primary": "#c0caf5",
        "text-secondary": "#9aa5ce",
        "text-muted": "#565f89",

        // Accent Colors
        "bright-purple": "#7c3aed",
        "bright-cyan": "#06b6d4",
        "soft-purple": "#a855f7",
        "electric-blue": "#0ea5e9",

        // Status Colors
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        "button-gradient": "linear-gradient(135deg, #7c3aed, #06b6d4)",
        "text-gradient": "linear-gradient(135deg, #7c3aed, #06b6d4)",
        "cyber-grid":
          "linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px)",
      },
      boxShadow: {
        "purple-glow": "0 0 20px rgba(124, 58, 237, 0.3)",
        "cyan-glow": "0 0 20px rgba(6, 182, 212, 0.3)",
        "glow-intense": "0 0 30px rgba(124, 58, 237, 0.5)",
        premium: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.6s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
