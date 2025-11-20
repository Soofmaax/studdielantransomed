import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Legacy named colors (utilisées directement dans les composants)
        cream: "#F8F5F0",
        sage: "#B2C2B1",
        gold: "#D4B254",

        // Palette neutre pilotée par les variables CSS (globals.css)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Palette primaire (sage) 50–900 + tokens shadcn (DEFAULT/foreground)
        primary: {
          50: "#F7F8F6",
          100: "#E7EEE4",
          200: "#D4DFD1",
          300: "#C1D0BE",
          400: "#B6C7B4",
          500: "#B2C2B1", // teinte principale "sage"
          600: "#94A28F",
          700: "#738072",
          800: "#58635A",
          900: "#3C433D",
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

        // Palette accent (gold) 50–900 + tokens shadcn (DEFAULT/foreground)
        accent: {
          50: "#FDF8EC",
          100: "#FAEED0",
          200: "#F3DF9F",
          300: "#EBCF70",
          400: "#E3C452",
          500: "#D4B254", // teinte principale "gold"
          600: "#BE9F4B",
          700: "#9B7F3D",
          800: "#786230",
          900: "#5C4A26",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;