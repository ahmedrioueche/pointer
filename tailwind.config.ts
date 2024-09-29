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
          primary: '#8b5cf6',  
          secondary: '#9ca3af', 
          accent: '#6d28d9',   
          'accent-hover': '#dc2626', 
        },
        dark: {
          background: '#1f2937', 
          text: '#f9fafb',      
          primary: '#8b5cf6',  
          secondary: '#4b5563',  
          accent: '#6d28d9',    
          'accent-hover': '#dc2626', 
        },
      },
      fontFamily: {
        satisfy: ['Satisfy', 'serif'],
        stix: ['STIX Two Text', 'serif'],
      },
      
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'), 
  ],
  darkMode: 'class',  
};

export default config;
