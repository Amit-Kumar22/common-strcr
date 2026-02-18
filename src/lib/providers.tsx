'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root providers wrapper for the application
 * Includes Redux Provider and any other global providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}