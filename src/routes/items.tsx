import { createFileRoute } from '@tanstack/react-router'
import { ItemsPage } from '@pages/Items'

/**
 * Items list route
 * Demonstrates:
 * - Basic route setup with TanStack Router
 * - Loading a list page component
 */
export const Route = createFileRoute('/items')({
  component: ItemsPage
})
