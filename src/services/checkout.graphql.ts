import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import { graphqlQueryFn, graphqlMutationFn } from '@lib/api/graphqlFn'
import {
  CheckoutSessionResponse,
  CheckoutSessionInput,
  CheckoutInput,
  CheckoutResponse
} from '@lib/api/types'
import { addToast } from '@lib/toasts'

/**
 * Checkout GraphQL Service
 *
 * This service provides hooks for managing checkout sessions and processing orders.
 * Updated to match APIDOCS.md structure
 */

// ============================================================================
// GRAPHQL QUERIES
// ============================================================================

const CHECKOUT_SESSION_QUERY = `
  query GetCheckoutSession($input: GetAppCheckoutSessionQueryInput!) {
    checkoutSession(input: $input) {
      customerSessionId
      cartDetail {
        storeId
        locationId
        cart {
          productId
          name
          productImageUrl
          price
          promoPrice
          salePrice
          quantity
          requiresShipping
          productMetadata {
            key
            value
          }
        }
        savedTotal
        total
      }
      store {
        id
        name
        locations {
          id
          name
          isDefault
        }
      }
      paymentOptions {
        id
        name
        paymentOptionType
      }
      shipmentOptions {
        id
        name
        baseCost
        shipmentOptionType
      }
      buyer {
        id
        name
        email
        phone
        addresses {
          id
          name
          address
          addressLine2
          location {
            latitude
            longitude
          }
          reference
          phone
          note
        }
        paymentMethods {
          id
          name
          number
          cardCustomName
          cardCustomColor
          type
          isTokenized
        }
      }
      sessionDetail {
        subTotal
        totalSurcharge
        totalDiscount
        deliveryCost
        total
      }
    }
  }
`

// ============================================================================
// GRAPHQL MUTATIONS
// ============================================================================

const CHECKOUT_MUTATION = `
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        id
        orderNumber
        status
        total
        createdAt
      }
      errors {
        field
        message
      }
    }
  }
`

// ============================================================================
// QUERY FUNCTIONS (Internal)
// ============================================================================

const getCheckoutSession = (input: CheckoutSessionInput) =>
  graphqlQueryFn<{ input: CheckoutSessionInput }, CheckoutSessionResponse>(CHECKOUT_SESSION_QUERY, { input })

const processCheckout = graphqlMutationFn<{ input: CheckoutInput }, CheckoutResponse>(CHECKOUT_MUTATION)

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch a checkout session with cart details
 *
 * @example
 * const { data, isLoading } = useGetCheckoutSession({
 *   storeId: 57,
 *   cart: { productId: 18804, quantity: 1 }
 * })
 * const session = data?.checkoutSession
 */
export const useGetCheckoutSession = (input: CheckoutSessionInput) => {
  return useQuery({
    queryKey: ['checkout', 'session', input],
    queryFn: getCheckoutSession(input),
    enabled: !!input.storeId && !!input.cart.productId,
    staleTime: 1 * 60 * 1000 // 1 minute cache
  })
}

/**
 * Query options for checkout session (useful for route prefetching)
 */
export const checkoutSessionOptions = (input: CheckoutSessionInput) =>
  queryOptions({
    queryKey: ['checkout', 'session', input],
    queryFn: getCheckoutSession(input),
    staleTime: 1 * 60 * 1000
  })

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Process checkout and create an order
 *
 * @example
 * const checkout = useCheckout()
 *
 * const handleCheckout = async () => {
 *   const result = await checkout.mutateAsync({
 *     input: {
 *       checkoutSessionId: 'session_123',
 *       paymentMethodId: 'pm_card_visa',
 *       shippingAddressId: 'addr_123',
 *       billingAddressId: 'addr_123',
 *       shipmentOptionId: 'ship_standard'
 *     }
 *   })
 *
 *   if (result.checkout.order) {
 *     console.log('Order created:', result.checkout.order)
 *   } else {
 *     console.error('Checkout errors:', result.checkout.errors)
 *   }
 * }
 */
export const useCheckout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ input }: { input: CheckoutInput }) => processCheckout({ input }),
    onSuccess: (data) => {
      const { order, errors } = data.checkout

      if (order) {
        // Success - invalidate checkout session and cart
        queryClient.invalidateQueries({ queryKey: ['checkout', 'session'] })
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })

        addToast({
          title: 'Order placed successfully!',
          description: `Order #${order.orderNumber} has been created.`,
          variant: 'success'
        })
      } else if (errors && errors.length > 0) {
        // Show first error
        addToast({
          title: 'Checkout failed',
          description: errors[0].message,
          variant: 'error'
        })
      }
    },
    onError: (error) => {
      console.error('Checkout mutation error:', error)
      addToast({
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'error'
      })
    }
  })
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Get cart total items count from checkout session
 *
 * @example
 * const itemCount = useCartItemCount(checkoutSession)
 */
export const useCartItemCount = (checkoutSession: CheckoutSessionResponse['checkoutSession'] | undefined): number => {
  return checkoutSession?.cartDetail.cart.reduce((sum, item) => sum + item.quantity, 0) ?? 0
}

/**
 * Get cart total amount from checkout session
 *
 * @example
 * const total = useCartTotal(checkoutSession)
 */
export const useCartTotal = (checkoutSession: CheckoutSessionResponse['checkoutSession'] | undefined): number => {
  return checkoutSession?.sessionDetail.total ?? 0
}
