import { useQuery, queryOptions } from '@tanstack/react-query'
import { graphqlQueryFn } from '@lib/api/graphqlFn'
import { useState } from 'react'

/**
 * Collections GraphQL Service
 *
 * This service handles holding collections queries using GraphQL with TanStack Query.
 * It includes cursor-based pagination patterns that are easy to use in components.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface HoldingCollection {
  id: number
  name: string | null
  description: string | null
  imageUrl: string | null
  productCount: number
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export interface HoldingCollectionsConnection {
  nodes: HoldingCollection[]
  totalCount: number
  pageInfo: PageInfo
}

export interface HoldingCollectionsResponse {
  holdingCollections: HoldingCollectionsConnection
}

/**
 * Query variables for collections list
 * Uses cursor-based pagination (GraphQL standard)
 */
export interface CollectionsQueryVariables {
  first?: number // Number of items to fetch (forward pagination)
  after?: string // Cursor for forward pagination
  before?: string // Cursor for backward pagination
  last?: number // Number of items to fetch (backward pagination)
}

// ============================================================================
// GRAPHQL QUERIES
// ============================================================================

const HOLDING_COLLECTIONS_QUERY = `
  query HoldingCollections($first: Int, $after: String, $before: String, $last: Int) {
    holdingCollections(first: $first, after: $after, before: $before, last: $last) {
      nodes {
        id
        name
        description
        imageUrl
        productCount
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

// ============================================================================
// QUERY FUNCTIONS (Internal)
// ============================================================================

const getCollections = (variables: CollectionsQueryVariables = {}) =>
  graphqlQueryFn<CollectionsQueryVariables, HoldingCollectionsResponse>(HOLDING_COLLECTIONS_QUERY, variables)

// ============================================================================
// QUERY HOOKS (Public API)
// ============================================================================

/**
 * Fetch paginated collections list with cursor-based pagination
 *
 * @example Basic usage
 * const { data, isLoading } = useGetCollections({ first: 20 })
 *
 * @example With pagination
 * const { data } = useGetCollections({ first: 20, after: cursor })
 * const hasMore = data?.holdingCollections.pageInfo.hasNextPage
 * const nextCursor = data?.holdingCollections.pageInfo.endCursor
 */
export const useGetCollections = (variables: CollectionsQueryVariables = { first: 20 }) => {
  return useQuery({
    queryKey: ['collections', 'list', variables],
    queryFn: getCollections(variables)
  })
}

/**
 * Query options for collections list (useful for route prefetching)
 *
 * @example In route loader
 * loader: ({ context }) => {
 *   return context.queryClient.ensureQueryData(collectionsOptions({ first: 20 }))
 * }
 */
export const collectionsOptions = (variables: CollectionsQueryVariables = { first: 20 }) =>
  queryOptions({
    queryKey: ['collections', 'list', variables],
    queryFn: getCollections(variables)
  })

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

/**
 * Hook to simplify cursor-based pagination for collections
 * Manages pagination state and provides easy-to-use controls
 *
 * @example
 * const {
 *   data,
 *   isLoading,
 *   hasNextPage,
 *   hasPreviousPage,
 *   goToNextPage,
 *   goToPreviousPage,
 *   totalCount
 * } = useCollectionsPagination(20) // 20 items per page
 *
 * return (
 *   <div>
 *     {data?.map(collection => <CollectionCard key={collection.id} collection={collection} />)}
 *     <button onClick={goToPreviousPage} disabled={!hasPreviousPage}>Previous</button>
 *     <button onClick={goToNextPage} disabled={!hasNextPage}>Next</button>
 *   </div>
 * )
 */
export const useCollectionsPagination = (pageSize: number = 20) => {
  const [variables, setVariables] = useState<CollectionsQueryVariables>({
    first: pageSize
  })

  const query = useGetCollections(variables)

  const pageInfo = query.data?.holdingCollections.pageInfo
  const collections = query.data?.holdingCollections.nodes ?? []
  const totalCount = query.data?.holdingCollections.totalCount ?? 0

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
    data: collections,
    totalCount,
    isLoading: query.isLoading,
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
