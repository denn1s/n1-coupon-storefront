import { createFileRoute } from '@tanstack/react-router'
import { MyCouponsPage } from '@pages/MyCoupons'

/**
 * My Coupons Route
 *
 * Displays all purchased coupons for the user.
 * Currently using mock data - will be connected to API when endpoints are available.
 */
export const Route = createFileRoute('/my-coupons')({
  component: MyCouponsPage
})
