import type { ReactNode } from 'react'
import type { User } from '@stores/authStore'

/**
 * Auth Provider Props
 */
export interface AuthProviderProps {
  children: ReactNode
}

/**
 * Auth Context Type
 *
 * Provides authentication state to the application
 */
export interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  permissions: string[]
  isLoading: boolean
}

/**
 * Auth State (for stores)
 */
export interface AuthState {
  isAuthenticated: boolean
}
