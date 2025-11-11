import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/authStore'

/**
 * Authorize Page
 *
 * PLACEHOLDER IMPLEMENTATION
 *
 * This page handles OAuth callbacks or similar authorization flows.
 * It's typically used when returning from an external auth provider.
 *
 * Common use cases:
 * - OAuth 2.0 callback (parse code/token from URL)
 * - SSO callback
 * - Magic link validation
 * - Social login callback
 *
 * Customize this based on your auth provider's callback requirements.
 */
const Authorize = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // PLACEHOLDER: Parse auth callback parameters from URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const errorParam = urlParams.get('error')

        if (errorParam) {
          setError(errorParam)
          console.error('Auth callback error:', errorParam)
          return
        }

        if (code) {
          // PLACEHOLDER: Exchange code for tokens
          // This is where you'd call your auth provider's token endpoint
          console.log('Auth code received:', code)

          // For now, just check if we're already authenticated
          if (isAuthenticated) {
            navigate({ to: '/' })
          } else {
            setError('Authentication incomplete. Please try logging in again.')
          }
        } else if (isAuthenticated) {
          // Already authenticated, redirect to home
          navigate({ to: '/' })
        } else {
          setError('No authorization code received.')
        }
      } catch (err) {
        console.error('Authorization error:', err)
        setError(err instanceof Error ? err.message : 'Authorization failed')
      }
    }

    handleAuthCallback()
  }, [isAuthenticated, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-error">Authorization Failed</h2>
            <p className="text-base-content/70">{error}</p>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-primary" onClick={() => navigate({ to: '/login' })}>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4">Authorizing...</p>
        </div>
      </div>
    </div>
  )
}

export default Authorize
