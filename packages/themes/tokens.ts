/**
 * Design Tokens for VueStream
 * 
 * Centralized design token definitions following the design system architecture
 */

export interface ColorToken {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export interface ThemeTokens {
  colors: {
    primary: ColorToken
    surface: ColorToken & { 0: string }
    text: {
      primary: string
      secondary: string
      muted: string
      inverse: string
    }
    border: {
      light: string
      medium: string
      strong: string
    }
    status: {
      success: string
      warning: string
      error: string
      info: string
    }
  }
  typography: {
    fontFamily: {
      sans: string[]
      mono: string[]
    }
    fontSize: {
      caption: [string, { lineHeight: string }]
      body: [string, { lineHeight: string }]
      label: [string, { lineHeight: string }]
      headline: [string, { lineHeight: string }]
      title: [string, { lineHeight: string }]
    }
    fontWeight: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }
  radius: {
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    soft: string
    medium: string
    strong: string
  }
  animation: {
    duration: {
      fast: string
      medium: string
      slow: string
    }
    easing: {
      linear: string
      easeIn: string
      easeOut: string
      easeInOut: string
    }
  }
}

export const baseTokens: ThemeTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    surface: {
      0: '#ffffff',
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      muted: '#9ca3af',
      inverse: '#f9fafb',
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      strong: '#9ca3af',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
    },
    fontSize: {
      caption: ['0.75rem', { lineHeight: '1rem' }],
      body: ['1rem', { lineHeight: '1.5rem' }],
      label: ['0.875rem', { lineHeight: '1.25rem' }],
      headline: ['1.5rem', { lineHeight: '2rem' }],
      title: ['2rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    soft: '0 2px 8px 0 rgb(0 0 0 / 0.08)',
    medium: '0 4px 12px 0 rgb(0 0 0 / 0.1)',
    strong: '0 8px 24px 0 rgb(0 0 0 / 0.12)',
  },
  animation: {
    duration: {
      fast: '150ms',
      medium: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
}