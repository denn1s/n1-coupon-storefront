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
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

/**
 * Generic GraphQL connection response
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
 */
export interface ProductImage {
  sequence: number
  url: string
}

/**
 * Holding Product (Coupon/Deal)
 */
export interface HoldingProduct {
  id: number
  name: string
  description: string
  salePrice: number
  productImageUrl: string
  quantityAvailable: number
  images: ProductImage[]
}

/**
 * Holding Business Category
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
 */
export interface HoldingStore {
  id: number
  name: string
  description: string
  storeImageUrl: string
}

/**
 * Holding Collection
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
