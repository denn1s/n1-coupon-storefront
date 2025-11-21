import { useState } from 'react'
import { Route } from '../../routes/products/$productId'
import { useNavigate, Link } from '@tanstack/react-router'
import { useAuthStore } from '@stores/authStore'
import CheckoutModal from '../../components/organisms/CheckoutModal'
import styles from './ProductDetailPage.module.css'
import { HiCheckCircle, HiExclamationCircle, HiExclamation } from 'react-icons/hi'

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
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  // Get product data from loader
  const { product } = Route.useLoaderData()

  // Set initial selected image
  if (!selectedImage && product?.images?.[0]) {
    setSelectedImage(product.images[0].url)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }
    if (product) {
      setIsCheckoutModalOpen(true)
    }
  }

  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false)
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Producto no encontrado</h2>
          <button onClick={() => navigate({ to: '/' })} className={styles.backButton}>
            Volver a la tienda
          </button>
        </div>
      </div>
    )
  }

  // Vendor data
  const vendorName = product.store?.name || 'N1 Store'
  const vendorImage = product.store?.storeImageUrl
  const vendorInitial = vendorName.charAt(0).toUpperCase()

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>
          Inicio
        </Link>
        <span>/</span>
        <Link to="/" className={styles.breadcrumbLink}>
          Ofertas
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <div className={styles.content}>
        {/* Left Column: Images */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img src={selectedImage || product.images[0]?.url || ''} alt={product.name} className={styles.image} />
          </div>
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`${styles.thumbnail} ${selectedImage === img.url ? styles.active : ''}`}
                  onClick={() => setSelectedImage(img.url)}
                >
                  <img src={img.url} alt={`${product.name} ${index + 1}`} className={styles.thumbnailImage} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className={styles.infoSection}>
          <div className={styles.vendorInfo}>
            {vendorImage ? (
              <img src={vendorImage} alt={vendorName} className={styles.vendorLogoImage} />
            ) : (
              <div className={styles.vendorLogo}>{vendorInitial}</div>
            )}
            <span className={styles.vendorName}>{vendorName}</span>
          </div>

          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.priceSection}>
            {/* Stock Status */}
            <div className={styles.stockSection}>
              {(product.quantityAvailable ?? 0) > 0 ? (
                <div className={styles.stockAvailable}>
                  <HiCheckCircle className={styles.stockIcon} />
                  <span>{product.quantityAvailable ?? 0} cupones disponibles</span>
                </div>
              ) : (
                <div className={styles.stockUnavailable}>
                  <HiExclamationCircle className={styles.stockIcon} />
                  <span>Agotado</span>
                </div>
              )}
            </div>

            {/* Low Stock Warning */}
            {(product.quantityAvailable ?? 0) > 0 && (product.quantityAvailable ?? 0) < 5 && (
              <div className={styles.lowStockWarning}>
                <HiExclamation className={styles.warningIcon} />
                <span>¡Date prisa! Quedan pocas unidades.</span>
              </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              <button className={styles.backButton} onClick={() => navigate({ to: '/' })}>
                Seguir comprando
              </button>
              <button
                className={styles.addToCartButton}
                onClick={handleBuyNow}
                disabled={(product.quantityAvailable ?? 0) <= 0}
              >
                {(product.quantityAvailable ?? 0) > 0 ? 'Comprar Ahora' : 'Agotado'}
              </button>
            </div>

            {/* Description */}
            <div className={styles.descriptionSection}>
              <h3 className={styles.descriptionTitle}>Descripción</h3>
              <p className={styles.description}>{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal product={product} isOpen={isCheckoutModalOpen} onClose={handleCloseCheckout} />
    </div>
  )
}
