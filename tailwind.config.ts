import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
  animation: {
    slideIn: "slideIn 0.3s ease-out"
  },
  keyframes: {
    slideIn: {
      from: { transform: "translateY(20px)", opacity: "0" },
      to: { transform: "translateY(0)", opacity: "1" }
    }
  }
}
  },
  plugins: [],
};
export default config;
