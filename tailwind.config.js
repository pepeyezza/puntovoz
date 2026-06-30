/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        principal: "#1c2a38",
        secundario: "#f5f2eb",
        acento: "#c87a62",
        joven: "#f4a900",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-sora)", "sans-serif"],
        logo: ["var(--font-poppins)", "sans-serif"],
      },
      maxWidth: {
        editorial: "72rem",
      },
    },
  },
  plugins: [],
};
