import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout, selectAuth, selectIsAuthenticated } from '@/features/auth';
import { useLogoutMutation } from '@/features/auth';
import { isAuthenticated, getUserRole } from '@/utils/auth';

/**
 * Custom hook for authentication state and operations
 * Provides convenient access to auth state and methods
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const isAuth = useAppSelector(selectIsAuthenticated);
  const [logoutMutation] = useLogoutMutation();

  // Check if user has specific role
  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!auth.user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(auth.user.role);
    }
    
    return auth.user.role === role;
  }, [auth.user]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);

  // Logout function
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local state
      dispatch(logout());
    }
  }, [dispatch, logoutMutation]);

  return {
    user: auth.user,
    isAuthenticated: isAuth,
    isLoading: auth.isLoading,
    error: auth.error,
    hasRole,
    isAdmin,
    logout: handleLogout,
  };
}

/**
 * Hook to automatically logout user when token expires
 * Monitors token expiration across tabs and sessions
 */
export function useAuthTokenMonitor() {
  const { logout: handleLogout } = useAuth();

  useEffect(() => {
    const checkTokenExpiry = (): void => {
      if (!isAuthenticated()) {
        handleLogout();
      }
    };

    // Check immediately
    checkTokenExpiry();

    // Check every 30 seconds
    const interval = setInterval(checkTokenExpiry, 30000);

    // Listen for storage changes (across tabs)
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key?.includes('hiprotech_') && e.newValue === null) {
        // Token was removed in another tab
        handleLogout();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleLogout]);
}

/**
 * Hook for route protection based on authentication and roles
 */
export function useRouteGuard(requiredRoles?: string[]) {
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    if (requiredRoles && !hasRole(requiredRoles)) {
      router.replace('/unauthorized');
      return;
    }
  }, [isAuthenticated, hasRole, isLoading, router, requiredRoles]);

  return {
    isAuthorized: isAuthenticated && (requiredRoles ? hasRole(requiredRoles) : true),
    isLoading,
  };
}