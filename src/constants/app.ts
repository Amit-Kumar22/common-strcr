export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'hiprotech_access_token',
  REFRESH_TOKEN: 'hiprotech_refresh_token',
  USER_PREFERENCES: 'hiprotech_user_prefs',
  THEME: 'hiprotech_theme',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  PRODUCTS: '/products',
  ORDERS: '/orders',
  USERS: '/users',
} as const;