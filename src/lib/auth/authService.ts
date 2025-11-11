import type { User } from '@stores/authStore'

/**
 * PLACEHOLDER AUTH SERVICE
 *
 * This file contains placeholder functions for authentication.
 * These are configured for the H4B Buyer Auth API (https://api-auth.h4b.dev)
 * but can be adapted to any authentication provider.
 *
 * The H4B Auth API uses passwordless OTP-based authentication.
 */

/**
 * Auth API Configuration
 * Set these via environment variables
 */
export const AUTH_CONFIG = {
  API_URL: import.meta.env.VITE_H4B_AUTH_API_URL || 'idp.h4b.dev',
  API_PORT: import.meta.env.VITE_H4B_AUTH_API_PORT || '443',
  API_MOUNT: import.meta.env.VITE_H4B_AUTH_API_MOUNT || 'api',
  API_SECURE: import.meta.env.VITE_H4B_AUTH_API_SECURE !== 'false',
  API_KEY: import.meta.env.VITE_H4B_AUTH_API_KEY || '',
}

/**
 * Build full API URL
 */
const getAuthApiUrl = (endpoint: string): string => {
  const protocol = AUTH_CONFIG.API_SECURE ? 'https' : 'http'
  const port = AUTH_CONFIG.API_PORT === '443' || AUTH_CONFIG.API_PORT === '80' ? '' : `:${AUTH_CONFIG.API_PORT}`
  return `${protocol}://${AUTH_CONFIG.API_URL}${port}/${AUTH_CONFIG.API_MOUNT}${endpoint}`
}

/**
 * Start OTP Request (based on blueprint)
 */
export interface StartOTPRequest {
  phone: string
}

/**
 * Verify OTP Request (based on blueprint)
 */
export interface VerifyOTPRequest {
  phone: string
  otp: string
}

/**
 * Login Response Interface
 * Returned after successful authentication
 */
export interface LoginResponse {
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
  user: User
}

/**
 * Token Refresh Response Interface
 */
export interface RefreshResponse {
  accessToken: string
  idToken: string
  refreshToken: string
}

/**
 * Start OTP authentication
 *
 * Sends an OTP code to the user's phone via SMS
 * Based on the passwordless authentication blueprint
 */
export async function startOTP(request: StartOTPRequest): Promise<void> {
  const url = getAuthApiUrl('/auth/otp/start')

  if (import.meta.env.DEV) {
    console.log('[AUTH] Starting OTP flow for phone:', request.phone)
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': AUTH_CONFIG.API_KEY,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[AUTH] Failed to start OTP:', errorText)
    throw new Error('Failed to send OTP. Please check your phone number and try again.')
  }

  if (import.meta.env.DEV) {
    console.log('[AUTH] OTP sent successfully')
  }
}

/**
 * Verify OTP and complete login
 *
 * Verifies the OTP code and returns authentication tokens
 * Based on the passwordless authentication blueprint
 */
export async function verifyOTP(request: VerifyOTPRequest): Promise<LoginResponse> {
  const url = getAuthApiUrl('/auth/otp/verify')

  if (import.meta.env.DEV) {
    console.log('[AUTH] Verifying OTP for phone:', request.phone)
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': AUTH_CONFIG.API_KEY,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[AUTH] Failed to verify OTP:', errorText)

    if (response.status === 401 || response.status === 400) {
      throw new Error('Invalid or expired OTP code. Please try again.')
    }

    throw new Error('Failed to verify OTP. Please try again.')
  }

  const data = await response.json()

  if (import.meta.env.DEV) {
    console.log('[AUTH] OTP verified successfully')
  }

  // Transform the response to match our LoginResponse interface
  return {
    access_token: data.accessToken,
    id_token: data.idToken,
    refresh_token: data.refreshToken,
    expires_in: 3600, // Default to 1 hour
    user: {
      id: data.userId || 'unknown',
      phone: request.phone,
      name: data.name || undefined,
    },
  }
}

/**
 * PLACEHOLDER: Simple login (for development)
 *
 * This is a simple placeholder that accepts email/password
 * Replace with your actual auth flow (could be passwordless, OAuth, etc.)
 */
export interface LoginRequest {
  email: string
  password: string
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  console.warn('⚠️  Using placeholder login function. Replace with your auth provider.')

  // PLACEHOLDER IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    access_token: 'placeholder_access_token_' + Date.now(),
    id_token: 'placeholder_id_token_' + Date.now(),
    refresh_token: 'placeholder_refresh_token_' + Date.now(),
    expires_in: 3600,
    user: {
      id: '1',
      email: credentials.email,
      name: 'Demo User'
    }
  }
}

/**
 * PLACEHOLDER: Logout function
 *
 * Note: The H4B Auth API doesn't have a logout endpoint
 * Logout is typically just clearing local tokens
 */
export async function logout(_accessToken: string): Promise<void> {
  console.warn('⚠️  Using placeholder logout function.')

  // PLACEHOLDER IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 500))

  // For H4B API: no server-side logout needed
  // Just clear tokens on the client side
}

/**
 * PLACEHOLDER: Refresh access token
 *
 * Uses the /api/Authenticate endpoint with refresh_token
 */
export async function refreshAccessToken(_refreshToken: string): Promise<RefreshResponse> {
  console.warn('⚠️  Using placeholder refresh function. Replace with actual API call.')

  // PLACEHOLDER IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    accessToken: 'refreshed_access_token_' + Date.now(),
    idToken: 'refreshed_id_token_' + Date.now(),
    refreshToken: 'refreshed_refresh_token_' + Date.now()
  }

  // PRODUCTION: Replace with actual API call:
  // const response = await fetch(`${AUTH_CONFIG.API_URL}${AUTH_CONFIG.AUTHENTICATE_ENDPOINT}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     refresh_token: refreshToken,
  //     force_refresh: true
  //   })
  // })
  //
  // if (!response.ok) {
  //   throw new Error('Token refresh failed')
  // }
  //
  // const data = await response.json()
  // return {
  //   accessToken: data.tokens.accessToken,
  //   idToken: data.tokens.idToken,
  //   refreshToken: data.tokens.refreshToken
  // }
}

/**
 * PLACEHOLDER: Get current user
 *
 * Uses the /api/User endpoint with idToken
 */
export async function getCurrentUser(_idToken: string): Promise<User> {
  console.warn('⚠️  Using placeholder getCurrentUser function. Replace with actual API call.')

  // PLACEHOLDER IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User'
  }

  // PRODUCTION: Replace with actual API call:
  // const response = await fetch(
  //   `${AUTH_CONFIG.API_URL}${AUTH_CONFIG.USER_ENDPOINT}?idToken=${encodeURIComponent(idToken)}`
  // )
  //
  // if (!response.ok) {
  //   throw new Error('Failed to fetch user info')
  // }
  //
  // return await response.json()
}

/**
 * Helper: Check if access token is expired
 *
 * This is a simple JWT expiration check.
 * Customize based on your token format.
 */
export function isTokenExpired(token: string): boolean {
  try {
    // For JWT tokens, decode and check expiration
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= exp
  } catch (_error) {
    // If token is not JWT or invalid format, consider it expired
    return true
  }
}
