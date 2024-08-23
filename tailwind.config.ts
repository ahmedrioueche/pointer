import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#ffffff',
          text: '#000000',
          primary: '#1d4ed8',  // Tailwind's blue-700
          secondary: '#9ca3af', // Tailwind's gray-500
          accent: '#f59e0b',   // Tailwind's amber-400
          'accent-hover': '#e67e22', // A darker shade of light-accent
        },
        dark: {
          background: '#1f2937', // Tailwind's gray-800
          text: '#f9fafb',       // Tailwind's gray-100
          primary: '#3b82f6',    // Tailwind's blue-500
          secondary: '#4b5563',  // Tailwind's gray-600
          accent: '#fbbf24',    // Tailwind's amber-300
          'accent-hover': '#d97706', // A more orange and darker shade for better contrast
        },
      },
      fontFamily: {
        satisfy: ['Satisfy', 'serif'],
        stix: ['STIX Two Text', 'serif'],
      },
      
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // Add the scrollbar-hide plugin
  ],
  darkMode: 'class',  // Use 'class' to enable dark mode toggling via class names
};

export default config;
