import { useProductsPagination } from '@services/products.graphql'
import { Link } from '@tanstack/react-router'
import styles from './ProductsPage.module.css'

/**
 * Products List Page
 *
 * Demonstrates:
 * - Simple component relying on TanStack Query
 * - Easy-to-use cursor pagination with useProductsPagination hook
 * - Automatic loading and error states
 * - Clean, minimal component logic
 */
export default function ProductsPage() {
  const {
    data: products,
    totalCount,
    isLoading,
    error,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = useProductsPagination(20) // 20 products per page

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error loading products</h2>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h2>No products found</h2>
          <p>Check back later for new products!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.subtitle}>
          {totalCount} {totalCount === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {/* Products Grid */}
      <div className={styles.grid}>
        {products.map((product) => (
          <Link
            key={product.id}
            to="/products/$productId"
            params={{ productId: product.id }}
            className={styles.card}
          >
            {/* Product Image */}
            <figure className={styles.cardImage}>
              <img
                src={product.productImageUrl ?? '/placeholder.png'}
                alt={product.name}
                className={styles.image}
              />
            </figure>

            {/* Product Info */}
            <div className={styles.cardBody}>
              <h2 className={styles.productName}>{product.name}</h2>

              {product.description && (
                <p className={styles.description}>
                  {product.description.length > 100
                    ? `${product.description.slice(0, 100)}...`
                    : product.description}
                </p>
              )}

              {/* Price and Stock */}
              <div className={styles.cardFooter}>
                <span className={styles.price}>${product.salePrice.toFixed(2)}</span>
                <span
                  className={
                    product.quantityAvailable > 0
                      ? styles.stockAvailable
                      : styles.stockUnavailable
                  }
                >
                  {product.quantityAvailable > 0
                    ? `${product.quantityAvailable} in stock`
                    : 'Out of stock'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          onClick={goToPreviousPage}
          disabled={!hasPreviousPage}
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

        <span className={styles.paginationInfo}>
          Showing {products.length} products
        </span>

        <button
          onClick={goToNextPage}
          disabled={!hasNextPage}
          className={styles.paginationButton}
        >
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
    </div>
  )
}
