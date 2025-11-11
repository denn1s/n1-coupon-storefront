import { createFileRoute, redirect } from '@tanstack/react-router'
import { MyCouponsPage } from '@pages/MyCoupons'
import { authStore } from '@stores/authStore'

/**
 * My Coupons Route
 *
 * Protected route - requires authentication
 * Displays all purchased coupons for the user.
 * Currently using mock data - will be connected to API when endpoints are available.
 */
export const Route = createFileRoute('/my-coupons')({
  component: MyCouponsPage,
  beforeLoad: async () => {
    const { isAuthenticated } = authStore.state

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/my-coupons',
        },
      })
    }
  },
})
