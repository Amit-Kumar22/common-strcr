import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getAccessToken, getRefreshToken, storeTokens, clearTokens } from '@/utils/auth';
import type { AuthTokens, ApiResponse } from '@/types';

/**
 * Custom base query with automatic token refresh
 * Handles authentication and token renewal transparently
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      headers.set('content-type', 'application/json');
      return headers;
    },
  });

  // First API call attempt
  let result = await baseQuery(args, api, extraOptions);

  // If token is expired, try to refresh
  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      // Attempt to refresh token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const responseData = refreshResult.data as ApiResponse<AuthTokens>;
        
        // Store new tokens
        storeTokens(responseData.data);
        
        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout user
        clearTokens();
        window.location.href = '/auth/login';
      }
    } else {
      // No refresh token - logout user
      clearTokens();
      window.location.href = '/auth/login';
    }
  }

  return result;
};

/**
 * Base API slice using RTK Query
 * All API endpoints should extend this base API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  
  // Global tags for cache invalidation
  tagTypes: ['Auth', 'User', 'Product', 'Order'],
  
  endpoints: () => ({}),
});

// Export hooks for endpoints that will be injected
export const {
  // Auth endpoints will be injected here
} = baseApi;