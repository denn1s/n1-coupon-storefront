import { useGetProducts } from '@services/holding.graphql'
import { HoldingProduct } from '@lib/api/types'
import ProductCard from '@components/molecules/ProductCard'
import styles from './FeaturedProducts.module.css'

/**
 * FeaturedProducts Component
 *
 * Displays products from a specific collection in a horizontal scrolling layout.
 * Perfect for showcasing featured/curated products at the top of a page.
 *
 * @example
 * <FeaturedProducts collectionId={29} title="Featured Deals" />
 */

interface FeaturedProductsProps {
  /** Collection ID to filter products by */
  collectionId: number
  /** Title for the featured section */
  title?: string
  /** Subtitle/description for the section */
  subtitle?: string
  /** Maximum number of products to display */
  maxProducts?: number
  /** Callback when buy button is clicked */
  onBuyClick?: (product: HoldingProduct) => void
}

export default function FeaturedProducts({
  collectionId,
  title = 'Featured Deals',
  subtitle,
  maxProducts = 10,
  onBuyClick
}: FeaturedProductsProps) {
  // Fetch products (we'll filter client-side since API doesn't support collection filtering yet)
  const { data, isLoading, error } = useGetProducts({ first: 50 })

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.scrollContainer}>
          <div className={styles.productsGrid}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className={styles.skeletonCard}>
                <div className={styles.skeletonImage}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return null // Silently fail - don't break the page if featured products fail to load
  }

  // Filter products by collection ID
  const allProducts = data?.holdingProducts.nodes ?? []
  const featuredProducts = allProducts
    .filter((product) => product.holdingCollections?.some((collection) => collection.id === collectionId))
    .slice(0, maxProducts)

  // Don't render if no featured products found
  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      <div className={styles.scrollContainer}>
        <div className={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <div key={product.id} className={styles.productCardWrapper}>
              <ProductCard product={product} onBuyClick={onBuyClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
