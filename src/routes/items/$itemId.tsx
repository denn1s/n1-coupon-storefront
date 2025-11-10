import { createFileRoute } from '@tanstack/react-router'
import { ItemDetailPage } from '@pages/ItemDetail'

/**
 * Item detail route
 * Demonstrates:
 * - Dynamic route parameters ($itemId)
 * - Loading a detail page component
 * - Accessing route params in the component
 */
export const Route = createFileRoute('/items/$itemId')({
  component: ItemDetailPage
})
