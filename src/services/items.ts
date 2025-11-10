/**
 * Items Service - Example CRUD Service
 *
 * This is an example service demonstrating complete CRUD operations with TanStack Query.
 * It serves as a template for creating your own resource services.
 *
 * ## Features
 * - Fetch paginated lists with search and sorting
 * - Fetch individual items
 * - Create new items
 * - Update existing items (partial updates with PATCH)
 * - Delete items
 * - Automatic query invalidation on mutations
 * - Prefetching support with queryOptions
 *
 * ## Usage Pattern
 * Replace "items" with your actual resource name (e.g., users, products, posts).
 * Update the types and API endpoints to match your backend API.
 *
 * @module services/items
 * @example
 * ```typescript
 * // In a component
 * import { useGetItems, useCreateItem } from '@services/items'
 *
 * function ItemsList() {
 *   const { data, isLoading } = useGetItems({ page: 1, pageSize: 10 })
 *   const createMutation = useCreateItem()
 *
 *   const handleCreate = () => {
 *     createMutation.mutate({ name: 'New Item', description: 'Description' })
 *   }
 *
 *   if (isLoading) return <div>Loading...</div>
 *   return (
 *     <div>
 *       {data?.items.map(item => <div key={item.id}>{item.name}</div>)}
 *       <button onClick={handleCreate}>Create Item</button>
 *     </div>
 *   )
 * }
 * ```
 */

import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import { getFn, postFn, patchFn, deleteFn } from '@lib/api/queryFn'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Item resource type
 *
 * Replace this with your actual API resource type.
 */
export interface Item {
  /** Unique identifier for the item */
  id: string
  /** Display name of the item */
  name: string
  /** Description of the item */
  description: string
  /** ISO 8601 timestamp of when the item was created */
  createdAt: string
  /** ISO 8601 timestamp of when the item was last updated */
  updatedAt: string
}

/**
 * Paginated response structure for items list
 */
export interface ItemsResponse {
  /** Array of item objects */
  items: Item[]
  /** Total number of items across all pages */
  totalCount: number
  /** Current page number (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
}

/**
 * Request body for creating a new item
 */
export interface CreateItemRequest {
  /** Name of the new item */
  name: string
  /** Description of the new item */
  description: string
}

/**
 * Request body for updating an item (partial update)
 */
export interface UpdateItemRequest {
  /** Optional new name for the item */
  name?: string
  /** Optional new description for the item */
  description?: string
}

/**
 * Query parameters for fetching items list
 */
export interface ItemsQueryParams {
  /** Page number (1-indexed) */
  page?: number
  /** Number of items per page */
  pageSize?: number
  /** Search query string */
  search?: string
  /** Sort field and order (e.g., 'name' or '-createdAt' for descending) */
  sortBy?: string
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Fetch paginated list of items
 */
const getItems = (params: ItemsQueryParams = {}) =>
  getFn<ItemsResponse>('/items', {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    search: params.search,
    sortBy: params.sortBy || '-createdAt'
  })

/**
 * Fetch single item by ID
 */
const getItem = (id: string) => getFn<Item>(`/items/${id}`)

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetches a paginated list of items with optional filtering and sorting
 *
 * This hook automatically handles:
 * - Caching based on query parameters
 * - Background refetching
 * - Loading and error states
 * - Request deduplication
 *
 * @param params - Query parameters for pagination, search, and sorting
 * @returns TanStack Query result object with data, loading state, and error
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { data, isLoading, error } = useGetItems()
 *
 * // With pagination
 * const { data } = useGetItems({ page: 2, pageSize: 20 })
 *
 * // With search
 * const { data } = useGetItems({ search: 'keyword', page: 1 })
 *
 * // With sorting
 * const { data } = useGetItems({ sortBy: '-createdAt' }) // descending
 * ```
 */
export const useGetItems = (params: ItemsQueryParams = {}) => {
  return useQuery({
    queryKey: ['items', 'list', params],
    queryFn: getItems(params)
  })
}

/**
 * Query options for items list (useful for prefetching)
 *
 * Use this with queryClient.prefetchQuery() to fetch data before a component renders.
 *
 * @param params - Query parameters for pagination, search, and sorting
 * @returns Query options object compatible with TanStack Query
 *
 * @example
 * ```typescript
 * // In a route loader or parent component
 * const queryClient = useQueryClient()
 * await queryClient.prefetchQuery(itemsOptions({ page: 1 }))
 * ```
 */
export const itemsOptions = (params: ItemsQueryParams = {}) =>
  queryOptions({
    queryKey: ['items', 'list', params],
    queryFn: getItems(params)
  })

/**
 * Fetches a single item by ID
 *
 * The query is automatically disabled if no ID is provided.
 *
 * @param id - The unique identifier of the item to fetch
 * @returns TanStack Query result object with item data, loading state, and error
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { data: item, isLoading, error } = useGetItem(itemId)
 *
 * // Conditional rendering
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error: {error.message}</div>
 * return <div>{item.name}</div>
 * ```
 */
export const useGetItem = (id: string) => {
  return useQuery({
    queryKey: ['items', 'detail', id],
    queryFn: getItem(id),
    enabled: !!id
  })
}

/**
 * Query options for a single item (useful for prefetching)
 *
 * Use this with queryClient.prefetchQuery() to fetch item data before rendering.
 *
 * @param id - The unique identifier of the item to prefetch
 * @returns Query options object compatible with TanStack Query
 *
 * @example
 * ```typescript
 * // Prefetch item on hover
 * const handleMouseEnter = async () => {
 *   await queryClient.prefetchQuery(itemOptions(itemId))
 * }
 * ```
 */
export const itemOptions = (id: string) =>
  queryOptions({
    queryKey: ['items', 'detail', id],
    queryFn: getItem(id)
  })

// ============================================================================
// MUTATION FUNCTIONS
// ============================================================================

const createItem = postFn<CreateItemRequest, Item>('/items')
const updateItem = (id: string) => patchFn<UpdateItemRequest, Item>(`/items/${id}`)
const deleteItem = (id: string) => deleteFn(`/items/${id}`)

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Creates a new item
 *
 * Automatically invalidates the items list query on success,
 * triggering a refetch to include the newly created item.
 *
 * @returns TanStack Query mutation object with mutate, isPending, and error
 *
 * @example
 * ```typescript
 * const createMutation = useCreateItem()
 *
 * const handleSubmit = (formData) => {
 *   createMutation.mutate({
 *     name: formData.name,
 *     description: formData.description
 *   }, {
 *     onSuccess: (newItem) => {
 *       console.log('Created:', newItem)
 *       navigate(`/items/${newItem.id}`)
 *     },
 *     onError: (error) => {
 *       console.error('Failed to create:', error)
 *     }
 *   })
 * }
 *
 * return (
 *   <button
 *     onClick={handleSubmit}
 *     disabled={createMutation.isPending}
 *   >
 *     {createMutation.isPending ? 'Creating...' : 'Create Item'}
 *   </button>
 * )
 * ```
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      // Invalidate list queries to refetch with new item
      queryClient.invalidateQueries({ queryKey: ['items', 'list'] })
    }
  })
}

/**
 * Updates an existing item (partial update with PATCH)
 *
 * Automatically invalidates both the items list and the specific item query on success,
 * triggering refetches to reflect the updated data.
 *
 * @param id - The unique identifier of the item to update
 * @returns TanStack Query mutation object with mutate, isPending, and error
 *
 * @example
 * ```typescript
 * const updateMutation = useUpdateItem(itemId)
 *
 * const handleUpdate = () => {
 *   updateMutation.mutate({
 *     name: 'Updated Name'
 *     // Only include fields you want to update
 *   }, {
 *     onSuccess: (updatedItem) => {
 *       console.log('Updated:', updatedItem)
 *     }
 *   })
 * }
 *
 * return (
 *   <button
 *     onClick={handleUpdate}
 *     disabled={updateMutation.isPending}
 *   >
 *     {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
 *   </button>
 * )
 * ```
 */
export const useUpdateItem = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateItem(id),
    onSuccess: () => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: ['items', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['items', 'detail', id] })
    }
  })
}

/**
 * Deletes an item
 *
 * Automatically invalidates the items list query and removes the deleted item
 * from the cache on success.
 *
 * @param id - The unique identifier of the item to delete
 * @returns TanStack Query mutation object with mutate, isPending, and error
 *
 * @example
 * ```typescript
 * const deleteMutation = useDeleteItem(itemId)
 *
 * const handleDelete = () => {
 *   if (confirm('Are you sure you want to delete this item?')) {
 *     deleteMutation.mutate(undefined, {
 *       onSuccess: () => {
 *         console.log('Item deleted')
 *         navigate('/items')
 *       },
 *       onError: (error) => {
 *         console.error('Failed to delete:', error)
 *       }
 *     })
 *   }
 * }
 *
 * return (
 *   <button
 *     onClick={handleDelete}
 *     disabled={deleteMutation.isPending}
 *   >
 *     {deleteMutation.isPending ? 'Deleting...' : 'Delete Item'}
 *   </button>
 * )
 * ```
 */
export const useDeleteItem = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteItem(id),
    onSuccess: () => {
      // Invalidate list queries and remove the deleted item from cache
      queryClient.invalidateQueries({ queryKey: ['items', 'list'] })
      queryClient.removeQueries({ queryKey: ['items', 'detail', id] })
    }
  })
}
