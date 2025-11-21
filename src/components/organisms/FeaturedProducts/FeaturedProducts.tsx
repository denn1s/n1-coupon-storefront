import { useGetProducts } from '@services/holding.graphql'
import ProductCard from '@components/molecules/ProductCard'
import styles from './FeaturedProducts.module.css'

interface FeaturedProductsProps {
  collectionId: number
  title?: string
  subtitle?: string
  maxProducts?: number
  variant?: 'default' | 'dark'
}

export default function FeaturedProducts({
  collectionId,
  title = 'Featured Deals',
  subtitle,
  maxProducts = 10,
  variant = 'default'
}: FeaturedProductsProps) {
  // Fetch products with collection filter
  const { data, isLoading, error } = useGetProducts({
    first: 20,
    where: {
      holdingCollections: {
        some: {
          id: { in: [collectionId] }
        }
      }
    }
  })

  const containerClass = `${styles.container} ${variant === 'dark' ? styles.dark : ''}`

  if (isLoading) {
    return (
      <div className={containerClass}>
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

  // Get filtered products directly from API response
  const allProducts = data?.holdingProducts.nodes ?? []
  const featuredProducts = allProducts.slice(0, maxProducts)

  // Don't render if no featured products found
  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <div className={containerClass}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      <div className={styles.scrollContainer}>
        <div className={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <div key={product.id} className={styles.productCardWrapper}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
