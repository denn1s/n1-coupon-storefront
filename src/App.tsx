import { ReactNode } from 'react'
import AuthProvider from '@auth/AuthProvider'
import AuthHandler from '@auth/AuthHandler'
import QueryProvider from '@lib/api/QueryProvider'
import { ToastViewport } from '@lib/toasts'
import { ErrorBoundary } from '@lib/errors'

import type { QueryClient } from '@tanstack/react-query'

/**
 * App Component
 *
 * This is the main provider wrapper for the application.
 * Add any global providers here.
 *
 * Provider structure:
 * 1. ErrorBoundary - Catches and handles React errors
 * 2. AuthProvider - Provides authentication context
 * 3. AuthHandler - Handles auth flow and route protection
 * 4. QueryProvider - Provides TanStack Query client
 * 5. ToastViewport - Global toast notifications
 */

interface AppProps {
  queryClient: QueryClient
  children: ReactNode
}

const App = ({ queryClient, children }: AppProps) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthHandler>
          <QueryProvider queryClient={queryClient}>
            {children}
            <ToastViewport position="top-center" toastOptions={{ duration: 3000 }} />
          </QueryProvider>
        </AuthHandler>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
