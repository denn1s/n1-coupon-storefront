import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/authStore'
import { logout } from '@lib/auth/authService'

/**
 * Logout Page
 *
 * Handles the logout process by:
 * 1. Calling the logout service (if needed by your auth provider)
 * 2. Clearing local auth state
 * 3. Redirecting to home page
 */
const Logout = () => {
  const navigate = useNavigate()
  const { clearAuthState, getAccessToken } = useAuthStore()

  useEffect(() => {
    const performLogout = async () => {
      const accessToken = getAccessToken()

      // Call the logout service if we have a token
      if (accessToken) {
        try {
          await logout(accessToken)
        } catch (error) {
          console.error('Logout service error:', error)
          // Continue with local logout even if server call fails
        }
      }

      // Clear local auth state
      clearAuthState()

      // Redirect to home page after a brief delay
      setTimeout(() => {
        navigate({ to: '/' })
      }, 1000)
    }

    performLogout()
  }, [clearAuthState, getAccessToken, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4">Logging out...</p>
        </div>
      </div>
    </div>
  )
}

export default Logout
