export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: {
    HOME: '/dashboard',
    PORTFOLIO: '/dashboard/portfolio',
    PROPERTIES: '/dashboard/properties',
    ANALYTICS: '/dashboard/analytics',
    SETTINGS: '/dashboard/settings',
  },
  LEGAL: {
    PRIVACY: '/privacy',
    TERMS: '/terms',
    SUPPORT: '/support',
  }
} as const;
