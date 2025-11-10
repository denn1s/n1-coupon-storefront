import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { useAuthStore } from '@stores/authStore'
import type { AuthContextType, AuthProviderProps } from './types'

/**
 * Helper function to decode JWT token
 * Works with standard JWT format (header.payload.signature)
 */
export const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT token:', error)
    return null
  }
}

/**
 * Helper function to extract permissions from JWT claims
 *
 * CUSTOMIZE THIS based on your auth provider's token structure:
 * - Custom JWT: might be `decodedToken.permissions` or `decodedToken.scopes`
 * - Auth0: often uses custom claims like `https://yourdomain.com/permissions`
 * - Firebase: custom claims are at root level
 * - Supabase: uses `app_metadata.permissions`
 */
const extractPermissions = (decodedToken: Record<string, unknown> | null): string[] => {
  if (!decodedToken) return []

  // Example: check multiple possible locations
  const permissions =
    decodedToken.permissions ||
    decodedToken.scopes ||
    decodedToken.roles ||
    []

  return Array.isArray(permissions) ? permissions : []
}

/**
 * Helper function to extract user email from JWT claims
 *
 * CUSTOMIZE THIS based on your auth provider's token structure
 */
export const extractUserEmail = (decodedToken: Record<string, unknown> | null): string | null => {
  if (!decodedToken) return null

  // Check for email in common claim locations
  const email = decodedToken.email || decodedToken.sub

  return typeof email === 'string' ? email : null
}

/**
 * AuthProvider - Provides authentication context to the app
 *
 * This provider reads from the authStore (token-based storage)
 * and provides auth state through React Context.
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, isAuthenticated, accessToken } = useAuthStore()
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Extract permissions from access token when it changes
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      try {
        const decodedToken = decodeJWT(accessToken)
        const extractedPermissions = extractPermissions(decodedToken)
        setPermissions(extractedPermissions)
      } catch (error) {
        console.error('Error extracting permissions from token:', error)
        setPermissions([])
      }
    } else {
      setPermissions([])
    }
    setIsLoading(false)
  }, [isAuthenticated, accessToken])

  const contextValue: AuthContextType = {
    isAuthenticated,
    user: user || null,
    permissions,
    isLoading,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
