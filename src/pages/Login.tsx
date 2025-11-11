import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/authStore'
import { login } from '@lib/auth/authService'

/**
 * Login Page
 *
 * PLACEHOLDER IMPLEMENTATION
 *
 * This is a simple email/password login form.
 * Replace this with your actual authentication flow:
 * - Passwordless OTP (for H4B Auth API)
 * - OAuth providers (Google, Facebook, etc.)
 * - SSO
 * - Magic links
 * etc.
 */
export default function Login() {
  const navigate = useNavigate()
  const { setAuthState } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Call the placeholder login function
      const response = await login({ email, password })

      // Store the auth state
      setAuthState(response.access_token, response.refresh_token, response.user)

      // Redirect to home page
      navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">Login</h2>
          <p className="text-center text-sm text-base-content/70 mb-4">
            This is a placeholder login page. Replace with your auth provider.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <p className="text-center text-sm">
            Don't have an account?{' '}
            <a href="/signup" className="link link-primary">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
