import { Link } from '@tanstack/react-router'
import { HoldingProduct } from '@lib/api/types'
import { calculateDiscountPercentage, formatPrice } from '@lib/helpers/promotions'
import styles from './ProductCard.module.css'

export interface ProductCardProps {
  product: HoldingProduct
  onBuyClick?: (product: HoldingProduct) => void
}

/**
 * ProductCard Component
 *
 * Displays a product/deal card with image, name, price, and buy button.
 * Used in product listing pages for Groupon-like coupon deals.
 *
 * @example
 * <ProductCard
 *   product={product}
 *   onBuyClick={(product) => handlePurchase(product)}
 * />
 */
const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl = product.productImageUrl || product.imageUrl || ''
  const salePrice = product.salePrice ?? product.price ?? 0

  // Promotion data
  const couponSetting = product.couponSetting
  const originalPrice = couponSetting?.originalPrice
  const hasDiscount = originalPrice && originalPrice > salePrice
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(originalPrice, salePrice) : 0

  // Vendor data
  const vendorName = product.store?.name || 'N1 Store'
  const vendorImage = product.store?.storeImageUrl
  const vendorInitial = vendorName.charAt(0).toUpperCase()

  return (
    <Link to="/products/$productId" params={{ productId: String(product.id) }} className={styles.cardLink}>
      <div className={styles.card}>
        {/* Product Image */}
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={product.name} className={styles.image} loading="lazy" />
          {discountPercentage > 0 && <div className={styles.discountBadge}>{discountPercentage}% OFF</div>}
        </div>

        {/* Product Info */}
        <div className={styles.content}>
          {/* Vendor */}
          <div className={styles.vendorInfo}>
            {vendorImage ? (
              <img src={vendorImage} alt={vendorName} className={styles.vendorLogoImage} />
            ) : (
              <div className={styles.vendorLogo}>{vendorInitial}</div>
            )}
            <span className={styles.vendorName}>{vendorName}</span>
          </div>

          <h3 className={styles.title}>{product.name}</h3>

          {/* Price */}
          <div className={styles.priceContainer}>
            {hasDiscount && <span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>}
            <span className={styles.price}>{formatPrice(salePrice)}</span>
          </div>

          {/* Footer / Timer */}
          <div className={styles.footer}>
            <div className={styles.timer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                  clipRule="evenodd"
                />
              </svg>
              Finaliza en :2 días
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
