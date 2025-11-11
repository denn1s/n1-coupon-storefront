import { Store, useStore } from '@tanstack/react-store'

/**
 * Simple User interface
 * Customize this based on your auth provider's user object
 */
export interface User {
  id: string
  email?: string
  name?: string
  [key: string]: unknown // Allow for additional custom fields
}

/**
 * Auth State Interface
 * Manages authentication tokens and user information
 */
interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
}

/**
 * Token Storage Keys
 * Used for localStorage persistence
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user'
}

/**
 * Load initial auth state from localStorage
 */
const loadInitialState = (): AuthState => {
  try {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    const user = userStr ? JSON.parse(userStr) : null

    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated: !!accessToken && !!user
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error)
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false
    }
  }
}

/**
 * Auth Store
 * Central store for authentication state
 */
const authStore = new Store<AuthState>(loadInitialState())

/**
 * Save auth state to localStorage
 */
const persistAuthState = (state: AuthState) => {
  try {
    if (state.accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, state.accessToken)
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    }

    if (state.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, state.refreshToken)
    } else {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    }

    if (state.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  } catch (error) {
    console.error('Failed to persist auth state to localStorage:', error)
  }
}

/**
 * Auth Store Hook
 * Primary interface for accessing and updating auth state
 */
function useAuthStore() {
  const accessToken = useStore(authStore, (state) => state.accessToken)
  const refreshToken = useStore(authStore, (state) => state.refreshToken)
  const user = useStore(authStore, (state) => state.user)
  const isAuthenticated = useStore(authStore, (state) => state.isAuthenticated)

  /**
   * Set authentication state after successful login
   * This will persist tokens and user info to localStorage
   */
  const setAuthState = (accessToken: string, refreshToken: string, user: User) => {
    const newState: AuthState = {
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true
    }

    authStore.setState(() => newState)
    persistAuthState(newState)
  }

  /**
   * Update only the access token (e.g., after refresh)
   * Optionally also update the refresh token
   */
  const setAccessToken = (accessToken: string, refreshToken?: string) => {
    authStore.setState((state) => {
      const newState = {
        ...state,
        accessToken,
        ...(refreshToken && { refreshToken })
      }
      persistAuthState(newState)
      return newState
    })
  }

  /**
   * Clear authentication state (logout)
   * This will remove all auth data from memory and localStorage
   */
  const clearAuthState = () => {
    const clearedState: AuthState = {
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false
    }

    authStore.setState(() => clearedState)
    persistAuthState(clearedState)
  }

  /**
   * Get current access token (useful for API calls)
   */
  const getAccessToken = () => authStore.state.accessToken

  /**
   * Get current refresh token (useful for token refresh)
   */
  const getRefreshToken = () => authStore.state.refreshToken

  return {
    // State
    accessToken,
    refreshToken,
    user,
    isAuthenticated,

    // Actions
    setAuthState,
    setAccessToken,
    clearAuthState,
    getAccessToken,
    getRefreshToken
  }
}

/**
 * Get access token directly without React hook
 * Useful for API calls outside of React components
 */
export const getAccessToken = () => authStore.state.accessToken

/**
 * Get refresh token directly without React hook
 * Useful for token refresh outside of React components
 */
export const getRefreshToken = () => authStore.state.refreshToken

export { authStore, useAuthStore }
