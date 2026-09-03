// tailwind.config.js
import { heroui } from "@heroui/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}", // penting
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};