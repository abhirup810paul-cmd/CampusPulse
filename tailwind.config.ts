import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        surface: "var(--surface)",
        'surface-2': "var(--surface-2)",
        'surface-3': "var(--surface-3)",
        border: "var(--border)",
        'border-strong': "var(--border-strong)",
        text: "var(--text)",
        'text-2': "var(--text-2)",
        'text-3': "var(--text-3)",
        ring: "var(--ring)",
        'c-soft': "var(--c-soft)",
        'c-soft-2': "var(--c-soft-2)",
        'c-ink': "var(--c-ink)",
        'c-line': "var(--c-line)",
        'c-base': "var(--c)",
      },
      fontFamily: {
        display: "var(--font-display)",
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      }
    },
  },
  plugins: [],
};
export default config;
