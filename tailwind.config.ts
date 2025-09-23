import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        board: {
          light: '#F0D9B5',
          dark: '#B58863',
          'light-hover': '#F4E1C1',
          'dark-hover': '#C4976D',
        },
        highlight: {
          move: '#829769',
          selected: '#BACA44',
          danger: '#E63946',
          lastMove: 'rgba(255, 255, 0, 0.4)',
        },
        chess: {
          primary: '#769656',
          secondary: '#EEEED2',
        }
      },
      animation: {
        'piece-move': 'pieceMove 0.3s ease-in-out',
        'piece-capture': 'pieceCapture 0.4s ease-in-out',
      },
      keyframes: {
        pieceMove: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        pieceCapture: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.2) rotate(10deg)' },
          '100%': { transform: 'scale(0) rotate(20deg)', opacity: '0' },
        },
      },
      fontFamily: {
        'chess': ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
export default config