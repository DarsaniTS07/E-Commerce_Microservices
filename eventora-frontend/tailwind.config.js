/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'var(--color-primary-light)',
          DEFAULT: 'var(--color-primary-default)',
          dark: 'var(--color-primary-dark)',
          lightest: 'var(--color-primary-lightest)',
        },
        secondary: {
          light: 'var(--color-secondary-light)',
          DEFAULT: 'var(--color-secondary-default)',
          dark: 'var(--color-secondary-dark)',
          lightest: 'var(--color-secondary-lightest)',
        },
        accent: {
          light: 'var(--color-accent-light)',
          DEFAULT: 'var(--color-accent-default)',
          dark: 'var(--color-accent-dark)',
          lightest: 'var(--color-accent-lightest)',
        },
        neutral: {
          lightest: 'var(--color-neutral-lightest)',
          light: 'var(--color-neutral-light)',
          muted: 'var(--color-neutral-muted)',
          border: 'var(--color-neutral-border)',
          secondary: 'var(--color-neutral-secondary)',
          primary: 'var(--color-neutral-primary)',
          white: 'var(--color-neutral-white)',
        },
        danger: {
          light: 'var(--color-danger-light)',
          DEFAULT: 'var(--color-danger-default)',
          dark: 'var(--color-danger-dark)',
          lightest: 'var(--color-danger-lightest)',
        },
        success: {
          light: 'var(--color-success-light)',
          DEFAULT: 'var(--color-success-default)',
          dark: 'var(--color-success-dark)',
          lightest: 'var(--color-success-lightest)',
        },
        warning: {
          light: 'var(--color-warning-light)',
          DEFAULT: 'var(--color-warning-default)',
          dark: 'var(--color-warning-dark)',
          lightest: 'var(--color-warning-lightest)',
        }
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        premium: 'var(--shadow-premium)',
        glow: 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
}
