import { Link } from '@tanstack/react-router'
import { HoldingProduct } from '@lib/api/types'
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

  const isOutOfStock = product.quantityAvailable <= 0

  return (
    <Link
      to="/products/$productId"
      params={{ productId: String(product.id) }}
      className={styles.cardLink}
    >
      <div className={styles.card}>
        {/* Product Image */}
        <div className={styles.imageContainer}>
          <img
            src={product.productImageUrl}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
          {isOutOfStock && (
            <div className={styles.outOfStockBadge}>
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.content}>
          <h3 className={styles.title}>{product.name}</h3>
          <p className={styles.description}>
            {product.description.length > 80
              ? `${product.description.substring(0, 80)}...`
              : product.description}
          </p>

          {/* Price and Buy Section */}
          <div className={styles.footer}>
            <div className={styles.priceContainer}>
              <span className={styles.priceLabel}>Price</span>
              <span className={styles.price}>${product.salePrice.toFixed(2)}</span>
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

          {/* Stock Info */}
          {!isOutOfStock && product.quantityAvailable < 10 && (
            <div className={styles.stockWarning}>
              Only {product.quantityAvailable} left!
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
