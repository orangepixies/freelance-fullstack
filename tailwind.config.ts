import type { Config } from 'tailwindcss'
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        fg: '#ffffff',
        accent: '#4EE1C1',
        muted: '#b9b9b9',
        card: '#0b0b0b',
        line: '#1a1a1a'
      },
      boxShadow: {
        glow: '0 0 120px 24px rgba(78,225,193,.18)'
      }
    },
  },
  plugins: [],
} satisfies Config