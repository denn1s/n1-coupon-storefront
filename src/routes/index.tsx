import { createFileRoute, Navigate } from '@tanstack/react-router'
import PublicLayout from '@layouts/Public'
import { LandingPage } from '@pages/Landing'
import { useAuth } from '@auth/useAuth'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/items" replace />
  }

  return (
    <PublicLayout>
      <LandingPage />
    </PublicLayout>
  )
}
