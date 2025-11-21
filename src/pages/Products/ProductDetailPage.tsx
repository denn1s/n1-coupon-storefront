import { useState } from 'react'
import { Route } from '@routes/products/$productId'
import { Link, useParams } from '@tanstack/react-router'
import CheckoutModal from '@components/organisms/CheckoutModal'
import { calculateDiscountPercentage, formatCountdown, formatPrice } from '@lib/helpers/promotions'
import type { ProductImage } from '@lib/api/types'
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
  useParams({ from: '/products/$productId' })
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  // Use loader data (already fetched and cached by the route loader)
  const { product } = Route.useLoaderData()

  // Handle buy button click
  const handleBuyNow = () => {
    if (product) {
      setIsCheckoutModalOpen(true)
    }
  }

  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false)
  }

  // Not found state
  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const displayImage = selectedImage || product.productImageUrl || product.imageUrl || ''

  // Promotion data
  const couponSetting = product.couponSetting
  const salePrice = product.salePrice ?? product.price ?? 0
  const originalPrice = couponSetting?.originalPrice
  const hasDiscount = originalPrice && originalPrice > salePrice
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(originalPrice, salePrice) : 0
  const countdown = formatCountdown(couponSetting?.endDate ?? null)

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>
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
            <img src={displayImage} alt={product.name} className={styles.image} />
          </div>

          {/* Thumbnail Gallery (if additional images exist) */}
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((image: ProductImage, index: number) => (
                <button
                  key={image.sequence ?? index}
                  className={styles.thumbnail}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img src={image.url} alt={`${product.name} - ${index + 1}`} className={styles.thumbnailImage} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <h1 className={styles.title}>{product.name}</h1>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className={styles.discountBadge}>
              <span className={styles.discountText}>{discountPercentage}% OFF</span>
            </div>
          )}

          {/* Price */}
          <div className={styles.priceSection}>
            <div className={styles.priceContainer}>
              {hasDiscount && (
                <div className={styles.originalPriceContainer}>
                  <span className={styles.originalPriceLabel}>Original Price:</span>
                  <span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>
                </div>
              )}
              <div className={styles.salePriceContainer}>
                <span className={styles.priceLabel}>Deal Price</span>
                <span className={styles.price}>{formatPrice(salePrice)}</span>
              </div>
              {hasDiscount && (
                <div className={styles.savings}>You save: {formatPrice(originalPrice - salePrice)}</div>
              )}
            </div>
          </div>

          {/* Countdown Timer */}
          {countdown && (
            <div className={styles.countdownBanner}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={styles.countdownIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className={styles.countdownText}>⏰ Hurry! {countdown}</span>
            </div>
          )}

          {/* Stock Status */}
          <div className={styles.stockSection}>
            {(product.quantityAvailable ?? 0) > 0 ? (
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
                <span>{product.quantityAvailable ?? 0} coupons available</span>
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
          {(product.quantityAvailable ?? 0) > 0 && (product.quantityAvailable ?? 0) < 10 && (
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
              Only {product.quantityAvailable ?? 0} left! Hurry up!
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
              disabled={(product.quantityAvailable ?? 0) === 0}
              onClick={handleBuyNow}
            >
              {(product.quantityAvailable ?? 0) > 0 ? 'Buy Now' : 'Deal Expired'}
            </button>
            <Link to="/" className={styles.backButton}>
              Back to Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal product={product} isOpen={isCheckoutModalOpen} onClose={handleCloseCheckout} />
    </div>
  )
}
