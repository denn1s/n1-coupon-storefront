import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@pages/Products'
import { productsOptions } from '@services/products.graphql'

/**
 * Products List Route
 *
 * Features:
 * - Data prefetching with loader (data loads before page renders)
 * - Uses TanStack Router's defaultPreload: 'intent' (prefetch on hover)
 * - Seamless integration with TanStack Query caching
 */
export const Route = createFileRoute('/products')({
  component: ProductsPage,
  // Prefetch products data before rendering the page
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(productsOptions({ first: 20 }))
  },
})
