/**
 * Query Function Builders for TanStack Query
 *
 * This module provides utility functions to build query and mutation functions
 * for TanStack Query (React Query). It handles:
 * - Authentication token injection
 * - Base URL construction
 * - Request headers
 * - Error handling
 * - Request logging (in development)
 *
 * @module lib/api/queryFn
 */

import { QueryFunctionContext } from '@tanstack/react-query'
import { authStore } from '@stores/authStore'
import { getEnv } from '@lib/helpers/env'

/**
 * Parameters for building a query function
 *
 * @template Body - The type of the request body
 */
interface QueryFnBuilderParams<Body = undefined> {
  /** HTTP method for the request */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  /** API route path (e.g., '/items' or 'items/123') */
  route: string
  /** Request body for POST/PUT/PATCH requests */
  body?: Body
  /** Additional headers to include in the request */
  headers?: Record<string, string>
  /** AbortSignal for request cancellation */
  signal?: AbortSignal | null
  /** Query parameters to append to the URL */
  queryParams?: Record<string, string | number | boolean | undefined>
}

/**
 * Type definition for a TanStack Query function
 *
 * @template Response - The expected response type
 */
type QueryFn<Response> = (context?: QueryFunctionContext) => Promise<Response>

/**
 * Builds a URL with query parameters appended
 *
 * Filters out undefined, null, and empty string values from query parameters.
 * Handles URLs that already contain query parameters by using '&' instead of '?'.
 *
 * @param baseUrl - The base URL without query parameters
 * @param queryParams - Object containing query parameters
 * @returns The complete URL with query parameters appended
 *
 * @example
 * ```typescript
 * buildUrlWithParams('https://api.example.com/items', { page: 1, search: 'foo' })
 * // Returns: 'https://api.example.com/items?page=1&search=foo'
 * ```
 */
function buildUrlWithParams(
  baseUrl: string,
  queryParams?: Record<string, string | number | boolean | undefined>
): string {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return baseUrl
  }

  const searchParams = new URLSearchParams()

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryString}` : baseUrl
}

/**
 * Safely parses a Response object as JSON
 *
 * If JSON parsing fails, logs an error and returns the raw text instead.
 * This prevents crashes when the API returns non-JSON responses.
 *
 * @param response - The Fetch API Response object
 * @returns Parsed JSON object or raw text if parsing fails
 *
 * @example
 * ```typescript
 * const data = await parseResponse(response)
 * // Returns: { id: 1, name: 'Item' } or raw text
 * ```
 */
async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch (err) {
    console.error('Failed to parse JSON response:', err)
    return text
  }
}

/**
 * Core query function builder for TanStack Query
 *
 * Creates a query function that:
 * - Constructs the full API URL from environment variables and route
 * - Injects authentication token from authStore
 * - Adds proper headers (Content-Type, Authorization)
 * - Handles request cancellation via AbortSignal
 * - Logs requests and responses in development mode
 * - Parses JSON responses safely
 * - Throws errors with status codes and response bodies
 *
 * @template Body - The type of the request body (for POST/PUT/PATCH)
 * @template Response - The expected response type
 *
 * @param params - Configuration object for the query function
 * @param params.method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param params.route - API route path (e.g., '/items' or '/items/123')
 * @param params.body - Request body for POST/PUT/PATCH requests
 * @param params.headers - Additional headers to include
 * @param params.signal - AbortSignal for request cancellation
 * @param params.queryParams - Query parameters to append to URL
 *
 * @returns A query function compatible with TanStack Query
 *
 * @throws {Error} API error with status code and response body attached
 *
 * @example
 * ```typescript
 * const queryFn = buildQueryFn<void, Item[]>({
 *   method: 'GET',
 *   route: '/items',
 *   queryParams: { page: 1, limit: 10 }
 * })
 *
 * // Use with TanStack Query
 * useQuery({ queryKey: ['items'], queryFn })
 * ```
 */
export function buildQueryFn<Body = undefined, Response = unknown>({
  method,
  route,
  body = undefined,
  headers = {},
  signal = null,
  queryParams = undefined
}: QueryFnBuilderParams<Body>): QueryFn<Response> {
  return async (context?: QueryFunctionContext) => {
    // Use signal from param if provided, else from context if available
    const abortSignal = signal ?? context?.signal ?? null

    const { accessToken } = authStore.state

    const apiHost = getEnv('API_HOST') || ''
    const apiMount = getEnv('API_MOUNT') || '' // mountpoint shouldnt end with /
    const baseUrl = `${apiHost}${apiMount}${route.startsWith('/') ? '' : '/'}${route}` // route can optionally start with /
    const apiUrl = buildUrlWithParams(baseUrl, queryParams)

    const fetchHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    }

    if (accessToken) {
      fetchHeaders['Authorization'] = `Bearer ${accessToken}`
    }

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
      signal: abortSignal ?? undefined
    }

    if (method !== 'GET' && body !== undefined) {
      fetchOptions.body = JSON.stringify(body)
    }

    if (import.meta.env.DEV) {
      console.log('[API REQUEST]', apiUrl, JSON.stringify(fetchOptions, null, 2))
    }

    const response = await fetch(apiUrl, fetchOptions)

    if (!response.ok) {
      const errorBody = await parseResponse(response)
      console.error('[API ERROR]', errorBody)
      const error = new Error(
        `API error: ${response.status} ${response.statusText} - ${
          typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody)
        }`
      )
      /* eslint-disable @typescript-eslint/no-explicit-any */
      ;(error as any).status = response.status
      ;(error as any).body = errorBody
      /* eslint-enable @typescript-eslint/no-explicit-any */
      throw error
    }

    if (import.meta.env.DEV) {
      console.log('[API RESPONSE] Ok')
    }

    return parseResponse(response) as Promise<Response>
  }
}

// ============================================================================
// HTTP Method Utility Wrappers
// ============================================================================

/**
 * Creates a GET request query function for TanStack Query
 *
 * Use with `useQuery` to fetch data from the API.
 *
 * @template Response - The expected response type
 *
 * @param route - API route path (e.g., '/items' or '/items/123')
 * @param queryParams - Optional query parameters (e.g., { page: 1, search: 'foo' })
 *
 * @returns A query function for use with `useQuery`
 *
 * @example
 * ```typescript
 * // In a service file (services/items.ts)
 * export const useGetItems = (params = {}) => {
 *   return useQuery({
 *     queryKey: ['items', 'list', params],
 *     queryFn: getFn<ItemsResponse>('/items', params)
 *   })
 * }
 * ```
 */
export function getFn<Response>(
  route: string,
  queryParams?: Record<string, string | number | boolean | undefined>
): QueryFn<Response> {
  return buildQueryFn<undefined, Response>({ method: 'GET', route, queryParams })
}

/**
 * Creates a POST request mutation function for TanStack Query
 *
 * Use with `useMutation` to create new resources.
 *
 * @template Body - The type of the request body
 * @template Response - The expected response type
 *
 * @param route - API route path (e.g., '/items')
 *
 * @returns A function that accepts a body and returns a Promise
 *
 * @example
 * ```typescript
 * // In a service file (services/items.ts)
 * export const useCreateItem = () => {
 *   return useMutation({
 *     mutationFn: postFn<CreateItemRequest, Item>('/items')
 *   })
 * }
 *
 * // In a component
 * const createMutation = useCreateItem()
 * createMutation.mutate({ name: 'New Item', description: 'Description' })
 * ```
 */
export function postFn<Body = undefined, Response = unknown>(route: string): (body?: Body) => Promise<Response> {
  return (body?: Body) => buildQueryFn<Body, Response>({ method: 'POST', route, body })()
}

/**
 * Creates a PUT request mutation function for TanStack Query
 *
 * Use with `useMutation` to replace entire resources.
 *
 * @template Body - The type of the request body
 * @template Response - The expected response type
 *
 * @param route - API route path (e.g., '/items/123')
 *
 * @returns A function that accepts a body and returns a Promise
 *
 * @example
 * ```typescript
 * // In a service file (services/items.ts)
 * export const useReplaceItem = (id: string) => {
 *   return useMutation({
 *     mutationFn: putFn<ItemRequest, Item>(`/items/${id}`)
 *   })
 * }
 * ```
 */
export function putFn<Body = undefined, Response = unknown>(route: string): (body?: Body) => Promise<Response> {
  return (body?: Body) => buildQueryFn<Body, Response>({ method: 'PUT', route, body })()
}

/**
 * Creates a DELETE request query function for TanStack Query
 *
 * Use with `useMutation` to delete resources.
 *
 * @template Response - The expected response type
 *
 * @param route - API route path (e.g., '/items/123')
 *
 * @returns A query function for use with `useMutation`
 *
 * @example
 * ```typescript
 * // In a service file (services/items.ts)
 * export const useDeleteItem = () => {
 *   return useMutation({
 *     mutationFn: ({ id }: { id: string }) => deleteFn(`/items/${id}`)()
 *   })
 * }
 * ```
 */
export function deleteFn<Response>(route: string): QueryFn<Response> {
  return buildQueryFn<undefined, Response>({ method: 'DELETE', route })
}

/**
 * Creates a PATCH request mutation function for TanStack Query
 *
 * Use with `useMutation` to partially update resources.
 * Prefer PATCH over PUT for partial updates.
 *
 * @template Body - The type of the request body (partial update data)
 * @template Response - The expected response type
 *
 * @param route - API route path (e.g., '/items/123')
 *
 * @returns A function that accepts a body and returns a Promise
 *
 * @example
 * ```typescript
 * // In a service file (services/items.ts)
 * export const useUpdateItem = (id: string) => {
 *   return useMutation({
 *     mutationFn: patchFn<UpdateItemRequest, Item>(`/items/${id}`)
 *   })
 * }
 *
 * // In a component
 * const updateMutation = useUpdateItem('123')
 * updateMutation.mutate({ name: 'Updated Name' }) // Only send changed fields
 * ```
 */
export function patchFn<Body = undefined, Response = unknown>(route: string): (body?: Body) => Promise<Response> {
  return (body?: Body) => buildQueryFn<Body, Response>({ method: 'PATCH', route, body })()
}
