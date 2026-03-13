import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-bg': 'var(--color-bg)',
        'theme-surface': 'var(--color-surface)',
        'theme-surface-2': 'var(--color-surface-2)',
        'theme-border': 'var(--color-border)',
        'theme-text': 'var(--color-text)',
        'theme-muted': 'var(--color-text-muted)',
        'theme-accent': 'var(--color-accent)',
        'theme-accent-bg': 'var(--color-accent-bg)',
      },
    },
  },
  plugins: [],
} satisfies Config