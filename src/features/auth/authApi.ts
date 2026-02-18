import { baseApi } from '@/services/baseApi';
import { storeTokens } from '@/utils/auth';
import { setAuthLoading, setAuthSuccess, setAuthError } from './authSlice';
import type { LoginRequest, LoginResponse, User, ApiResponse } from '@/types';

// Configuration for demo mode
const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Dummy user data for demo (only used when DEMO_MODE is true)
const DUMMY_USER: User = {
  id: '1',
  email: 'admin@hiprotech.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  isVerified: true,
  avatar: undefined,
};

// Dummy tokens for demo (only used when DEMO_MODE is true)
const DUMMY_TOKENS = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBoaXByb3RlY2guY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM5MTk2MDAwLCJleHAiOjk5OTk5OTk5OTl9.dummy_signature',
  refreshToken: 'dummy_refresh_token_that_expires_later',
};

/**
 * Demo mode login simulation
 */
const simulateLogin = async (credentials: LoginRequest) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (credentials.email === 'admin@hiprotech.com' && credentials.password === 'password123') {
    return {
      data: {
        data: {
          user: DUMMY_USER,
          tokens: DUMMY_TOKENS,
        },
        message: 'Login successful',
        success: true,
      },
    };
  } else {
    throw {
      error: {
        status: 401,
        data: {
          message: 'Invalid credentials',
          success: false,
        },
      },
    };
  }
};

/**
 * Demo mode registration simulation
 */
const simulateRegister = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newUser: User = {
    id: Math.random().toString(36).substring(2),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: 'customer',
    isVerified: false,
  };
  
  return {
    data: {
      data: {
        user: newUser,
        tokens: DUMMY_TOKENS,
      },
      message: 'Registration successful',
      success: true,
    },
  };
};

/**
 * Authentication API endpoints using RTK Query
 * Automatically switches between demo mode and real API based on environment
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Login endpoint - switches between demo and real API
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>(
      IS_DEMO_MODE ? {
        queryFn: simulateLogin,
        async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
          dispatch(setAuthLoading(true));
          
          try {
            const { data } = await queryFulfilled;
            
            // Store tokens securely
            storeTokens(data.data.tokens);
            
            // Update auth state
            dispatch(setAuthSuccess({
              user: data.data.user,
              tokens: data.data.tokens,
            }));
            
          } catch (error: any) {
            const errorMessage = error?.error?.data?.message || 
                                error?.data?.message || 
                                'Login failed. Please check your credentials.';
            dispatch(setAuthError(errorMessage));
            throw error;
          }
        },
        invalidatesTags: ['Auth'],
      } : {
        query: (credentials) => ({
          url: '/auth/login',
          method: 'POST',
          body: credentials,
        }),
        async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
          dispatch(setAuthLoading(true));
          
          try {
            const { data } = await queryFulfilled;
            
            // Store tokens securely
            storeTokens(data.data.tokens);
            
            // Update auth state
            dispatch(setAuthSuccess({
              user: data.data.user,
              tokens: data.data.tokens,
            }));
            
          } catch (error: any) {
            const errorMessage = error?.error?.data?.message || 
                                error?.data?.message || 
                                'Login failed. Please check your credentials.';
            dispatch(setAuthError(errorMessage));
            throw error;
          }
        },
        invalidatesTags: ['Auth'],
      }
    ),

    // Register endpoint - switches between demo and real API
    register: builder.mutation<ApiResponse<LoginResponse>, {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }>(
      IS_DEMO_MODE ? {
        queryFn: simulateRegister,
        async onQueryStarted(userData, { dispatch, queryFulfilled }) {
          dispatch(setAuthLoading(true));
          
          try {
            const { data } = await queryFulfilled;
            
            // Store tokens after successful registration
            storeTokens(data.data.tokens);
            
            // Update auth state
            dispatch(setAuthSuccess({
              user: data.data.user,
              tokens: data.data.tokens,
            }));
            
          } catch (error: any) {
            const errorMessage = error?.data?.message || 'Registration failed. Please try again.';
            dispatch(setAuthError(errorMessage));
            throw error;
          }
        },
        invalidatesTags: ['Auth'],
      } : {
        query: (userData) => ({
          url: '/auth/register',
          method: 'POST',
          body: userData,
        }),
        async onQueryStarted(userData, { dispatch, queryFulfilled }) {
          dispatch(setAuthLoading(true));
          
          try {
            const { data } = await queryFulfilled;
            
            // Store tokens after successful registration
            storeTokens(data.data.tokens);
            
            // Update auth state
            dispatch(setAuthSuccess({
              user: data.data.user,
              tokens: data.data.tokens,
            }));
            
          } catch (error: any) {
            const errorMessage = error?.data?.message || 'Registration failed. Please try again.';
            dispatch(setAuthError(errorMessage));
            throw error;
          }
        },
        invalidatesTags: ['Auth'],
      }
    ),

    // Get user profile - switches between demo and real API
    getProfile: builder.query<ApiResponse<User>, void>(
      IS_DEMO_MODE ? {
        queryFn: async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          return {
            data: {
              data: DUMMY_USER,
              message: 'Profile fetched successfully',
              success: true,
            },
          };
        },
        providesTags: ['Auth', 'User'],
      } : {
        query: () => '/auth/profile',
        providesTags: ['Auth', 'User'],
      }
    ),

    // Update user profile - switches between demo and real API
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>(
      IS_DEMO_MODE ? {
        queryFn: async (profileData) => {
          await new Promise(resolve => setTimeout(resolve, 800));
          const updatedUser = { ...DUMMY_USER, ...profileData };
          return {
            data: {
              data: updatedUser,
              message: 'Profile updated successfully',
              success: true,
            },
          };
        },
        invalidatesTags: ['Auth', 'User'],
      } : {
        query: (profileData) => ({
          url: '/auth/profile',
          method: 'PUT',
          body: profileData,
        }),
        invalidatesTags: ['Auth', 'User'],
      }
    ),

    // Logout endpoint - switches between demo and real API
    logout: builder.mutation<ApiResponse<null>, void>(
      IS_DEMO_MODE ? {
        queryFn: async () => {
          await new Promise(resolve => setTimeout(resolve, 300));
          return {
            data: {
              data: null,
              message: 'Logged out successfully',
              success: true,
            },
          };
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.warn('Server logout failed, logging out locally');
          } finally {
            dispatch({ type: 'auth/logout' });
          }
        },
        invalidatesTags: ['Auth'],
      } : {
        query: () => ({
          url: '/auth/logout',
          method: 'POST',
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.warn('Server logout failed, logging out locally');
          } finally {
            dispatch({ type: 'auth/logout' });
          }
        },
        invalidatesTags: ['Auth'],
      }
    ),

  }),
});

// Export hooks for components
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;