import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import { graphqlQueryFn, graphqlMutationFn } from '@lib/api/graphqlFn'
import { CheckoutSessionResponse, CheckoutInput, CheckoutResponse } from '@lib/api/types'
import { addToast } from '@lib/toasts'

/**
 * Checkout GraphQL Service
 *
 * This service provides hooks for managing checkout sessions and processing orders.
 */

// ============================================================================
// GRAPHQL QUERIES
// ============================================================================

const CHECKOUT_SESSION_QUERY = `
  query checkoutSession {
    checkoutSession {
      id
      status
      cart {
        id
        items {
          id
          productId
          variantId
          quantity
          price
          subtotal
        }
        subtotal
        tax
        shipping
        total
      }
      buyer {
        id
        email
        firstName
        lastName
        phone
      }
      shippingAddress {
        street
        city
        state
        postalCode
        country
      }
      billingAddress {
        street
        city
        state
        postalCode
        country
      }
      paymentMethod {
        type
        last4
      }
      shipmentOptions {
        id
        name
        price
        estimatedDays
      }
    }
  }
`

// ============================================================================
// GRAPHQL MUTATIONS
// ============================================================================

const CHECKOUT_MUTATION = `
  mutation checkout($input: CheckoutInput!) {
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

const getCheckoutSession = () => graphqlQueryFn<undefined, CheckoutSessionResponse>(CHECKOUT_SESSION_QUERY, undefined)

const processCheckout = graphqlMutationFn<CheckoutInput, CheckoutResponse>(CHECKOUT_MUTATION)

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch the current checkout session
 *
 * @example
 * const { data, isLoading } = useGetCheckoutSession()
 * const session = data?.checkoutSession
 */
export const useGetCheckoutSession = () => {
  return useQuery({
    queryKey: ['checkout', 'session'],
    queryFn: getCheckoutSession(),
    staleTime: 1 * 60 * 1000 // 1 minute cache
  })
}

/**
 * Query options for checkout session (useful for route prefetching)
 */
export const checkoutSessionOptions = () =>
  queryOptions({
    queryKey: ['checkout', 'session'],
    queryFn: getCheckoutSession(),
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
 *     checkoutSessionId: 'session_123',
 *     paymentMethodId: 'pm_card_visa',
 *     shippingAddressId: 'addr_123',
 *     billingAddressId: 'addr_123',
 *     shipmentOptionId: 'ship_standard'
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
    mutationFn: processCheckout,
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
 * const itemCount = useCartItemCount()
 */
export const useCartItemCount = (): number => {
  const { data } = useGetCheckoutSession()
  return data?.checkoutSession?.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
}

/**
 * Get cart total amount from checkout session
 *
 * @example
 * const total = useCartTotal()
 */
export const useCartTotal = (): number => {
  const { data } = useGetCheckoutSession()
  return data?.checkoutSession?.cart?.total ?? 0
}
