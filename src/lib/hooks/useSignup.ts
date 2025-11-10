import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

/**
 * PLACEHOLDER: Signup Hook
 *
 * This is a placeholder signup hook. Replace with your actual signup flow.
 *
 * Customize based on your auth provider:
 * - Custom backend API
 * - Firebase createUserWithEmailAndPassword
 * - Supabase signUp
 * - Auth0 signup (if using Auth0)
 * etc.
 */

export interface SignupPayload {
  email: string
  password: string
  confirmPassword: string
  firstName?: string
  lastName?: string
  [key: string]: string | undefined  // Allow additional string fields
}

export interface SignupError {
  message: string
  field?: string
}

export interface UseSignupReturn {
  signup: (payload: SignupPayload) => Promise<void>
  isLoading: boolean
  error: SignupError | null
}

const useSignup = (): UseSignupReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<SignupError | null>(null)
  const navigate = useNavigate()

  const signup = async (payload: SignupPayload): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate password confirmation
      if (payload.password !== payload.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Validate required fields
      if (!payload.email?.trim()) {
        throw new Error('Email is required')
      }

      if (!payload.password?.trim()) {
        throw new Error('Password is required')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(payload.email)) {
        throw new Error('Please enter a valid email address')
      }

      // Validate password length
      if (payload.password.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }

      // PLACEHOLDER: Make API call to create user
      console.warn('⚠️  Using placeholder signup function. Replace with your auth provider.')

      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      // After successful signup, redirect to login
      navigate({ to: '/login' })

      // PRODUCTION: Replace with actual API call:
      // await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: payload.email,
      //     password: payload.password,
      //     firstName: payload.firstName,
      //     lastName: payload.lastName
      //   })
      // })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError({ message: errorMessage })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    signup,
    isLoading,
    error,
  }
}

export default useSignup
