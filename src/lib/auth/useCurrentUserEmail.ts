import { useMemo } from 'react'
import { useAuthStore } from '@stores/authStore'
import { decodeJWT, extractUserEmail } from './AuthProvider'

/**
 * Custom hook to get the current user's email from JWT token
 * @returns The current user's email or null if not available
 */
export const useCurrentUserEmail = (): string | null => {
  const { accessToken } = useAuthStore()

  return useMemo(() => {
    if (!accessToken) return null

    try {
      const decodedToken = decodeJWT(accessToken)
      return extractUserEmail(decodedToken)
    } catch (error) {
      console.error('Error extracting user email from token:', error)
      return null
    }
  }, [accessToken])
}

export default useCurrentUserEmail
