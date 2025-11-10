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
  API_URL: import.meta.env.VITE_AUTH_API_URL || 'https://api-auth.h4b.dev',
  START_PASSWORDLESS_ENDPOINT: '/api/Passwordless/start',
  VERIFY_PASSWORDLESS_ENDPOINT: '/api/Passwordless/verify',
  AUTHENTICATE_ENDPOINT: '/api/Authenticate',
  USER_ENDPOINT: '/api/User'
}

/**
 * Start Passwordless Auth Request
 */
export interface PasswordlessStartRequest {
  phone_number: string
  channel?: 'sms' | 'whatsapp'
  origin?: string
}

/**
 * Start Passwordless Auth Response
 */
export interface PasswordlessStartResponse {
  phone_number: string | null
  phone_verified: boolean
  _id: string | null
}

/**
 * Verify OTP Request
 */
export interface PasswordlessVerifyRequest {
  phone_number: string
  otp: string
  audience?: string
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
 * PLACEHOLDER: Start passwordless authentication
 *
 * This initiates the OTP flow by sending a code to the user's phone
 */
export async function startPasswordlessAuth(
  request: PasswordlessStartRequest
): Promise<PasswordlessStartResponse> {
  console.warn('⚠️  Using placeholder startPasswordlessAuth. Replace with actual API call.')

  // PLACEHOLDER IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    phone_number: request.phone_number,
    phone_verified: false,
    _id: 'placeholder_id_' + Date.now()
  }

  // PRODUCTION: Replace with actual API call:
  // const response = await fetch(`${AUTH_CONFIG.API_URL}${AUTH_CONFIG.START_PASSWORDLESS_ENDPOINT}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request)
  // })
  //
  // if (!response.ok) {
  //   throw new Error('Failed to start passwordless auth')
  // }
  //
  // return await response.json()
}

/**
 * PLACEHOLDER: Verify OTP and complete login
 *
 * This verifies the OTP code and returns authentication tokens
 */
export async function verifyPasswordlessAuth(
  request: PasswordlessVerifyRequest
): Promise<LoginResponse> {
  console.warn('⚠️  Using placeholder verifyPasswordlessAuth. Replace with actual API call.')

  // PLACEHOLDER IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    access_token: 'placeholder_access_token_' + Date.now(),
    id_token: 'placeholder_id_token_' + Date.now(),
    refresh_token: 'placeholder_refresh_token_' + Date.now(),
    expires_in: 3600,
    user: {
      id: '1',
      email: request.phone_number,
      name: 'Demo User'
    }
  }

  // PRODUCTION: Replace with actual API call:
  // const response = await fetch(`${AUTH_CONFIG.API_URL}${AUTH_CONFIG.VERIFY_PASSWORDLESS_ENDPOINT}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request)
  // })
  //
  // if (!response.ok) {
  //   throw new Error('Failed to verify OTP')
  // }
  //
  // const data = await response.json()
  // return {
  //   access_token: data.access_token,
  //   id_token: data.id_token,
  //   refresh_token: data.refresh_token,
  //   expires_in: data.expires_in,
  //   user: data.user
  // }
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
