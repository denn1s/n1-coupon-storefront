import { Link } from '@tanstack/react-router'
import { HoldingProduct } from '@lib/api/types'
import { calculateDiscountPercentage, formatCountdown, formatPrice } from '@lib/helpers/promotions'
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
const ProductCard = ({ product, onBuyClick }: ProductCardProps) => {
  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onBuyClick?.(product)
  }

  const quantityAvailable = product.quantityAvailable ?? 0
  const isOutOfStock = quantityAvailable <= 0
  const imageUrl = product.productImageUrl || product.imageUrl || ''
  const description = product.description || ''
  const salePrice = product.salePrice ?? product.price ?? 0

  // Promotion data
  const couponSetting = product.couponSetting
  const originalPrice = couponSetting?.originalPrice
  const hasDiscount = originalPrice && originalPrice > salePrice
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(originalPrice, salePrice) : 0
  const countdown = formatCountdown(couponSetting?.endDate ?? null)

  return (
    <Link to="/products/$productId" params={{ productId: String(product.id) }} className={styles.cardLink}>
      <div className={styles.card}>
        {/* Product Image */}
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={product.name} className={styles.image} loading="lazy" />
          {isOutOfStock && <div className={styles.outOfStockBadge}>Out of Stock</div>}
          {discountPercentage > 0 && <div className={styles.discountBadge}>{discountPercentage}% OFF</div>}
        </div>

        {/* Product Info */}
        <div className={styles.content}>
          <h3 className={styles.title}>{product.name}</h3>
          <p className={styles.description}>
            {description.length > 80 ? `${description.substring(0, 80)}...` : description}
          </p>

          {/* Price and Buy Section */}
          <div className={styles.footer}>
            <div className={styles.priceContainer}>
              {hasDiscount && <span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>}
              <span className={styles.price}>{formatPrice(salePrice)}</span>
            </div>

            <button
              onClick={handleBuyClick}
              disabled={isOutOfStock}
              className={styles.buyButton}
              aria-label={`Buy ${product.name}`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
            </button>
          </div>

          {/* Countdown Timer */}
          {countdown && <div className={styles.countdown}>⏰ {countdown}</div>}

          {/* Stock Info */}
          {!isOutOfStock && quantityAvailable < 10 && (
            <div className={styles.stockWarning}>Only {quantityAvailable} left!</div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
