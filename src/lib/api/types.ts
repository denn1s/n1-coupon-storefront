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
