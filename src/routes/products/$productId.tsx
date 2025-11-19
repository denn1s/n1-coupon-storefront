import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@pages/Products'
import { productOptions } from '@services/holding.graphql'

/**
 * Product Detail Route (Deal/Coupon Detail)
 *
 * Features:
 * - Dynamic route parameter ($productId)
 * - Data prefetching with loader (product loads before page renders)
 * - Uses TanStack Router's defaultPreload: 'intent' (prefetch on hover)
 * - Seamless integration with TanStack Query caching
 */
export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
  // Prefetch product data before rendering the page
  loader: ({ context, params }) => {
    const productId = Number(params.productId)
    return context.queryClient.ensureQueryData(productOptions(productId))
  }
})
