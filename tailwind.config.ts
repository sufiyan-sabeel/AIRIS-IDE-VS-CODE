import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'airis': {
          'black': '#000000',
          'graphite': '#0a0a0a',
          'surface': '#121212',
          'surface-2': '#1a1a1a',
          'surface-3': '#242424',
          'border': '#2a2a2a',
          'border-light': '#333333',
          'text': '#e0e0e0',
          'text-secondary': '#a0a0a0',
          'text-muted': '#666666',
          'accent': { DEFAULT: '#007acc', hover: '#1a8ad4', muted: '#094771' },
          'cyan': '#4fc1ff',
          'green': '#4ec9b0',
          'red': '#f44747',
          'yellow': '#d7ba7d',
        },
      },
      fontFamily: {
        mono: ['Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
      height: {
        'header': '48px',
        'header-landscape': '40px',
        'nav': '56px',
        'nav-landscape': '48px',
      },
      animation: {
        'slide-left': 'slideLeft 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slideRight 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 200ms ease-out',
      },
      keyframes: {
        slideLeft: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
        slideRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        slideUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
