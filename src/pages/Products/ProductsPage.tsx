import { useState, useRef, useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useProductsPagination } from '@services/holding.graphql'
import { HoldingProduct } from '@lib/api/types'
import { getEnv } from '@lib/helpers/env'
import ProductCard from '@components/molecules/ProductCard'
import ProductCardSkeleton from '@components/molecules/ProductCardSkeleton'
import CheckoutModal from '@components/organisms/CheckoutModal'
import FeaturedProducts from '@components/organisms/FeaturedProducts'
import Pagination from '@components/molecules/Pagination/Pagination'
import styles from './ProductsPage.module.css'

const routeApi = getRouteApi('/')

/**
 * Products List Page (Groupon-like Coupons/Deals)
 *
 * Features:
 * - Featured Products
 * - New Products (Paginated)
 * - Product cards with buy functionality
 * - Checkout modal with QR code coupon
 * - Responsive grid layout
 */
export default function ProductsPage() {
  // Get loader data to avoid duplicate requests
  const loaderData = routeApi.useLoaderData()
  const featuredCollectionId = Number(getEnv('FEATURED_COLLECTION_ID') || '29')

  const [selectedProduct, setSelectedProduct] = useState<HoldingProduct | null>(null)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  // Track if we've ever successfully loaded data to differentiate initial vs pagination load
  const hasLoadedDataRef = useRef(false)

  const {
    data: products,
    isLoading: productsLoading,
    isFetching: productsFetching,
    error: productsError,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    currentPage,
    totalPages
  } = useProductsPagination(20, {
    initialData: loaderData?.products,
    staleTime: 5 * 60 * 1000
  })

  // Track when data has been successfully loaded
  useEffect(() => {
    if (products.length > 0 && !productsFetching) {
      hasLoadedDataRef.current = true
    }
  }, [products.length, productsFetching])

  // Differentiate between initial load and pagination load
  const isInitialLoad = productsLoading && !hasLoadedDataRef.current
  const isPaginationLoad = productsFetching && hasLoadedDataRef.current

  // Handle buy button click
  const handleBuyClick = (product: HoldingProduct) => {
    setSelectedProduct(product)
    setIsCheckoutModalOpen(true)
  }

  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false)
    setSelectedProduct(null)
  }

  // Initial loading state (first page load only)
  if (isInitialLoad) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <span className="loading loading-spinner loading-lg"></span>
          <p>Cargando ofertas...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (productsError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error al cargar ofertas</h2>
          <p>{productsError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Hero Section - Featured Products */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <FeaturedProducts
            collectionId={featuredCollectionId}
            title="Descubre las mejores ofertas"
            subtitle="Ahorra hasta un 70% en restaurantes, spa, actividades y más."
          />
        </div>
      </section>

      {/* Banner Section - Ad Image */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerContainer}>
          <img
            src="/sample-ad-2-desktop.png"
            alt="Explore the world"
            className="w-full h-[150px] object-cover rounded-xl shadow-md"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      </section>

      {/* Products Grid Section */}
      <section className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Descubre lo más nuevo</h2>
        </div>

        {products.length === 0 && !isPaginationLoad ? (
          <div className={styles.empty}>
            <h2>No se encontraron ofertas</h2>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {isPaginationLoad ? (
                <>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-${index}`} />
                  ))}
                </>
              ) : (
                products.length > 0 &&
                products.map((product) => (
                  <ProductCard key={product.id} product={product} onBuyClick={handleBuyClick} />
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {(products.length > 0 || isPaginationLoad) && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={goToNextPage}
                onPrev={goToPreviousPage}
                hasNext={hasNextPage}
                hasPrev={hasPreviousPage}
              />
            )}
          </>
        )}
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.howItWorksContainer}>
          <h2 className={styles.howItWorksTitle}>Compra tu cupón en tres simples pasos</h2>
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepIconContainer}>1</div>
              <h3 className={styles.stepTitle}>Busca tu oferta</h3>
              <p className={styles.stepText}>Encuentra el descuento que más te guste en nuestra plataforma.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIconContainer}>2</div>
              <h3 className={styles.stepTitle}>Realiza tu compra</h3>
              <p className={styles.stepText}>Paga de forma segura con tu tarjeta de crédito o débito.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIconContainer}>3</div>
              <h3 className={styles.stepTitle}>¡Disfruta!</h3>
              <p className={styles.stepText}>Presenta tu cupón en el establecimiento y vive la experiencia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal product={selectedProduct} isOpen={isCheckoutModalOpen} onClose={handleCloseCheckout} />
      )}

      <footer className={styles.footer}></footer>
    </div>
  )
}
