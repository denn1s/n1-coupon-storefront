// Auth Context and Provider
export { AuthContext, useAuthContext } from './AuthContext'
export { default as AuthProvider } from './AuthProvider'

// Hooks
export { default as useAuth } from './useAuth'
export { useAuthActions, useAuth0Actions } from './useAuth'  // useAuth0Actions for backward compatibility
export { default as usePermissions } from './usePermissions'

// Resource-specific permission hooks
export {
  useResourcePermissions,
  useMultipleResourcePermissions,
  useAnyPermission,
  useAllPermissions
} from './useResourcePermissions'

// Auth Handler
export { default as AuthHandler } from './AuthHandler'

// Auth Service
export * from './authService'

// Types
export type { AuthContextType, AuthProviderProps, AuthState } from './types'
