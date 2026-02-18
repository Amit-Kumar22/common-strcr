import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { STORAGE_KEYS } from '@/constants';
import type { DecodedToken, AuthTokens } from '@/types';

/**
 * Decode JWT token and extract user information
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired (with 5-minute buffer)
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = 5 * 60; // 5 minutes
  
  return decoded.exp < (currentTime + bufferTime);
}

/**
 * Get stored access token from cookies
 */
export function getAccessToken(): string | null {
  return Cookies.get(STORAGE_KEYS.ACCESS_TOKEN) || null;
}

/**
 * Get stored refresh token from cookies
 */
export function getRefreshToken(): string | null {
  return Cookies.get(STORAGE_KEYS.REFRESH_TOKEN) || null;
}

/**
 * Store authentication tokens securely
 */
export function storeTokens(tokens: AuthTokens): void {
  const accessTokenData = decodeToken(tokens.accessToken);
  const refreshTokenData = decodeToken(tokens.refreshToken);
  
  if (accessTokenData?.exp) {
    Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken, {
      expires: new Date(accessTokenData.exp * 1000),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
  
  if (refreshTokenData?.exp) {
    Cookies.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken, {
      expires: new Date(refreshTokenData.exp * 1000),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
}

/**
 * Remove all authentication tokens
 */
export function clearTokens(): void {
  Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN);
  Cookies.remove(STORAGE_KEYS.REFRESH_TOKEN);
  
  // Clear any other auth-related data
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
  }
}

/**
 * Check if user is authenticated based on valid access token
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  return !!(token && !isTokenExpired(token));
}

/**
 * Get user role from token
 */
export function getUserRole(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || null;
}

/**
 * Check if user has required role
 */
export function hasRole(requiredRole: string | string[]): boolean {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
}