/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'brand-mint': '#48CBB0',
        'brand-mint-light': '#7DDBC8',
        'brand-mint-dark': '#3AA896',

        'expert-navy': '#1A2B45',
        'expert-navy-light': '#2A3F5F',
        'expert-navy-dark': '#0F1A2A',

        // Accent Colors
        'match-gold': '#D4AF37',
        'match-gold-light': '#E5C85C',
        'tier-verified': '#007AFF',

        // Functional Colors - Labor Intensity
        'intensity-safe': '#34C759',
        'intensity-mid': '#FF9500',
        'intensity-high': '#FF3B30',

        // Status Colors
        'success': '#34C759',
        'warning': '#FF9500',
        'error': '#FF3B30',
        'info': '#007AFF',

        // Neutral Colors
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8F9FA',
        'bg-tertiary': '#E9ECEF',

        'text-primary': '#1A2B45',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',

        'border-light': '#E5E7EB',
        'border-default': '#D1D5DB',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'nudge': '0 10px 15px -3px rgba(72, 203, 176, 0.2)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-mint': 'pulseMint 2s infinite',
        'count-up': 'countUp 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseMint: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(72, 203, 176, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(72, 203, 176, 0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
