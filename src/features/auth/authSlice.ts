import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  getAccessToken, 
  getRefreshToken,
  decodeToken, 
  isAuthenticated, 
  clearTokens 
} from '@/utils/auth';
import type { AuthState, User, AuthTokens } from '@/types';

/**
 * Initialize auth state from stored tokens
 * Hydrates state on app startup to maintain authentication across sessions
 */
const initializeAuthState = (): AuthState => {
  // Always return unauthenticated state during SSR
  if (typeof window === 'undefined') {
    return {
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }

  try {
    const token = getAccessToken();
    
    if (token && isAuthenticated()) {
      const decodedToken = decodeToken(token);
      
      if (decodedToken) {
        return {
          user: {
            id: decodedToken.sub,
            email: decodedToken.email,
            role: decodedToken.role,
            firstName: decodedToken.role === 'admin' ? 'Admin' : 'User',
            lastName: decodedToken.role === 'admin' ? 'User' : 'Name',
            isVerified: true,
          },
          tokens: { accessToken: token, refreshToken: getRefreshToken() || '' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      }
    }
  } catch (error) {
    console.warn('Error initializing auth state:', error);
    // Clear invalid tokens
    clearTokens();
  }

  return {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState = initializeAuthState();

/**
 * Authentication slice managing user state and auth status
 * Handles login, logout, and token management
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state for auth operations
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Handle successful login
    setAuthSuccess: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Handle auth errors
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Update user profile data
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Handle logout
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      // Clear stored tokens
      clearTokens();
    },

    // Clear any auth errors
    clearAuthError: (state) => {
      state.error = null;
    },

    // Hydrate auth state on client-side
    hydrateAuth: (state) => {
      if (typeof window === 'undefined') return;
      
      try {
        const token = getAccessToken();
        
        if (token && isAuthenticated()) {
          const decodedToken = decodeToken(token);
          
          if (decodedToken) {
            state.user = {
              id: decodedToken.sub,
              email: decodedToken.email,
              role: decodedToken.role,
              firstName: decodedToken.role === 'admin' ? 'Admin' : 'User',
              lastName: decodedToken.role === 'admin' ? 'User' : 'Name',
              isVerified: true,
            };
            state.tokens = { 
              accessToken: token, 
              refreshToken: getRefreshToken() || '' 
            };
            state.isAuthenticated = true;
          }
        }
      } catch (error) {
        console.warn('Error hydrating auth state:', error);
        clearTokens();
      }
    },
  },
});

// Export actions for use in components
export const {
  setAuthLoading,
  setAuthSuccess,
  setAuthError,
  updateUser,
  logout,
  clearAuthError,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors for easy state access
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;