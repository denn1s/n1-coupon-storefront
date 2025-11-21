import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import AuthHandler from './AuthHandler'
import { useAuthStore } from '@stores/authStore'
import { useAuth } from './useAuth'
import { refreshAccessToken, isTokenExpired } from './authService'

// Mock dependencies
vi.mock('@stores/authStore', () => ({
  useAuthStore: vi.fn()
}))

vi.mock('./useAuth', () => ({
  useAuth: vi.fn()
}))

vi.mock('./authService', () => ({
  refreshAccessToken: vi.fn(),
  isTokenExpired: vi.fn()
}))

// Mock child components
vi.mock('@pages/Logout', () => ({ default: () => <div>Logout Page</div> }))
vi.mock('@pages/Authorize', () => ({ default: () => <div>Authorize Page</div> }))
vi.mock('@pages/Login', () => ({ default: () => <div>Login Page</div> }))
vi.mock('@pages/Loading', () => ({ default: () => <div>Loading Page</div> }))

describe('AuthHandler', () => {
  const mockClearAuthState = vi.fn()
  const mockSetTokens = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    ;(useAuth as unknown as Mock).mockReturnValue({ isAuthenticated: true, isLoading: false })
    ;(useAuthStore as unknown as Mock).mockReturnValue({
      accessToken: 'expired-token',
      idToken: 'id-token',
      refreshToken: 'refresh-token',
      setTokens: mockSetTokens,
      clearAuthState: mockClearAuthState
    })
    ;(isTokenExpired as unknown as Mock).mockReturnValue(true)
  })

  it('calls clearAuthState when token refresh fails', async () => {
    // Setup refresh failure
    ;(refreshAccessToken as unknown as Mock).mockRejectedValue(new Error('Network error'))

    render(
      <AuthHandler>
        <div>Protected Content</div>
      </AuthHandler>
    )

    // Wait for the effect to run
    await waitFor(() => {
      expect(refreshAccessToken).toHaveBeenCalledWith('refresh-token', 'id-token', 'expired-token')
    })

    // Verify clearAuthState was called
    await waitFor(() => {
      expect(mockClearAuthState).toHaveBeenCalled()
    })
  })

  it('renders children when authenticated and token is valid', () => {
    ;(isTokenExpired as unknown as Mock).mockReturnValue(false)
    ;(useAuthStore as unknown as Mock).mockReturnValue({
      accessToken: 'valid-token',
      idToken: 'id-token',
      refreshToken: 'refresh-token',
      setTokens: mockSetTokens,
      clearAuthState: mockClearAuthState
    })

    render(
      <AuthHandler>
        <div>Protected Content</div>
      </AuthHandler>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
