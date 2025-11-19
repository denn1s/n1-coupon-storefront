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
 * Matches the actual API response from APIDOCS.md
 */
export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

/**
 * Standard GraphQL connection response with nodes
 * This is the pattern used by the actual API (not edges)
 */
export interface GraphQLConnection<T> {
  nodes: T[]
  totalCount: number
  pageInfo: PageInfo
}

// ============================================================================
// Holding (Groupon-like) Types
// ============================================================================

/**
 * Product image
 * Matches APIDOCS.md structure
 */
export interface ProductImage {
  sequence: number
  url: string
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
 * Matches APIDOCS.md structure exactly
 */
export interface HoldingProduct {
  id: number
  name: string
  description: string | null
  salePrice: number
  productImageUrl: string | null
  quantityAvailable: number
  images: ProductImage[]
}

/**
 * Holding Business Category
 * Matches APIDOCS.md structure exactly
 */
export interface HoldingBusinessCategory {
  id: number
  name: string
  description: string
  bannerImageUrl: string | null
  smallBannerImageUrl: string | null
  storeCount: number
}

/**
 * Holding Store
 * Matches APIDOCS.md structure exactly
 */
export interface HoldingStore {
  id: number
  name: string
  description: string | null
  storeImageUrl: string | null
}

/**
 * Holding Collection
 * Matches APIDOCS.md structure exactly
 */
export interface HoldingCollection {
  id: number
  name: string
  description: string
  bannerImageUrl: string | null
  smallBannerImageUrl: string | null
  productCount: number
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
// Checkout & Cart Types (Based on APIDOCS.md)
// ============================================================================

/**
 * Product metadata in cart
 */
export interface CartProductMetadata {
  key: string
  value: string
}

/**
 * Cart item from checkout session
 * Matches APIDOCS.md GetCheckoutSession response
 */
export interface CartItem {
  productId: number
  name: string
  productImageUrl: string | null
  price: number
  promoPrice: number | null
  salePrice: number
  quantity: number
  requiresShipping: boolean
  productMetadata: CartProductMetadata[] | null
}

/**
 * Cart detail from checkout session
 */
export interface CartDetail {
  storeId: number
  locationId: number
  cart: CartItem[]
  savedTotal: number
  total: number
}

/**
 * Store location
 */
export interface StoreLocation {
  id: number
  name: string
  isDefault: boolean
}

/**
 * Store information in checkout session
 */
export interface CheckoutStore {
  id: number
  name: string
  locations: StoreLocation[]
}

/**
 * Payment option
 */
export interface PaymentOption {
  id: number
  name: string
  paymentOptionType: string
}

/**
 * Shipment option
 */
export interface ShipmentOption {
  id: number
  name: string
  baseCost: number
  shipmentOptionType: string
}

/**
 * Geographic location/coordinates
 */
export interface Location {
  latitude: number
  longitude: number
}

/**
 * Buyer address
 */
export interface BuyerAddress {
  id: number
  name: string
  address: string
  addressLine2: string | null
  location: Location
  reference: string | null
  phone: string | null
  note: string | null
}

/**
 * Buyer payment method
 */
export interface BuyerPaymentMethod {
  id: number
  name: string
  number: string
  cardCustomName: string | null
  cardCustomColor: string | null
  type: string
  isTokenized: boolean
}

/**
 * Buyer information (only present in authenticated sessions)
 */
export interface CheckoutBuyer {
  id: string
  name: string
  email: string
  phone: string
  addresses: BuyerAddress[]
  paymentMethods: BuyerPaymentMethod[]
}

/**
 * Session detail with pricing breakdown
 */
export interface SessionDetail {
  subTotal: number
  totalSurcharge: number
  totalDiscount: number
  deliveryCost: number
  total: number
}

/**
 * Checkout session (matches APIDOCS.md structure)
 */
export interface CheckoutSession {
  customerSessionId: number
  cartDetail: CartDetail
  store: CheckoutStore
  paymentOptions: PaymentOption[]
  shipmentOptions: ShipmentOption[]
  buyer: CheckoutBuyer | null
  sessionDetail: SessionDetail
}

/**
 * Checkout session response
 */
export interface CheckoutSessionResponse {
  checkoutSession: CheckoutSession
}

/**
 * Checkout input for creating a session
 */
export interface CheckoutSessionInput {
  storeId: number
  cart: {
    productId: number
    quantity: number
  }
}

/**
 * Checkout error
 */
export interface CheckoutError {
  field: string
  message: string
}

/**
 * Order creation response
 */
export interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
}

/**
 * Checkout mutation input (for processing checkout)
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
