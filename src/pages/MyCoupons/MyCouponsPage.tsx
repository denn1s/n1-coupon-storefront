import { useState } from 'react'
import { Coupon } from '@lib/api/types'
import CouponDisplay from '@components/molecules/CouponDisplay'
import styles from './MyCouponsPage.module.css'

/**
 * My Coupons Page
 *
 * Displays all purchased coupons for the user.
 * Currently using mock data - will be connected to API when endpoints are available.
 *
 * Features:
 * - List of purchased coupons
 * - Filter by status (active, redeemed, expired)
 * - View coupon QR code
 */
export default function MyCouponsPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [statusFilter, setStatusFilter] = useState<Coupon['status'] | 'all'>('all')

  // TODO: Replace with actual API call when endpoint is available
  // const { data: coupons, isLoading, error } = useGetMyCoupons()

  // Mock data for demonstration
  const mockCoupons: Coupon[] = [
    {
      id: 'CPO-001',
      productId: 19087,
      productName: 'Black and White Cookie',
      productImage: 'https://cdn.h4b.dev/images/store85/products/product19087/Image1.jpg?20220401011344',
      purchaseDate: '2025-11-10T10:30:00Z',
      qrCode: 'COUPON-19087-1699617000',
      price: 3.50,
      status: 'active',
    },
    {
      id: 'CPO-002',
      productId: 19088,
      productName: 'Creamy Cheesecake',
      productImage: 'https://cdn.h4b.dev/images/store85/products/product19088/Image1.jpg?20220401011419',
      purchaseDate: '2025-11-08T14:20:00Z',
      qrCode: 'COUPON-19088-1699444800',
      price: 5.00,
      status: 'redeemed',
    },
  ]

  const filteredCoupons = mockCoupons.filter((coupon) =>
    statusFilter === 'all' ? true : coupon.status === statusFilter
  )

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>My Coupons</h1>
        <p className={styles.subtitle}>View and manage your purchased coupons</p>
      </div>

      {/* Coming Soon Notice */}
      <div className={styles.notice}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={styles.noticeIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
        <div>
          <p className={styles.noticeTitle}>Backend Integration Pending</p>
          <p className={styles.noticeText}>
            This page shows sample data. Your actual purchased coupons will appear here once the API endpoint is available.
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>Filter by status:</span>
        <div className={styles.filterButtons}>
          <button
            onClick={() => setStatusFilter('all')}
            className={`${styles.filterButton} ${statusFilter === 'all' ? styles.filterButtonActive : ''}`}
          >
            All ({mockCoupons.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`${styles.filterButton} ${statusFilter === 'active' ? styles.filterButtonActive : ''}`}
          >
            Active ({mockCoupons.filter((c) => c.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('redeemed')}
            className={`${styles.filterButton} ${statusFilter === 'redeemed' ? styles.filterButtonActive : ''}`}
          >
            Redeemed ({mockCoupons.filter((c) => c.status === 'redeemed').length})
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`${styles.filterButton} ${statusFilter === 'expired' ? styles.filterButtonActive : ''}`}
          >
            Expired ({mockCoupons.filter((c) => c.status === 'expired').length})
          </button>
        </div>
      </div>

      {/* Coupons List */}
      {filteredCoupons.length === 0 ? (
        <div className={styles.empty}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.emptyIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
            />
          </svg>
          <h2>No Coupons Found</h2>
          <p>
            {statusFilter === 'all'
              ? "You haven't purchased any coupons yet."
              : `You don't have any ${statusFilter} coupons.`}
          </p>
        </div>
      ) : (
        <div className={styles.couponsList}>
          {filteredCoupons.map((coupon) => (
            <div key={coupon.id} className={styles.couponCard}>
              <img
                src={coupon.productImage}
                alt={coupon.productName}
                className={styles.couponImage}
              />
              <div className={styles.couponInfo}>
                <h3 className={styles.couponName}>{coupon.productName}</h3>
                <p className={styles.couponPrice}>${coupon.price.toFixed(2)}</p>
                <p className={styles.couponDate}>
                  Purchased {new Date(coupon.purchaseDate).toLocaleDateString()}
                </p>
                <span
                  className={`${styles.couponStatus} ${styles[`couponStatus${coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}`]}`}
                >
                  {coupon.status === 'active' && '✓ Active'}
                  {coupon.status === 'redeemed' && '✓ Redeemed'}
                  {coupon.status === 'expired' && '✕ Expired'}
                </span>
              </div>
              <button
                onClick={() => setSelectedCoupon(coupon)}
                className={styles.viewButton}
                disabled={coupon.status === 'expired'}
              >
                View QR Code
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Coupon Detail Modal */}
      {selectedCoupon && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCoupon(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <CouponDisplay coupon={selectedCoupon} onClose={() => setSelectedCoupon(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
