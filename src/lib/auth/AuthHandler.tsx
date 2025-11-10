import { ReactNode, useEffect, useState } from 'react'
import Logout from '@pages/Logout'
import Authorize from '@pages/Authorize'
import Login from '@pages/Login'
import Loading from '@pages/Loading'
import { useAuth } from '@auth/useAuth'
import { useAuthStore } from '@stores/authStore'
import { refreshAccessToken, isTokenExpired } from '@lib/auth/authService'

interface AuthHandlerProps {
  children: ReactNode
}

/**
 * AuthHandler Component
 *
 * This component handles the authentication flow and route protection.
 * It determines which page to show based on the authentication state.
 *
 * Flow:
 * 1. Check if route is public (/, /signup, /login) - allow without auth
 * 2. If loading, show loading screen
 * 3. If on /logout, show logout page
 * 4. If not authenticated and not on /authorize, show login page
 * 5. If on /authorize, show authorize page (for OAuth callbacks, etc.)
 * 6. If no access token, block rendering
 * 7. Otherwise, render the app
 */
export default function AuthHandler({ children }: AuthHandlerProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { accessToken, refreshToken: storedRefreshToken, setAccessToken } = useAuthStore()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const path = window.location.pathname

  // Define public paths that don't require authentication
  const PUBLIC_PATHS = ['/', '/signup', '/login']
  const isPublicPath = PUBLIC_PATHS.some(
    (p) => path === p || path.startsWith(p + '/')
  )

  // Auto-refresh token if expired
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      // Only attempt refresh if we have tokens but they're expired
      if (isAuthenticated && accessToken && storedRefreshToken) {
        if (isTokenExpired(accessToken) && !isRefreshing) {
          setIsRefreshing(true)
          try {
            const response = await refreshAccessToken(storedRefreshToken)
            setAccessToken(response.accessToken, response.refreshToken)
          } catch (error) {
            console.error('Token refresh failed:', error)
            // If refresh fails, user will be logged out by the auth store
          } finally {
            setIsRefreshing(false)
          }
        }
      }
    }

    checkAndRefreshToken()
  }, [isAuthenticated, accessToken, storedRefreshToken, isRefreshing, setAccessToken])

  // Allow public routes without auth checks/loading gate
  if (isPublicPath) {
    return <>{children}</>
  }

  // Show loading screen while auth is being determined
  if (authLoading || isRefreshing) {
    return <Loading />
  }

  // Handle logout route
  if (path === '/logout') {
    return <Logout />
  }

  // If not authenticated, redirect to login (except for /authorize route)
  if (!isAuthenticated && path !== '/authorize') {
    return <Login />
  }

  // Handle OAuth callback or similar authorization flows
  if (path === '/authorize') {
    return <Authorize />
  }

  // Block rendering if we don't have an access token
  // This ensures we only render protected content when fully authenticated
  if (!accessToken) {
    return null
  }

  // All checks passed - render the app
  return <>{children}</>
}
