import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Coupon } from '@lib/api/types'
import styles from './CouponDisplay.module.css'

export interface CouponDisplayProps {
  coupon: Coupon
  onClose?: () => void
}

/**
 * CouponDisplay Component
 *
 * Displays a purchased coupon with QR code for redemption.
 * Shows product details, price paid, and scannable QR code.
 *
 * @example
 * <CouponDisplay
 *   coupon={purchasedCoupon}
 *   onClose={() => setShowCoupon(false)}
 * />
 */
const CouponDisplay = ({ coupon, onClose }: CouponDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate QR code
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        coupon.qrCode,
        {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('QR Code generation error:', error)
        }
      )
    }
  }, [coupon.qrCode])

  const statusColors = {
    active: styles.statusActive,
    redeemed: styles.statusRedeemed,
    expired: styles.statusExpired,
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Your Coupon</h2>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={styles.closeIcon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Coupon Content */}
      <div className={styles.content}>
        {/* Product Info */}
        <div className={styles.productInfo}>
          <img
            src={coupon.productImage}
            alt={coupon.productName}
            className={styles.productImage}
          />
          <h3 className={styles.productName}>{coupon.productName}</h3>
          <div className={styles.priceInfo}>
            <span className={styles.priceLabel}>Amount Paid</span>
            <span className={styles.price}>${coupon.price.toFixed(2)}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className={styles.qrSection}>
          <div className={styles.qrContainer}>
            <canvas ref={canvasRef} className={styles.qrCode} />
          </div>
          <p className={styles.qrInstructions}>
            Show this QR code at the store to redeem your coupon
          </p>
          <p className={styles.couponId}>Coupon ID: {coupon.id}</p>
        </div>

        {/* Status */}
        <div className={styles.statusSection}>
          <span className={`${styles.statusBadge} ${statusColors[coupon.status]}`}>
            {coupon.status === 'active' && '✓ Active'}
            {coupon.status === 'redeemed' && '✓ Redeemed'}
            {coupon.status === 'expired' && '✕ Expired'}
          </span>
          <p className={styles.purchaseDate}>
            Purchased on {new Date(coupon.purchaseDate).toLocaleDateString()}
          </p>
        </div>

        {/* Actions */}
        {coupon.status === 'active' && (
          <div className={styles.actions}>
            <button
              onClick={() => {
                // Download QR code
                const canvas = canvasRef.current
                if (canvas) {
                  const url = canvas.toDataURL('image/png')
                  const link = document.createElement('a')
                  link.download = `coupon-${coupon.id}.png`
                  link.href = url
                  link.click()
                }
              }}
              className={styles.downloadButton}
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CouponDisplay
