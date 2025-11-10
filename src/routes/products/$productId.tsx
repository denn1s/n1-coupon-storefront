import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@pages/Products'
import { productsOptions } from '@services/holding.graphql'

/**
 * Product Detail Route (Deal/Coupon Detail)
 *
 * Features:
 * - Dynamic route parameter ($productId)
 * - Data prefetching with loader (products load before page renders)
 * - Uses TanStack Router's defaultPreload: 'intent' (prefetch on hover)
 * - Seamless integration with TanStack Query caching
 *
 * Note: Since there's no single product endpoint, we fetch the products list
 * and filter client-side. In production, you'd have a dedicated endpoint.
 */
export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
  // Prefetch products data before rendering the page
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(productsOptions({ first: 50 }))
  }
})
