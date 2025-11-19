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
// Orders Types (Extended)
// ============================================================================

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'FINALIZED'
  | 'CANCELLED'
  | 'REFUNDED'

export type ShipmentStatus = 'PENDING' | 'READY_FOR_PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'

export type ShipmentOptionType = 'PICKUP' | 'DELIVERY' | 'DINE_IN'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export type CouponStatus = 'APPLIED' | 'PENDING' | 'REDEEMED' | 'EXPIRED'

/**
 * Product metadata key-value pair
 */
export interface ProductMetadata {
  key: string
  value: string
}

/**
 * Order item modifier option
 */
export interface ModifierSelectedOption {
  selectedOptionId: string
  name: string
  amount: number
}

/**
 * Order item modifier
 */
export interface OrderModifier {
  modifierId: string
  name: string
  selectedOptionsTotal: number
  selectedOptions: ModifierSelectedOption[]
}

/**
 * Order detail item (from list endpoint)
 */
export interface OrderDetailItem {
  itemId: string
  name: string
  description?: string
  price: number
  promoPrice?: number
  productImageUrl?: string
  requiresShipping: boolean
  productMetadata?: ProductMetadata[]
  quantity: number
  subTotal: number
  modifiers?: OrderModifier[]
  note?: string
  modifiersTotal?: number
  sKU?: string
  promoId?: string
}

/**
 * Discount effect
 */
export interface DiscountEffect {
  id: string
  name: string
  amount: number
}

/**
 * Surcharge effect
 */
export interface SurchargeEffect {
  id: string
  name: string
  amount: number
}

/**
 * Geographic coordinates
 */
export interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Address with coordinates
 */
export interface ShipmentAddress {
  name: string
  address: string
  coordinates?: Coordinates
  phone?: string
}

/**
 * Shipment history entry
 */
export interface ShipmentHistoryEntry {
  shipmentStatus: string
  entry: string
  created: string
  entryStatus: string
}

/**
 * Delivery driver information
 */
export interface Driver {
  id: string
  name: string
  phone: string
  licensePlate: string
  avatar?: string
}

/**
 * Order shipment details
 */
export interface OrderShipment {
  shipmentOptionType: ShipmentOptionType
  originAddress?: ShipmentAddress
  destinationAddress?: ShipmentAddress | null
  history?: ShipmentHistoryEntry[]
  estimatedTimeOfArrival?: string | null
  trackingLinkUrl?: string | null
  driver?: Driver | null
}

/**
 * Store information
 */
export interface OrderStore {
  id: string
  name: string
  imageUrl?: string
  bannerUrl?: string
  bannerColor?: string
  currencySymbol: string
  currencyCode: string
  locale: string
  timezone: string
}

/**
 * Payment method details
 */
export interface PaymentMethod {
  cardholderName?: string
  lastDigits?: string
  firstDigits?: string
  type: string
  cardName?: string
}

/**
 * Order payment information
 */
export interface OrderPayment {
  status: PaymentStatus
  paymentOptionType: string
  paymentMethod?: PaymentMethod
  creditsChargeAmount?: number
}

/**
 * Order list item (from GetAll endpoint)
 */
export interface OrderListItem {
  orderId: string
  name: string
  orderDate: string
  orderType: string
  orderStatus: OrderStatus
  storeId: string
  storeName: string
  storeImageUrl?: string
  storeBannerUrl?: string
  storeBannerColor?: string
  timezone: string
  locale: string
  currencyCode: string
  currencySymbol: string
  totalFormatted: string
  subTotal: number
  totalDiscount: number
  totalSurcharge: number
  total: number
  paymentDate?: string
  paymentOption?: string
  shipmentOption?: string
  shipmentType?: string
  shipmentStatus?: string
  requiresShipping: boolean
  orderDetails: OrderDetailItem[]
  couponStatus?: CouponStatus
}

/**
 * Order detail view (from Get endpoint)
 */
export interface OrderDetail {
  id: number
  status: OrderStatus
  subTotal: number
  discountEffects?: DiscountEffect[]
  surchargeEffects?: SurchargeEffect[]
  deliveryCost: number
  driverTip: number
  totalDiscount: number
  totalSurcharge: number
  total: number
  created: string
  checkoutNote?: string
  store: OrderStore
  shipment?: OrderShipment
  orderDetails: OrderDetailItem[]
  payment: OrderPayment
}

/**
 * Coupon from order
 */
export interface OrderCoupon {
  code: string
  qrCodeUrl: string
  endDate: string
}

/**
 * Orders list response (with pagination)
 */
export interface OrdersListResponse {
  orders: {
    nodes: OrderListItem[]
    totalCount: number
    pageInfo: PageInfo
  }
}

/**
 * Order detail response
 */
export interface OrderDetailResponse {
  orderView: OrderDetail
  coupon?: OrderCoupon | null
}

// ============================================================================
// Coupon/Purchase Types (Legacy - for CheckoutModal)
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
