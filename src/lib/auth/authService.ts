import type { User } from '@stores/authStore'

/**
 * H4B Buyer Auth API Service
 *
 * This file implements authentication for the H4B Buyer Auth API.
 * API Specification: https://api-auth.h4b.dev/api/specification.json
 *
 * The H4B Auth API provides:
 * - Passwordless OTP authentication via phone
 * - Token-based authentication (access, ID, and refresh tokens)
 * - User information retrieval
 */

/**
 * Auth API Configuration
 * Set these via environment variables
 */
export const AUTH_CONFIG = {
  API_URL: import.meta.env.VITE_H4B_AUTH_API_URL || 'api-auth.h4b.dev',
  API_MOUNT: import.meta.env.VITE_H4B_AUTH_API_MOUNT || '/api'
}

/**
 * Build full API URL
 */
const getAuthApiUrl = (endpoint: string): string => {
  const apiMount = AUTH_CONFIG.API_MOUNT.startsWith('/') ? AUTH_CONFIG.API_MOUNT : `/${AUTH_CONFIG.API_MOUNT}`

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return `https://${AUTH_CONFIG.API_URL}${apiMount}${cleanEndpoint}`
}

/**
 * Passwordless Start Request
 * POST /api/Passwordless/start
 */
export interface PasswordlessStartRequest {
  phone_number: string
  channel?: string // SMS, WhatsApp, etc.
  origin?: string
}

/**
 * Passwordless Start Response
 */
export interface PasswordlessStartResponse {
  phone_number: string
  phone_verified: boolean
  _id: string // Session identifier
}

/**
 * Passwordless Verify Request
 * POST /api/Passwordless/verify
 */
export interface PasswordlessVerifyRequest {
  phone_number: string
  otp: string
  audience?: string
}

/**
 * Passwordless Verify Response
 * Returned after successful OTP verification
 */
export interface PasswordlessVerifyResponse {
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  scope: string
  user: Record<string, unknown>
}

/**
 * Authenticate Request
 * POST /api/authenticate
 */
export interface AuthenticateRequest {
  id_token?: string | null
  access_token?: string | null
  refresh_token?: string | null
  force_refresh?: boolean | null
}

/**
 * Token Information DTO
 */
export interface TokenInformationDto {
  idToken: string
  accessToken: string
  refreshToken: string
}

/**
 * Authenticate Response
 * Returned from token validation/refresh
 */
export interface AuthenticateResponse {
  user: Record<string, unknown>
  tokens: TokenInformationDto
}

/**
 * Login Response Interface (standardized for app use)
 * Combines passwordless verify response into app format
 */
export interface LoginResponse {
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
  user: User
}

/**
 * Token Refresh Response Interface (standardized for app use)
 */
export interface RefreshResponse {
  accessToken: string
  idToken: string
  refreshToken: string
}

/**
 * Start OTP authentication
 * POST /api/Passwordless/start
 *
 * Initiates the passwordless authentication flow by sending
 * an OTP code to the user's phone via the specified channel (SMS by default)
 */
export async function startOTP(
  phoneNumber: string,
  channel: string = 'sms',
  origin?: string
): Promise<PasswordlessStartResponse> {
  const url = getAuthApiUrl('/passwordless/start')

  if (import.meta.env.DEV) {
    console.log('[AUTH] Starting OTP flow for phone:', phoneNumber)
  }

  const request: PasswordlessStartRequest = {
    phone_number: phoneNumber,
    channel,
    origin
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[AUTH] Failed to start OTP:', errorText)
    throw new Error('Failed to send OTP. Please check your phone number and try again.')
  }

  const data: PasswordlessStartResponse = await response.json()

  if (import.meta.env.DEV) {
    console.log('[AUTH] OTP sent successfully, session ID:', data._id)
  }

  return data
}

/**
 * Verify OTP and complete login
 * POST /api/Passwordless/verify
 *
 * Verifies the OTP code and returns authentication tokens
 */
export async function verifyOTP(phoneNumber: string, otp: string, audience?: string): Promise<LoginResponse> {
  const url = getAuthApiUrl('/passwordless/verify')

  if (import.meta.env.DEV) {
    console.log('[AUTH] Verifying OTP for phone:', phoneNumber)
  }

  const request: PasswordlessVerifyRequest = {
    phone_number: phoneNumber,
    otp,
    audience
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[AUTH] Failed to verify OTP:', errorText)

    if (response.status === 401 || response.status === 400) {
      throw new Error('Invalid or expired OTP code. Please try again.')
    }

    throw new Error('Failed to verify OTP. Please try again.')
  }

  const data: PasswordlessVerifyResponse = await response.json()

  if (import.meta.env.DEV) {
    console.log('[AUTH] OTP verified successfully')
  }

  // Extract user info from response
  const userObj = data.user || {}
  const userId =
    typeof userObj === 'object' && userObj !== null
      ? (userObj as Record<string, unknown>).id || (userObj as Record<string, unknown>).sub || 'unknown'
      : 'unknown'

  // Transform the response to match our LoginResponse interface
  return {
    access_token: data.access_token,
    id_token: data.id_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    user: {
      id: String(userId),
      phone: phoneNumber,
      ...(typeof userObj === 'object' && userObj !== null ? userObj : {})
    }
  }
}

/**
 * Logout function
 *
 * Note: The H4B Auth API doesn't have a logout endpoint.
 * Logout is performed client-side by clearing tokens.
 */
export async function logout(_accessToken: string): Promise<void> {
  if (import.meta.env.DEV) {
    console.log('[AUTH] Logging out (client-side only)')
  }

  // For H4B API: no server-side logout endpoint
  // Tokens are cleared on the client side by the auth store
}

/**
 * Refresh access token
 * POST /api/authenticate
 *
 * Uses the refresh token to obtain new access and ID tokens
 */
export async function refreshAccessToken(
  refreshToken: string,
  idToken?: string,
  accessToken?: string
): Promise<RefreshResponse> {
  const url = getAuthApiUrl('/authenticate')

  if (import.meta.env.DEV) {
    console.log('[AUTH] Refreshing access token')
  }

  const request: AuthenticateRequest = {
    refresh_token: refreshToken,
    id_token: idToken || null,
    access_token: accessToken || null,
    force_refresh: true
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[AUTH] Token refresh failed:', errorText)
    throw new Error('Token refresh failed')
  }

  const data: AuthenticateResponse = await response.json()

  if (import.meta.env.DEV) {
    console.log('[AUTH] Token refreshed successfully')
  }

  return {
    accessToken: data.tokens.accessToken,
    idToken: data.tokens.idToken,
    refreshToken: data.tokens.refreshToken
  }
}

/**
 * Get current user information
 * GET /api/User
 *
 * Retrieves user information using the ID token
 */
export async function getCurrentUser(idToken: string): Promise<User> {
  const url = getAuthApiUrl('/User')

  if (import.meta.env.DEV) {
    console.log('[AUTH] Fetching current user')
  }

  const response = await fetch(`${url}?idToken=${encodeURIComponent(idToken)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[AUTH] Failed to fetch user info:', errorText)
    throw new Error('Failed to fetch user info')
  }

  // The API returns a string representation of user data
  // Try to parse it as JSON
  const data = await response.json()

  if (import.meta.env.DEV) {
    console.log('[AUTH] User fetched successfully')
  }

  // Transform API response to our User type
  return {
    id: data.id || data.sub || 'unknown',
    phone: data.phone || data.phone_number,
    email: data.email,
    name: data.name,
    ...data
  }
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
