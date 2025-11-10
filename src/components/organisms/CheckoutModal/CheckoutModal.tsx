import { useState } from 'react'
import { HoldingProduct } from '@lib/api/types'
import { Coupon } from '@lib/api/types'
import CouponDisplay from '@components/molecules/CouponDisplay'
import styles from './CheckoutModal.module.css'

export interface CheckoutModalProps {
  product: HoldingProduct
  isOpen: boolean
  onClose: () => void
}

/**
 * CheckoutModal Component
 *
 * Handles the dummy checkout flow for purchasing coupons/deals.
 * Shows a simple payment form and displays the coupon with QR code after purchase.
 *
 * @example
 * <CheckoutModal
 *   product={selectedProduct}
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 * />
 */
const CheckoutModal = ({ product, isOpen, onClose }: CheckoutModalProps) => {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout')
  const [purchasedCoupon, setPurchasedCoupon] = useState<Coupon | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Reset state when modal closes
  const handleClose = () => {
    setStep('checkout')
    setPurchasedCoupon(null)
    setIsProcessing(false)
    onClose()
  }

  // Handle dummy purchase
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create a dummy coupon
    const coupon: Coupon = {
      id: `CPO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: product.name,
      productImage: product.productImageUrl,
      purchaseDate: new Date().toISOString(),
      qrCode: `COUPON-${product.id}-${Date.now()}`, // In real app, this would be a unique code from backend
      price: product.salePrice,
      status: 'active',
    }

    setPurchasedCoupon(coupon)
    setStep('success')
    setIsProcessing(false)
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {step === 'checkout' ? (
          <>
            {/* Checkout Form */}
            <div className={styles.header}>
              <h2 className={styles.title}>Complete Your Purchase</h2>
              <button onClick={handleClose} className={styles.closeButton} aria-label="Close">
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
            </div>

            <div className={styles.content}>
              {/* Product Summary */}
              <div className={styles.productSummary}>
                <img
                  src={product.productImageUrl}
                  alt={product.name}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>${product.salePrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Dummy Payment Form */}
              <form onSubmit={handlePurchase} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="cardNumber" className={styles.label}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    defaultValue="4111 1111 1111 1111"
                    className={styles.input}
                    disabled={isProcessing}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="expiry" className={styles.label}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      placeholder="MM/YY"
                      defaultValue="12/25"
                      className={styles.input}
                      disabled={isProcessing}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="cvv" className={styles.label}>
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      placeholder="123"
                      defaultValue="123"
                      className={styles.input}
                      disabled={isProcessing}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    defaultValue="John Doe"
                    className={styles.input}
                    disabled={isProcessing}
                    required
                  />
                </div>

                <div className={styles.disclaimer}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={styles.disclaimerIcon}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  <span>This is a demo checkout. No real payment will be processed.</span>
                </div>

                <button type="submit" className={styles.submitButton} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing...
                    </>
                  ) : (
                    `Pay $${product.salePrice.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            {/* Success & Coupon Display */}
            <div className={styles.successContent}>
              <div className={styles.successHeader}>
                <div className={styles.successIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className={styles.successTitle}>Purchase Successful!</h2>
                <p className={styles.successMessage}>
                  Your coupon is ready. Show the QR code at the store to redeem.
                </p>
              </div>

              {purchasedCoupon && <CouponDisplay coupon={purchasedCoupon} />}

              <button onClick={handleClose} className={styles.doneButton}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CheckoutModal
