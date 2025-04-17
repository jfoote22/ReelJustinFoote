import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        shimmer: {
          '0%': { 
            borderColor: 'rgba(107, 114, 128, 0.1)',
            boxShadow: '0 0 5px rgba(255,255,255,0.1), inset 0 0 5px rgba(255,255,255,0.1)'
          },
          '25%': {
            borderColor: 'rgba(147, 154, 168, 0.3)',
            boxShadow: '0 0 10px rgba(255,255,255,0.2), inset 0 0 10px rgba(255,255,255,0.2)'
          },
          '50%': { 
            borderColor: 'rgba(167, 174, 188, 0.5)',
            boxShadow: '0 0 15px rgba(255,255,255,0.3), inset 0 0 15px rgba(255,255,255,0.3)'
          },
          '75%': {
            borderColor: 'rgba(147, 154, 168, 0.3)',
            boxShadow: '0 0 10px rgba(255,255,255,0.2), inset 0 0 10px rgba(255,255,255,0.2)'
          },
          '100%': { 
            borderColor: 'rgba(107, 114, 128, 0.1)',
            boxShadow: '0 0 5px rgba(255,255,255,0.1), inset 0 0 5px rgba(255,255,255,0.1)'
          }
        }
      }
    },
  },
  plugins: [],
};
export default config;
