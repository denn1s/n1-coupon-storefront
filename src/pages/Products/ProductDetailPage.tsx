import { useGetProduct } from '@services/products.graphql'
import { Link, useParams } from '@tanstack/react-router'
import styles from './ProductDetailPage.module.css'

/**
 * Product Detail Page
 *
 * Demonstrates:
 * - Using route params with TanStack Router
 * - Simple data fetching with useGetProduct
 * - Image gallery display
 * - Clean component relying on TanStack Query states
 */
export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' })
  const { data: product, isLoading, error } = useGetProduct(productId)

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error loading product</h2>
          <p>{error.message}</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  // Not found state
  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/products" className={styles.breadcrumbLink}>
          Products
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </div>

      {/* Product Content */}
      <div className={styles.content}>
        {/* Image Gallery */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img
              src={product.productImageUrl ?? '/placeholder.png'}
              alt={product.name}
              className={styles.image}
            />
          </div>

          {/* Thumbnail Gallery (if additional images exist) */}
          {product.images && product.images.length > 0 && (
            <div className={styles.thumbnails}>
              {product.images.map((image) => (
                <div key={image.sequence} className={styles.thumbnail}>
                  <img
                    src={image.url}
                    alt={`${product.name} - ${image.sequence}`}
                    className={styles.thumbnailImage}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <h1 className={styles.title}>{product.name}</h1>

          {/* Price */}
          <div className={styles.priceSection}>
            <span className={styles.price}>${product.salePrice.toFixed(2)}</span>
          </div>

          {/* Stock Status */}
          <div className={styles.stockSection}>
            {product.quantityAvailable > 0 ? (
              <div className={styles.stockAvailable}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={styles.stockIcon}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>In Stock ({product.quantityAvailable} available)</span>
              </div>
            ) : (
              <div className={styles.stockUnavailable}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={styles.stockIcon}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionTitle}>Description</h2>
              <p className={styles.description}>{product.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.addToCartButton}
              disabled={product.quantityAvailable === 0}
            >
              {product.quantityAvailable > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <Link to="/products" className={styles.backButton}>
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
