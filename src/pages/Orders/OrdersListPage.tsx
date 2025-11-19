import { useOrdersPagination } from '@services/orders.graphql'
import OrderCard from '@components/molecules/OrderCard'
import styles from './OrdersListPage.module.css'

/**
 * Orders List Page
 *
 * Displays all orders for the authenticated user with pagination.
 * Shows order cards with summary information and links to detail pages.
 */
export default function OrdersListPage() {
  const {
    data: orders,
    totalCount,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage
  } = useOrdersPagination(20)

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.errorIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h2>Error loading orders</h2>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.emptyIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <h2>No orders yet</h2>
          <p>Your orders will appear here once you make a purchase.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Orders</h1>
          <p className={styles.subtitle}>
            {totalCount} {totalCount === 1 ? 'order' : 'orders'} total
          </p>
        </div>
      </div>

      {/* Orders Grid */}
      <div className={styles.ordersGrid}>
        {orders.map((order) => (
          <OrderCard key={order.orderId} order={order} />
        ))}
      </div>

      {/* Pagination */}
      {(hasNextPage || hasPreviousPage) && (
        <div className={styles.pagination}>
          <button
            onClick={goToPreviousPage}
            disabled={!hasPreviousPage || isFetching}
            className={styles.paginationButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={styles.icon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Previous
          </button>

          {isFetching && (
            <span className={styles.loadingIndicator}>
              <span className="loading loading-spinner loading-sm"></span>
              Loading...
            </span>
          )}

          <button onClick={goToNextPage} disabled={!hasNextPage || isFetching} className={styles.paginationButton}>
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={styles.icon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
