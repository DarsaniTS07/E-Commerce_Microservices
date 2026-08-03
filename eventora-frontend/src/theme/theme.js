export const theme = {
  colors: {
    primary: {
      light: '#A78BFA', // Purple 400
      DEFAULT: '#7C3AED', // Purple 600
      dark: '#6D28D9', // Purple 700
      lightest: '#F5F3FF', // Purple 50
    },
    secondary: {
      light: '#F472B6', // Pink 400
      DEFAULT: '#EC4899', // Pink 500
      dark: '#DB2777', // Pink 600
      lightest: '#FDF2F8', // Pink 50
    },
    accent: {
      light: '#FB923C', // Orange 400
      DEFAULT: '#F97316', // Orange 500
      dark: '#EA580C', // Orange 600
      lightest: '#FFF7ED', // Orange 50
    },
    neutral: {
      lightest: '#F8FAFC', // Slate 50
      light: '#F1F5F9', // Slate 100
      muted: '#E2E8F0', // Slate 200
      border: '#CBD5E1', // Slate 300
      secondary: '#475569', // Slate 600
      primary: '#0F172A', // Slate 900
      white: '#FFFFFF',
    },
    danger: {
      light: '#FCA5A5',
      DEFAULT: '#EF4444',
      dark: '#B91C1C',
      lightest: '#FEF2F2',
    },
    success: {
      light: '#86EFAC',
      DEFAULT: '#22C55E',
      dark: '#15803D',
      lightest: '#F0FDF4',
    },
    warning: {
      light: '#FDE047',
      DEFAULT: '#EAB308',
      dark: '#A16207',
      lightest: '#FEFCE8',
    }
  },
  gradients: {
    brand: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #F97316 100%)',
    brandHover: 'linear-gradient(135deg, #6D28D9 0%, #DB2777 50%, #EA580C 100%)',
    purplePink: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    pinkOrange: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    medium: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
    premium: '0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
    glow: '0 0 15px rgba(124, 58, 237, 0.15)',
  }
};
