import { createFileRoute, Navigate } from '@tanstack/react-router'

/**
 * Products List Route (Redirect to Home)
 *
 * This route redirects to the home page for backward compatibility.
 * The products list is now displayed on the home page (/).
 */
export const Route = createFileRoute('/products')({
  component: () => <Navigate to="/" replace />
})
