import { createFileRoute } from '@tanstack/react-router'
import { OrderDetailPage } from '@pages/Orders'
import { orderOptions } from '@services/orders.graphql'

/**
 * Order Detail Route
 *
 * Displays detailed information for a specific order including the coupon
 */
export const Route = createFileRoute('/orders/$orderId')({
  component: OrderDetailPage,
  // Prefetch order detail before rendering the page
  // Will use cached data from list if available
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(orderOptions(params.orderId))
  }
})
