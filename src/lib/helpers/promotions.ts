/**
 * Promotion Helpers
 *
 * Helper functions for calculating discounts, formatting prices,
 * and displaying countdown timers for product promotions.
 */

/**
 * Calculate discount percentage between original and sale price
 * Returns rounded down integer percentage
 *
 * @param originalPrice - Original price before discount
 * @param salePrice - Discounted sale price
 * @returns Integer percentage (0-100), or 0 if invalid
 *
 * @example
 * calculateDiscountPercentage(100, 75) // Returns 25
 * calculateDiscountPercentage(50, 40) // Returns 20
 */
export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice <= 0 || salePrice >= originalPrice) {
    return 0
  }

  const discount = ((originalPrice - salePrice) / originalPrice) * 100
  return Math.floor(discount) // Round down to nearest integer
}

/**
 * Format countdown display based on time remaining
 *
 * Rules:
 * - More than 10 days: Returns null (don't show countdown)
 * - 1-10 days: Returns "X days left"
 * - Less than 1 day: Returns "X hours left"
 *
 * @param endDate - UTC end date string
 * @returns Formatted countdown string or null
 *
 * @example
 * formatCountdown('2025-12-25T00:00:00Z') // "5 days left" (if 5 days away)
 * formatCountdown('2025-12-20T15:00:00Z') // "8 hours left" (if 8 hours away)
 * formatCountdown('2026-01-01T00:00:00Z') // null (more than 10 days)
 */
export function formatCountdown(endDate: string | null): string | null {
  if (!endDate) return null

  const now = new Date()
  const end = new Date(endDate)
  const diffMs = end.getTime() - now.getTime()

  // If promotion has ended or date is invalid
  if (diffMs <= 0) return null

  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffHours / 24

  // More than 10 days: don't show
  if (diffDays > 10) {
    return null
  }

  // Between 1 and 10 days: show days
  if (diffDays >= 1) {
    const days = Math.floor(diffDays)
    return `${days} ${days === 1 ? 'day' : 'days'} left`
  }

  // Less than 1 day: show hours
  const hours = Math.floor(diffHours)
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} left`
  }

  // Less than 1 hour: show "Less than 1 hour"
  return 'Less than 1 hour left'
}

/**
 * Format price with currency symbol
 *
 * @param price - Price to format
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted price string
 *
 * @example
 * formatPrice(99.99) // "$99.99"
 * formatPrice(1500) // "$1,500.00"
 */
export function formatPrice(price: number, currency: string = '$'): string {
  return `${currency}${price.toFixed(2)}`
}

/**
 * Check if promotion is currently active
 *
 * @param startDate - Promotion start date (can be null)
 * @param endDate - Promotion end date (can be null)
 * @returns True if promotion is active
 */
export function isPromotionActive(startDate: string | null, endDate: string | null): boolean {
  const now = new Date()
  let isActive = true

  if (startDate) {
    const start = new Date(startDate)
    if (now < start) {
      isActive = false // Current date is before start date
    }
  }

  if (endDate) {
    const end = new Date(endDate)
    if (now > end) {
      isActive = false // Current date is after end date
    }
  }

  return isActive
}

/**
 * Get time remaining in milliseconds
 *
 * @param endDate - Promotion end date
 * @returns Milliseconds remaining, or 0 if ended
 */
export function getTimeRemaining(endDate: string | null): number {
  if (!endDate) return 0

  const now = new Date()
  const end = new Date(endDate)
  const diffMs = end.getTime() - now.getTime()

  return Math.max(0, diffMs)
}
