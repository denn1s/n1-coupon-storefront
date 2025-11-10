import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import useAuth from '@lib/auth/useAuth'

export const useAuthGuard = (redirectTo: string = '/') => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: redirectTo })
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])

  return { isAuthenticated, isLoading }
}

export default useAuthGuard

