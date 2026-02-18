export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  ADMIN: '/admin',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.UNAUTHORIZED,
  ROUTES.NOT_FOUND,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.PRODUCTS,
  ROUTES.ORDERS,
] as const;

export const ADMIN_ROUTES = [
  ROUTES.ADMIN,
] as const;