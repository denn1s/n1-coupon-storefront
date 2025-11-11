import styles from './ProductCardSkeleton.module.css'

/**
 * ProductCardSkeleton Component
 *
 * Skeleton loader for ProductCard, shown during pagination loading.
 * Matches the ProductCard dimensions and layout for smooth transitions.
 */
const ProductCardSkeleton = () => {
  return (
    <div className={styles.card}>
      {/* Image skeleton */}
      <div className={styles.imageSkeleton} />

      {/* Content skeleton */}
      <div className={styles.content}>
        {/* Title skeleton - 2 lines */}
        <div className={styles.titleSkeleton} />
        <div className={styles.titleSkeleton} style={{ width: '60%' }} />

        {/* Description skeleton - 3 lines */}
        <div className={styles.descriptionSkeleton} />
        <div className={styles.descriptionSkeleton} />
        <div className={styles.descriptionSkeleton} style={{ width: '40%' }} />

        {/* Footer skeleton */}
        <div className={styles.footer}>
          <div className={styles.priceSkeleton} />
          <div className={styles.buttonSkeleton} />
        </div>
      </div>
    </div>
  )
}

export default ProductCardSkeleton
