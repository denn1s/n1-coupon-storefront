import { createFileRoute } from '@tanstack/react-router'
import { OrdersListPage } from '@pages/Orders'
import { ordersOptions } from '@services/orders.graphql'

/**
 * Orders List Route
 *
 * Displays all orders for the authenticated user
 */
export const Route = createFileRoute('/orders/')({
  component: OrdersListPage,
  // Prefetch orders data before rendering the page
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(ordersOptions({ first: 20 }))
  }
})
