import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@pages/Products'
import { productsOptions, categoriesOptions, storesOptions } from '@services/holding.graphql'

/**
 * Home Route (Products/Deals/Coupons Page)
 *
 * Features:
 * - Data prefetching with loader (data loads before page renders)
 * - Prefetches products, categories, and stores for filters
 * - Uses TanStack Router's defaultPreload: 'intent' (prefetch on hover)
 * - Seamless integration with TanStack Query caching
 * - Public route (no authentication required)
 */
export const Route = createFileRoute('/')({
  component: ProductsPage,
  // Prefetch products, categories, and stores data before rendering the page
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsOptions({ first: 20 })),
      context.queryClient.ensureQueryData(categoriesOptions({ first: 50 })),
      context.queryClient.ensureQueryData(storesOptions({ first: 50 }))
    ])
  }
})
