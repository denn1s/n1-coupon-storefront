import { useState } from 'react'
import { useGetProducts } from '@services/holding.graphql'
import { Link, useParams } from '@tanstack/react-router'
import { HoldingProduct } from '@lib/api/types'
import CheckoutModal from '@components/organisms/CheckoutModal'
import styles from './ProductDetailPage.module.css'

/**
 * Product Detail Page (Deal/Coupon Detail)
 *
 * Features:
 * - Display full product/deal information
 * - Image gallery display
 * - Buy Now functionality
 * - Stock availability indicator
 */
export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' })
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  // Since there's no single product endpoint, we fetch from the list
  // In a real app, you'd have a dedicated product detail endpoint
  const { data: productsData, isLoading, error } = useGetProducts({ first: 100 })

  const product = productsData?.holdingProducts.nodes.find(
    (p) => p.id === Number(productId)
  )

  // Handle buy button click
  const handleBuyNow = () => {
    if (product) {
      setIsCheckoutModalOpen(true)
    }
  }

  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false)
  }

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

  const displayImage = selectedImage || product.productImageUrl

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/products" className={styles.breadcrumbLink}>
          Deals
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
              src={displayImage}
              alt={product.name}
              className={styles.image}
            />
          </div>

          {/* Thumbnail Gallery (if additional images exist) */}
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((image) => (
                <button
                  key={image.sequence}
                  className={styles.thumbnail}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} - ${image.sequence}`}
                    className={styles.thumbnailImage}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <h1 className={styles.title}>{product.name}</h1>

          {/* Price */}
          <div className={styles.priceSection}>
            <span className={styles.priceLabel}>Deal Price</span>
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
                <span>{product.quantityAvailable} coupons available</span>
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
                <span>Deal Expired</span>
              </div>
            )}
          </div>

          {/* Low stock warning */}
          {product.quantityAvailable > 0 && product.quantityAvailable < 10 && (
            <div className={styles.lowStockWarning}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={styles.warningIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              Only {product.quantityAvailable} left! Hurry up!
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionTitle}>About This Deal</h2>
              <p className={styles.description}>{product.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.addToCartButton}
              disabled={product.quantityAvailable === 0}
              onClick={handleBuyNow}
            >
              {product.quantityAvailable > 0 ? 'Buy Now' : 'Deal Expired'}
            </button>
            <Link to="/products" className={styles.backButton}>
              Back to Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        product={product}
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckout}
      />
    </div>
  )
}
