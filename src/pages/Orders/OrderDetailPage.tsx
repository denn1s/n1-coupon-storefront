import { Link, useParams } from '@tanstack/react-router'
import { useGetOrder } from '@services/orders.graphql'
import styles from './OrderDetailPage.module.css'

/**
 * Order Detail Page
 *
 * Displays full order details including items, payment, shipment, and coupon.
 * Includes a refresh button to reload order data.
 */
export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' })
  const { data, isLoading, error, refetch, isFetching } = useGetOrder(orderId)

  const handleRefresh = () => {
    refetch()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Order not found</h2>
          <p>{error?.message || 'Unable to load order details'}</p>
          <Link to="/orders" className={styles.backLink}>
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const { orderView: order, coupon } = data
  const orderDate = new Date(order.created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/orders" className={styles.backButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.backIcon}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Orders
        </Link>
        <button onClick={handleRefresh} disabled={isFetching} className={styles.refreshButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`${styles.refreshIcon} ${isFetching ? styles.spinning : ''}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Order Summary */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <div>
            <h1 className={styles.title}>Order #{order.id}</h1>
            <p className={styles.date}>{orderDate}</p>
          </div>
          <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>{order.status}</span>
        </div>

        {/* Store Info */}
        <div className={styles.storeSection}>
          {order.store.imageUrl && (
            <img src={order.store.imageUrl} alt={order.store.name} className={styles.storeLogo} />
          )}
          <div>
            <h2 className={styles.storeName}>{order.store.name}</h2>
            <p className={styles.storeInfo}>
              {order.store.locale} • {order.store.timezone}
            </p>
          </div>
        </div>
      </div>

      {/* Coupon Section */}
      {coupon && (
        <div className={styles.couponCard}>
          <h2 className={styles.sectionTitle}>Your Coupon</h2>
          <div className={styles.couponContent}>
            <div className={styles.qrCode}>
              <img src={coupon.qrCodeUrl} alt="Coupon QR Code" className={styles.qrImage} />
            </div>
            <div className={styles.couponDetails}>
              <p className={styles.couponCode}>
                <span className={styles.label}>Code:</span>
                <span className={styles.code}>{coupon.code}</span>
              </p>
              <p className={styles.couponExpiry}>
                <span className={styles.label}>Valid until:</span>
                <span>{new Date(coupon.endDate).toLocaleDateString()}</span>
              </p>
              <p className={styles.couponInstructions}>Show this QR code at the store to redeem your coupon.</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className={styles.itemsCard}>
        <h2 className={styles.sectionTitle}>Order Items</h2>
        <div className={styles.itemsList}>
          {order.orderDetails.map((item) => (
            <div key={item.itemId} className={styles.item}>
              {item.productImageUrl && (
                <img src={item.productImageUrl} alt={item.name} className={styles.itemImage} />
              )}
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                {item.note && <p className={styles.itemNote}>Note: {item.note}</p>}
                {item.modifiers && item.modifiers.length > 0 && (
                  <div className={styles.modifiers}>
                    {item.modifiers.map((mod) => (
                      <div key={mod.modifierId} className={styles.modifier}>
                        <span className={styles.modifierName}>{mod.name}:</span>
                        <span className={styles.modifierOptions}>
                          {mod.selectedOptions.map((opt) => opt.name).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p className={styles.itemMeta}>
                  Quantity: {item.quantity} • {order.store.currencySymbol}
                  {item.price.toFixed(2)} each
                </p>
              </div>
              <div className={styles.itemPrice}>
                {order.store.currencySymbol}
                {item.subTotal.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className={styles.paymentCard}>
        <h2 className={styles.sectionTitle}>Payment Summary</h2>
        <div className={styles.paymentDetails}>
          <div className={styles.paymentRow}>
            <span>Subtotal</span>
            <span>
              {order.store.currencySymbol}
              {order.subTotal.toFixed(2)}
            </span>
          </div>
          {order.discountEffects && order.discountEffects.length > 0 && (
            <>
              {order.discountEffects.map((discount) => (
                <div key={discount.id} className={styles.paymentRow}>
                  <span className={styles.discount}>
                    {discount.name}
                  </span>
                  <span className={styles.discount}>
                    -{order.store.currencySymbol}
                    {discount.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </>
          )}
          {order.surchargeEffects && order.surchargeEffects.length > 0 && (
            <>
              {order.surchargeEffects.map((surcharge) => (
                <div key={surcharge.id} className={styles.paymentRow}>
                  <span>{surcharge.name}</span>
                  <span>
                    {order.store.currencySymbol}
                    {surcharge.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </>
          )}
          {order.deliveryCost > 0 && (
            <div className={styles.paymentRow}>
              <span>Delivery</span>
              <span>
                {order.store.currencySymbol}
                {order.deliveryCost.toFixed(2)}
              </span>
            </div>
          )}
          {order.driverTip > 0 && (
            <div className={styles.paymentRow}>
              <span>Tip</span>
              <span>
                {order.store.currencySymbol}
                {order.driverTip.toFixed(2)}
              </span>
            </div>
          )}
          <div className={`${styles.paymentRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>
              {order.store.currencySymbol}
              {order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        {order.payment.paymentMethod && (
          <div className={styles.paymentMethod}>
            <p className={styles.paymentMethodLabel}>Payment Method</p>
            <p className={styles.paymentMethodInfo}>
              {order.payment.paymentMethod.cardName || order.payment.paymentMethod.type} ending in{' '}
              {order.payment.paymentMethod.lastDigits}
            </p>
          </div>
        )}
      </div>

      {/* Shipment Info */}
      {order.shipment && (
        <div className={styles.shipmentCard}>
          <h2 className={styles.sectionTitle}>Delivery Information</h2>
          <p className={styles.shipmentType}>{order.shipment.shipmentOptionType}</p>

          {order.shipment.originAddress && (
            <div className={styles.address}>
              <p className={styles.addressLabel}>Pickup Location</p>
              <p className={styles.addressName}>{order.shipment.originAddress.name}</p>
              <p className={styles.addressText}>{order.shipment.originAddress.address}</p>
              {order.shipment.originAddress.phone && (
                <p className={styles.addressPhone}>{order.shipment.originAddress.phone}</p>
              )}
            </div>
          )}

          {order.shipment.destinationAddress && (
            <div className={styles.address}>
              <p className={styles.addressLabel}>Delivery Address</p>
              <p className={styles.addressName}>{order.shipment.destinationAddress.name}</p>
              <p className={styles.addressText}>{order.shipment.destinationAddress.address}</p>
              {order.shipment.destinationAddress.phone && (
                <p className={styles.addressPhone}>{order.shipment.destinationAddress.phone}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
