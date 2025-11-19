import { useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { graphqlQueryFn } from '@lib/api/graphqlFn'
import {
  OrdersListResponse,
  OrderDetailResponse,
  PaginationVariables
} from '@lib/api/types'
import { useState } from 'react'

/**
 * Orders GraphQL Service
 *
 * This service provides hooks for fetching orders list and individual order details.
 * It implements intelligent caching by seeding individual order queries from the list data.
 */

// ============================================================================
// GRAPHQL QUERIES
// ============================================================================

const ORDERS_LIST_QUERY = `
  query GetOrders($first: Int, $last: Int, $before: String, $after: String) {
    orders(
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        orderId
        name
        orderDate
        orderType
        orderStatus
        storeId
        storeName
        storeImageUrl
        storeBannerUrl
        storeBannerColor
        timezone
        locale
        currencyCode
        currencySymbol
        totalFormatted
        subTotal
        totalDiscount
        totalSurcharge
        total
        paymentDate
        paymentOption
        shipmentOption
        shipmentType
        shipmentStatus
        requiresShipping
        orderDetails {
          itemId
          name
          description
          price
          promoPrice
          productImageUrl
          requiresShipping
          productMetadata {
            key
            value
          }
          quantity
          subTotal
        }
        couponStatus
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`

const ORDER_DETAIL_QUERY = `
  query GetOrder($orderId: Int!) {
    orderView(input: {id: $orderId}) {
      id
      status
      subTotal
      discountEffects {
        id
        name
        amount
      }
      surchargeEffects {
        id
        name
        amount
      }
      deliveryCost
      driverTip
      totalDiscount
      totalSurcharge
      total
      created
      checkoutNote
      store {
        id
        name
        imageUrl
        currencySymbol
        currencyCode
        locale
        timezone
      }
      shipment {
        shipmentOptionType
        originAddress {
          name
          address
          coordinates {
            latitude
            longitude
          }
          phone
        }
        destinationAddress {
          name
          address
          coordinates {
            latitude
            longitude
          }
          phone
        }
        history {
          shipmentStatus
          entry
          created
          entryStatus
        }
        estimatedTimeOfArrival
        trackingLinkUrl
        driver {
          id
          name
          phone
          licensePlate
          avatar
        }
      }
      orderDetails {
        itemId
        modifiers {
          modifierId
          name
          selectedOptionsTotal
          selectedOptions {
            selectedOptionId
            name
            amount
          }
        }
        note
        name
        price
        promoId
        promoPrice
        quantity
        subTotal
        modifiersTotal
        sKU
        productImageUrl
        requiresShipping
        productMetadata {
          key
          value
        }
      }
      payment {
        status
        paymentOptionType
        paymentMethod {
          cardholderName
          lastDigits
          firstDigits
          type
          cardName
        }
        creditsChargeAmount
      }
    }
    coupon: getCouponByOrderId(orderId: $orderId) {
      code
      qrCodeUrl
      endDate
    }
  }
`

// ============================================================================
// QUERY FUNCTIONS (Internal)
// ============================================================================

const getOrdersList = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, OrdersListResponse>(ORDERS_LIST_QUERY, variables)

const getOrderDetail = (orderId: number) =>
  graphqlQueryFn<{ orderId: number }, OrderDetailResponse>(ORDER_DETAIL_QUERY, { orderId })

// ============================================================================
// ORDERS LIST HOOKS
// ============================================================================

/**
 * Fetch paginated orders list with cursor-based pagination
 * Automatically seeds individual order cache from list data
 *
 * @example Basic usage
 * const { data, isLoading } = useGetOrders({ first: 20 })
 */
export const useGetOrders = (variables: PaginationVariables = { first: 20 }) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['orders', 'list', variables],
    queryFn: getOrdersList(variables),
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    select: (data) => {
      // Seed individual order queries from list data for instant navigation
      data.orders.nodes.forEach((order) => {
        // Cache the basic order data from the list
        // This will be used as initialData for the detail page
        queryClient.setQueryData(['orders', 'detail', order.orderId], (oldData: OrderDetailResponse | undefined) => {
          // Only seed if we don't already have more detailed data
          if (!oldData || !oldData.orderView) {
            // Transform list item to detail format for caching
            return {
              orderView: {
                id: parseInt(order.orderId),
                status: order.orderStatus,
                subTotal: order.subTotal,
                totalDiscount: order.totalDiscount,
                totalSurcharge: order.totalSurcharge,
                total: order.total,
                created: order.orderDate,
                deliveryCost: 0,
                driverTip: 0,
                store: {
                  id: order.storeId,
                  name: order.storeName,
                  imageUrl: order.storeImageUrl,
                  currencySymbol: order.currencySymbol,
                  currencyCode: order.currencyCode,
                  locale: order.locale,
                  timezone: order.timezone
                },
                orderDetails: order.orderDetails,
                payment: {
                  status: 'PAID',
                  paymentOptionType: order.paymentOption || 'UNKNOWN'
                }
              },
              // Don't seed coupon data, let it be fetched fresh
              coupon: null
            } as OrderDetailResponse
          }
          return oldData
        })
      })
      return data.orders
    }
  })
}

/**
 * Query options for orders list (useful for route prefetching)
 */
export const ordersOptions = (variables: PaginationVariables = { first: 20 }) =>
  queryOptions({
    queryKey: ['orders', 'list', variables],
    queryFn: getOrdersList(variables),
    staleTime: 2 * 60 * 1000
  })

/**
 * Hook to simplify cursor-based pagination for orders
 *
 * @example
 * const {
 *   data,
 *   totalCount,
 *   hasNextPage,
 *   goToNextPage,
 *   isLoading
 * } = useOrdersPagination(20)
 */
export const useOrdersPagination = (pageSize: number = 20) => {
  const [variables, setVariables] = useState<PaginationVariables>({
    first: pageSize
  })

  const query = useGetOrders(variables)

  const pageInfo = query.data?.pageInfo
  const orders = query.data?.nodes ?? []
  const totalCount = query.data?.totalCount ?? 0

  const goToNextPage = () => {
    if (pageInfo?.hasNextPage && pageInfo.endCursor) {
      setVariables({
        first: pageSize,
        after: pageInfo.endCursor
      })
    }
  }

  const goToPreviousPage = () => {
    if (pageInfo?.hasPreviousPage && pageInfo.startCursor) {
      setVariables({
        last: pageSize,
        before: pageInfo.startCursor
      })
    }
  }

  const resetPagination = () => {
    setVariables({ first: pageSize })
  }

  return {
    // Data
    data: orders,
    totalCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    // Pagination state
    hasNextPage: pageInfo?.hasNextPage ?? false,
    hasPreviousPage: pageInfo?.hasPreviousPage ?? false,

    // Pagination controls
    goToNextPage,
    goToPreviousPage,
    resetPagination,

    // Advanced
    pageInfo,
    refetch: query.refetch
  }
}

// ============================================================================
// ORDER DETAIL HOOKS
// ============================================================================

/**
 * Fetch single order detail with coupon
 * Uses cached data from list as initialData for instant loading
 *
 * @example
 * const { data, isLoading, refetch } = useGetOrder(orderId)
 */
export const useGetOrder = (orderId: string) => {
  const orderIdNum = parseInt(orderId)

  return useQuery({
    queryKey: ['orders', 'detail', orderId],
    queryFn: getOrderDetail(orderIdNum),
    enabled: !!orderId && !isNaN(orderIdNum),
    staleTime: 1 * 60 * 1000 // 1 minute cache
  })
}

/**
 * Query options for order detail (useful for route prefetching)
 */
export const orderOptions = (orderId: string) => {
  const orderIdNum = parseInt(orderId)

  return queryOptions({
    queryKey: ['orders', 'detail', orderId],
    queryFn: getOrderDetail(orderIdNum),
    staleTime: 1 * 60 * 1000
  })
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Get recent orders (last 5)
 *
 * @example
 * const { data: recentOrders } = useRecentOrders()
 */
export const useRecentOrders = () => {
  return useGetOrders({ first: 5 })
}

/**
 * Get order count for the user
 *
 * @example
 * const orderCount = useOrderCount()
 */
export const useOrderCount = (): number => {
  const { data } = useGetOrders({ first: 1 })
  return data?.totalCount ?? 0
}
