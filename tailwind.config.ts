/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: {
          deepest: '#0D0D1A',
          primary: '#1A1A2E',
          surface: '#16213E',
          interactive: '#0F3460',
        },
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#E94560',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: '#F5A623',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // AI Mirror custom colors
        'ai-deepest': '#0D0D1A',
        'ai-primary': '#1A1A2E',
        'ai-surface': '#16213E',
        'ai-interactive': '#0F3460',
        'ai-rose': '#E94560',
        'ai-rose-hover': '#F05A73',
        'ai-amber': '#F5A623',
        'ai-text': '#F1F1F6',
        'ai-text-secondary': '#A6A6B3',
        'ai-text-muted': '#6B6B7B',
        'ai-presence-online': '#4ADE80',
        'ai-presence-away': '#F5A623',
        'ai-presence-offline': '#6B6B7B',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'ai-sm': '6px',
        'ai-md': '12px',
        'ai-lg': '16px',
      },
      boxShadow: {
        'ai-avatar': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'ai-bubble': '0 2px 12px rgba(0, 0, 0, 0.2)',
        'ai-card': '0 4px 24px rgba(0, 0, 0, 0.25)',
        'ai-glow': '0 0 20px rgba(233, 69, 96, 0.3)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 250ms ease-out',
        'slide-up': 'slide-up 250ms ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
}
