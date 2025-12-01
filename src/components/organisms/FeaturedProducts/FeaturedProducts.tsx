import { useState, useEffect, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { useGetProducts } from '@services/holding.graphql'
import { HoldingProduct } from '@lib/api/types'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import styles from './FeaturedProducts.module.css'

interface FeaturedProductsProps {
  collectionId: number
  title?: string
  subtitle?: string
  maxProducts?: number
  onBuyClick?: (product: HoldingProduct) => void
}

export default function FeaturedProducts({ collectionId, maxProducts = 5, onBuyClick }: FeaturedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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

  // Get filtered products directly from API response
  const allProducts = data?.holdingProducts.nodes ?? []
  const featuredProducts = allProducts.slice(0, maxProducts)
  const hasProducts = featuredProducts.length > 0

  const nextProduct = useCallback(() => {
    if (!hasProducts) return
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
  }, [hasProducts, featuredProducts.length])

  const prevProduct = useCallback(() => {
    if (!hasProducts) return
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
  }, [hasProducts, featuredProducts.length])

  // Auto-advance carousel
  useEffect(() => {
    if (!hasProducts) return

    const timer = setInterval(() => {
      nextProduct()
    }, 5000)
    return () => clearInterval(timer)
  }, [hasProducts, nextProduct])

  const containerClass = styles.container

  if (isLoading) {
    return (
      <div className={`${containerClass} animate-pulse h-[500px] flex items-center justify-center`}>
        <div className="text-white/50">Loading featured deals...</div>
      </div>
    )
  }

  if (error || !hasProducts) {
    return null
  }

  const currentProduct = featuredProducts[currentIndex]

  // Calculate discount percentage
  const discount =
    currentProduct.salePrice && currentProduct.price
      ? Math.round(((currentProduct.price - currentProduct.salePrice) / currentProduct.price) * 100)
      : 0

  return (
    <div className={containerClass}>
      <Link
        to="/products/$productId"
        params={{ productId: String(currentProduct.id) }}
        className={styles.contentWrapper}
      >
        {/* Left Content: Details */}
        <div className={styles.textContent} key={currentProduct.id}>
          <div className={`${styles.brandBadge} ${styles.fadeIn}`}>
            <span className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] text-black font-bold">
              N
            </span>
            <span>{currentProduct.store?.name || 'N1 Store'}</span>
          </div>

          <h2 className={`${styles.title} ${styles.fadeIn}`} style={{ animationDelay: '0.1s' }}>
            {currentProduct.name}
          </h2>

          <div className={`${styles.priceContainer} ${styles.fadeIn}`} style={{ animationDelay: '0.2s' }}>
            {currentProduct.price > currentProduct.salePrice && (
              <span className={styles.originalPrice}>${currentProduct.price.toFixed(2)}</span>
            )}
            <span className={styles.currentPrice}>${currentProduct.salePrice.toFixed(2)}</span>
            {discount > 0 && <span className={styles.discountBadge}>{discount}% OFF</span>}
          </div>

          <div className={`${styles.actionButton} ${styles.fadeIn}`} style={{ animationDelay: '0.3s' }}>
            Comprar ahora
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Right Content: Image */}
        <div className={styles.imageContent}>
          <img
            src={currentProduct.productImageUrl || currentProduct.imageUrl || ''}
            alt={currentProduct.name}
            className={`${styles.productImage} ${styles.fadeIn}`}
          />
        </div>
      </Link>

      {/* Navigation */}
      {featuredProducts.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prevProduct()
            }}
            className={`${styles.navButton} ${styles.navButtonLeft}`}
            aria-label="Previous product"
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              nextProduct()
            }}
            className={`${styles.navButton} ${styles.navButtonRight}`}
            aria-label="Next product"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  )
}
