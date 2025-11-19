/**
 * API Type Definitions
 *
 * This file contains TypeScript types for API requests and responses.
 * Add your own types here as you build your application.
 */

// ============================================================================
// Common Utility Types
// ============================================================================

/**
 * Query parameters for pagination, sorting, and filtering
 * Compatible with Sieve query pattern
 */
export interface SieveQueryParams {
  page?: number
  pageSize?: number
  sorts?: string
  filters?: string
  search?: string
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  currentPage: number
  pageSize: number
  totalPages: number
}

// ============================================================================
// User & Auth Types
// ============================================================================

export interface User {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  nickname?: string
  picture?: string
  updated_at?: string
  [key: string]: unknown // Allow for custom claims
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  token: string | null
  error: Error | null
}

// ============================================================================
// Example Types (Replace with your own)
// ============================================================================

/**
 * Example: Item resource
 * Replace this with your own resource types
 */
export interface Item {
  id: string
  name: string
  description: string
  status?: 'active' | 'inactive' | 'archived'
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export interface CreateItemRequest {
  name: string
  description: string
  status?: 'active' | 'inactive'
  metadata?: Record<string, unknown>
}

export interface UpdateItemRequest {
  name?: string
  description?: string
  status?: 'active' | 'inactive' | 'archived'
  metadata?: Record<string, unknown>
}

export type ItemsResponse = PaginatedResponse<Item>

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: unknown
}

export interface ValidationError extends ApiError {
  errors: Record<string, string[]>
}

// ============================================================================
// GraphQL Pagination Types
// ============================================================================

/**
 * GraphQL cursor-based pagination info
 */
export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage?: boolean
  startCursor?: string | null
  endCursor: string | null
}

/**
 * GraphQL edge wrapper
 */
export interface GraphQLEdge<T> {
  node: T
  cursor: string
}

/**
 * Generic GraphQL connection response with edges
 */
export interface GraphQLConnection<T> {
  edges: GraphQLEdge<T>[]
  pageInfo: PageInfo
}

/**
 * Legacy GraphQL connection with nodes (for backward compatibility)
 */
export interface GraphQLConnectionWithNodes<T> {
  nodes: T[]
  totalCount?: number
  pageInfo: PageInfo
}

// ============================================================================
// Holding (Groupon-like) Types
// ============================================================================

/**
 * Product image
 */
export interface ProductImage {
  url: string
  altText?: string | null
  // Legacy field for backward compatibility
  sequence?: number
}

/**
 * Product variant
 */
export interface ProductVariant {
  id: string
  name: string
  price: number
  sku: string
}

/**
 * Holding Product (Coupon/Deal)
 */
export interface HoldingProduct {
  id: number | string
  name: string
  slug?: string
  description: string | null
  price?: number
  salePrice?: number // Legacy field, maps to price
  compareAtPrice?: number | null
  imageUrl?: string | null
  productImageUrl?: string | null // Legacy field, maps to imageUrl
  quantityAvailable?: number // Legacy field
  images: ProductImage[]
  variants?: ProductVariant[]
}

/**
 * Holding Business Category
 */
export interface HoldingBusinessCategory {
  id: number | string
  name: string
  slug?: string
  imageUrl?: string | null
  description?: string // Legacy field
  bannerImageUrl?: string | null // Legacy field
  smallBannerImageUrl?: string | null // Legacy field
  storeCount?: number // Legacy field
}

/**
 * Holding Store
 */
export interface HoldingStore {
  id: number | string
  name: string
  slug?: string
  description: string | null
  logoUrl?: string | null
  bannerUrl?: string | null
  storeImageUrl?: string | null // Legacy field
}

/**
 * Holding Collection
 */
export interface HoldingCollection {
  id: number | string
  name: string
  slug?: string
  description: string | null
  imageUrl?: string | null
  bannerImageUrl?: string | null // Legacy field
  smallBannerImageUrl?: string | null // Legacy field
  productCount?: number // Legacy field
}

// ============================================================================
// GraphQL Response Types
// ============================================================================

export interface HoldingProductsResponse {
  holdingProducts: GraphQLConnection<HoldingProduct>
}

export interface HoldingBusinessCategoriesResponse {
  holdingBusinessCategories: GraphQLConnection<HoldingBusinessCategory>
}

export interface HoldingStoresResponse {
  holdingStores: GraphQLConnection<HoldingStore>
}

export interface HoldingCollectionsResponse {
  holdingCollections: GraphQLConnection<HoldingCollection>
}

// ============================================================================
// GraphQL Variables Types
// ============================================================================

export interface PaginationVariables {
  first?: number
  after?: string
  last?: number
  before?: string
}

// ============================================================================
// Checkout & Cart Types
// ============================================================================

/**
 * Cart item
 */
export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  subtotal: number
}

/**
 * Shopping cart
 */
export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
}

/**
 * Buyer information
 */
export interface Buyer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
}

/**
 * Address (shipping or billing)
 */
export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

/**
 * Payment method
 */
export interface PaymentMethod {
  type: string
  last4: string
}

/**
 * Shipment option
 */
export interface ShipmentOption {
  id: string
  name: string
  price: number
  estimatedDays: number
}

/**
 * Checkout session
 */
export interface CheckoutSession {
  id: string
  status: string
  cart: Cart
  buyer?: Buyer | null
  shippingAddress?: Address | null
  billingAddress?: Address | null
  paymentMethod?: PaymentMethod | null
  shipmentOptions: ShipmentOption[]
}

/**
 * Checkout session response
 */
export interface CheckoutSessionResponse {
  checkoutSession: CheckoutSession
}

/**
 * Order
 */
export interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
}

/**
 * Checkout error
 */
export interface CheckoutError {
  field: string
  message: string
}

/**
 * Checkout input
 */
export interface CheckoutInput {
  checkoutSessionId: string
  paymentMethodId: string
  shippingAddressId: string
  billingAddressId: string
  shipmentOptionId: string
}

/**
 * Checkout mutation response
 */
export interface CheckoutResponse {
  checkout: {
    order: Order | null
    errors: CheckoutError[]
  }
}

// ============================================================================
// Coupon/Purchase Types (for future use)
// ============================================================================

export interface Coupon {
  id: string
  productId: number
  productName: string
  productImage: string
  purchaseDate: string
  qrCode: string
  price: number
  status: 'active' | 'redeemed' | 'expired'
}
