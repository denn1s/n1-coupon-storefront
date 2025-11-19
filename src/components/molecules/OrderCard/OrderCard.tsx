import { Link } from '@tanstack/react-router'
import { OrderListItem } from '@lib/api/types'
import styles from './OrderCard.module.css'

export interface OrderCardProps {
  order: OrderListItem
}

/**
 * OrderCard Component
 *
 * Displays an order card with summary information for the orders list.
 *
 * @example
 * <OrderCard order={order} />
 */
const OrderCard = ({ order }: OrderCardProps) => {
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'DELIVERED':
      case 'FINALIZED':
        return styles.statusSuccess
      case 'PENDING':
      case 'PROCESSING':
      case 'SHIPPED':
        return styles.statusPending
      case 'CANCELLED':
      case 'REFUNDED':
        return styles.statusError
      default:
        return styles.statusDefault
    }
  }

  // Format status text
  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')
  }

  const primaryProduct = order.orderDetails[0]
  const additionalItemsCount = order.orderDetails.length - 1

  return (
    <Link to="/orders/$orderId" params={{ orderId: order.orderId }} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.storeInfo}>
            {order.storeImageUrl && (
              <img src={order.storeImageUrl} alt={order.storeName} className={styles.storeLogo} />
            )}
            <div>
              <h3 className={styles.storeName}>{order.storeName}</h3>
              <p className={styles.orderDate}>{orderDate}</p>
            </div>
          </div>
          <span className={`${styles.statusBadge} ${getStatusColor(order.orderStatus)}`}>
            {formatStatus(order.orderStatus)}
          </span>
        </div>

        <div className={styles.body}>
          {primaryProduct && (
            <div className={styles.productInfo}>
              {primaryProduct.productImageUrl && (
                <img src={primaryProduct.productImageUrl} alt={primaryProduct.name} className={styles.productImage} />
              )}
              <div className={styles.productDetails}>
                <p className={styles.productName}>
                  {primaryProduct.name}
                  {additionalItemsCount > 0 && (
                    <span className={styles.additionalItems}>+{additionalItemsCount} more</span>
                  )}
                </p>
                <p className={styles.productMeta}>
                  Qty: {primaryProduct.quantity} • {order.orderType}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>{order.totalFormatted}</span>
          </div>
          {order.couponStatus && (
            <div className={styles.couponBadge}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={styles.couponIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                />
              </svg>
              <span>{formatStatus(order.couponStatus)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default OrderCard
