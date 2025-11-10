import { useNavigate } from '@tanstack/react-router'
import { useAuthContext } from './AuthContext'
import { useAuthStore } from '@stores/authStore'
import { logout as logoutService } from './authService'

/**
 * Hook for authentication actions
 *
 * Provides functions to:
 * - Login (start auth flow)
 * - Logout (clear tokens)
 * - Get access tokens
 */
const useAuthActions = () => {
  const navigate = useNavigate()
  const { clearAuthState, getAccessToken } = useAuthStore()

  /**
   * Login function
   * Redirects to the login page to start auth flow
   */
  const loginWithRedirect = async () => {
    navigate({ to: '/login' })
  }

  /**
   * Logout function
   * Clears tokens and redirects to home/login
   */
  const logoutFn = async () => {
    const accessToken = getAccessToken()
    if (accessToken) {
      try {
        await logoutService(accessToken)
      } catch (error) {
        console.error('Logout service error:', error)
      }
    }
    clearAuthState()
    navigate({ to: '/' })
  }

  /**
   * Get access token silently
   * In this simple system, just returns the current token
   * You could implement token refresh logic here
   */
  const getAccessTokenSilently = async () => {
    return getAccessToken()
  }

  return {
    loginWithRedirect,
    logout: logoutFn,
    getAccessTokenSilently,
  }
}

/**
 * Main auth hook
 * Returns auth state and context
 */
const useAuth = () => {
  return useAuthContext()
}

export default useAuth
export { useAuth, useAuthActions }
// Keeping the old export name for backward compatibility
export { useAuthActions as useAuth0Actions }
