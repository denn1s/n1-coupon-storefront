import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import PublicLayout from '@components/_layouts/Public'
import useAuth from '@lib/auth/useAuth'

/**
 * PLACEHOLDER: Signup Page
 *
 * This is a placeholder signup page. Replace with your actual signup implementation.
 *
 * Customize based on your auth provider:
 * - Custom signup form with backend API
 * - Firebase createUserWithEmailAndPassword
 * - Supabase signUp
 * - Auth0 signup flow
 * - Third-party OAuth providers (Google, GitHub, etc.)
 */

const Signup = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/', replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PublicLayout>
    )
  }

  // Don't render form if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              This is a placeholder signup page.
              <br />
              Replace with your auth provider's signup implementation.
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <div className="space-y-4 text-sm text-gray-700">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-blue-900 mb-2">Implementation Options:</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Custom signup form with backend API</li>
                  <li>Firebase Authentication</li>
                  <li>Supabase Authentication</li>
                  <li>Auth0 Universal Login</li>
                  <li>OAuth providers (Google, GitHub, etc.)</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="font-semibold text-yellow-900 mb-2">Files to customize:</h3>
                <ul className="list-disc list-inside space-y-1 text-yellow-800 text-xs font-mono">
                  <li>src/pages/Signup/Signup.tsx</li>
                  <li>src/lib/hooks/useSignup.ts</li>
                  <li>src/lib/auth/*</li>
                </ul>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate({ to: '/login' })}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Signup
