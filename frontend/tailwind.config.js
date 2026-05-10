/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyber': {
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '200': '#bae6fd',
          '300': '#7dd3fc',
          '400': '#38bdf8',
          '500': '#0ea5e9',
          '600': '#0284c7',
          '700': '#0369a1',
          '800': '#075985',
          '900': '#0c3d66',
          '950': '#051e3e',
        },
        'dark': {
          '50': '#f8f8f8',
          '100': '#f1f1f1',
          '200': '#e8e8e8',
          '300': '#d8d8d8',
          '400': '#b4b4b4',
          '500': '#989898',
          '600': '#707070',
          '700': '#505050',
          '800': '#282828',
          '900': '#1a1a1a',
          '950': '#0f0f0f',
        },
      },
      backgroundColor: {
        'surface': 'rgb(15, 15, 15)',
        'surface-alt': 'rgb(25, 25, 25)',
        'surface-hover': 'rgb(35, 35, 35)',
      },
      textColor: {
        'subtle': 'rgb(140, 140, 140)',
        'muted': 'rgb(100, 100, 100)',
      },
      borderColor: {
        'subtle': 'rgb(40, 40, 40)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(14, 165, 233, 0.8)' },
        },
        'scan': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
