import { useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { graphqlQueryFn } from '@lib/api/graphqlFn'
import {
  HoldingProduct,
  HoldingProductsResponse,
  HoldingBusinessCategoriesResponse,
  HoldingStoresResponse,
  HoldingCollectionsResponse,
  PaginationVariables
} from '@lib/api/types'
import { useState } from 'react'

/**
 * Holding GraphQL Service
 *
 * This service provides hooks for fetching products (coupons/deals),
 * business categories, stores, and collections for a Groupon-like application.
 */

// ============================================================================
// GRAPHQL QUERIES
// ============================================================================

const HOLDING_PRODUCTS_QUERY = `
  query HoldingProducts($first: Int, $after: String, $before: String, $last: Int) {
    holdingProducts(first: $first, after: $after, before: $before, last: $last) {
      edges {
        node {
          id
          name
          slug
          description
          price
          compareAtPrice
          imageUrl
          images {
            url
            altText
          }
          variants {
            id
            name
            price
            sku
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const HOLDING_BUSINESS_CATEGORIES_QUERY = `
  query HoldingBusinessCategories($first: Int, $after: String) {
    holdingBusinessCategories(first: $first, after: $after) {
      edges {
        node {
          id
          name
          slug
          imageUrl
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const HOLDING_STORES_QUERY = `
  query HoldingStores($first: Int, $after: String) {
    holdingStores(first: $first, after: $after) {
      edges {
        node {
          id
          name
          slug
          description
          logoUrl
          bannerUrl
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const HOLDING_COLLECTIONS_QUERY = `
  query HoldingCollections($first: Int, $after: String) {
    holdingCollections(first: $first, after: $after) {
      edges {
        node {
          id
          name
          slug
          description
          imageUrl
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

// ============================================================================
// HELPER FUNCTIONS - Transform edges to nodes for backward compatibility
// ============================================================================

/**
 * Transform GraphQL edges structure to nodes array
 * Maintains backward compatibility with existing code
 */
function edgesToNodes<T>(edges: Array<{ node: T; cursor: string }>): T[] {
  return edges.map((edge) => edge.node)
}

/**
 * Transform API product to include legacy fields
 */
function transformProduct(product: Partial<HoldingProduct>): HoldingProduct {
  return {
    ...product,
    id: product.id!,
    name: product.name!,
    description: product.description ?? '',
    images: product.images || [],
    // Map new fields to legacy fields for backward compatibility
    salePrice: product.price || product.salePrice || 0,
    productImageUrl: product.imageUrl || product.productImageUrl || '',
    quantityAvailable: product.quantityAvailable || 0
  } as HoldingProduct
}

// ============================================================================
// QUERY FUNCTIONS (Internal)
// ============================================================================

const getProducts = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, HoldingProductsResponse>(HOLDING_PRODUCTS_QUERY, variables)

const getCategories = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, HoldingBusinessCategoriesResponse>(HOLDING_BUSINESS_CATEGORIES_QUERY, variables)

const getStores = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, HoldingStoresResponse>(HOLDING_STORES_QUERY, variables)

const getCollections = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, HoldingCollectionsResponse>(HOLDING_COLLECTIONS_QUERY, variables)

// ============================================================================
// PRODUCTS HOOKS
// ============================================================================

/**
 * Fetch paginated products list with cursor-based pagination
 *
 * @example Basic usage
 * const { data, isLoading } = useGetProducts({ first: 20 })
 */
export const useGetProducts = (variables: PaginationVariables = { first: 20 }) => {
  return useQuery({
    queryKey: ['holding', 'products', 'list', variables],
    queryFn: getProducts(variables)
  })
}

/**
 * Query options for products list (useful for route prefetching)
 */
export const productsOptions = (variables: PaginationVariables = { first: 20 }) =>
  queryOptions({
    queryKey: ['holding', 'products', 'list', variables],
    queryFn: getProducts(variables),
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  })

/**
 * Hook to simplify cursor-based pagination for products
 * Includes client-side search and filtering
 *
 * @example
 * const {
 *   data,
 *   isLoading,
 *   hasNextPage,
 *   goToNextPage,
 *   searchTerm,
 *   setSearchTerm,
 *   selectedCategory,
 *   setSelectedCategory,
 *   selectedStore,
 *   setSelectedStore
 * } = useProductsPagination(20, { initialData: loaderData?.products, staleTime: 5 * 60 * 1000 })
 */
export const useProductsPagination = (
  pageSize: number = 20,
  queryOptions?: { initialData?: HoldingProductsResponse; staleTime?: number }
) => {
  const queryClient = useQueryClient()
  const [variables, setVariables] = useState<PaginationVariables>({
    first: pageSize
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedStore, setSelectedStore] = useState<number | null>(null)

  // Only use initialData if variables match the initial page (no pagination cursors)
  const isInitialPage = !variables.after && !variables.before && variables.first === pageSize

  const query = useQuery({
    queryKey: ['holding', 'products', 'list', variables],
    queryFn: getProducts(variables),
    initialData: isInitialPage ? queryOptions?.initialData : undefined,
    staleTime: queryOptions?.staleTime ?? 5 * 60 * 1000
  })

  const pageInfo = query.data?.holdingProducts.pageInfo
  // Transform edges to nodes for backward compatibility
  const edges = query.data?.holdingProducts.edges ?? []
  const allProducts = edgesToNodes(edges).map(transformProduct)
  const totalCount = allProducts.length // totalCount not available in new API

  // Client-side filtering (since API doesn't support filters yet)
  const filteredProducts = allProducts.filter((product) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        (product.description ?? '').toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    // Note: Category and store filters would need API support
    // or additional product fields to work properly
    // For now, we're just setting up the state management

    return true
  })

  const goToNextPage = () => {
    if (pageInfo?.hasNextPage && pageInfo.endCursor) {
      setVariables({
        first: pageSize,
        after: pageInfo.endCursor
      })
    }
  }

  // Prefetch next page for instant navigation
  const prefetchNextPage = () => {
    if (pageInfo?.hasNextPage && pageInfo.endCursor) {
      const nextVariables = {
        first: pageSize,
        after: pageInfo.endCursor
      }
      // Prefetch the next page data
      queryClient.prefetchQuery({
        queryKey: ['holding', 'products', 'list', nextVariables],
        queryFn: getProducts(nextVariables),
        staleTime: queryOptions?.staleTime ?? 5 * 60 * 1000
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

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory(null)
    setSelectedStore(null)
    resetPagination()
  }

  return {
    // Data
    data: filteredProducts,
    allData: allProducts,
    totalCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    // Pagination state
    hasNextPage: pageInfo?.hasNextPage ?? false,
    hasPreviousPage: pageInfo?.hasPreviousPage ?? false,

    // Pagination controls
    goToNextPage,
    goToPreviousPage,
    resetPagination,
    prefetchNextPage,

    // Search and filter state
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStore,
    setSelectedStore,
    resetFilters,

    // Advanced
    pageInfo,
    refetch: query.refetch
  }
}

// ============================================================================
// CATEGORIES HOOKS
// ============================================================================

/**
 * Fetch business categories
 *
 * @example
 * const { data, isLoading } = useGetCategories({ first: 50 }, { initialData: loaderData?.categories })
 */
export const useGetCategories = (
  variables: PaginationVariables = { first: 50 },
  options?: { initialData?: HoldingBusinessCategoriesResponse; staleTime?: number }
) => {
  return useQuery({
    queryKey: ['holding', 'categories', 'list', variables],
    queryFn: getCategories(variables),
    // Transform edges to nodes for backward compatibility
    select: (data) => ({
      nodes: edgesToNodes(data.holdingBusinessCategories.edges),
      pageInfo: data.holdingBusinessCategories.pageInfo
    }),
    initialData: options?.initialData,
    staleTime: options?.staleTime ?? 5 * 60 * 1000
  })
}

/**
 * Query options for categories (useful for route prefetching)
 */
export const categoriesOptions = (variables: PaginationVariables = { first: 50 }) =>
  queryOptions({
    queryKey: ['holding', 'categories', 'list', variables],
    queryFn: getCategories(variables),
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  })

// ============================================================================
// STORES HOOKS
// ============================================================================

/**
 * Fetch stores
 *
 * @example
 * const { data, isLoading } = useGetStores({ first: 50 }, { initialData: loaderData?.stores })
 */
export const useGetStores = (
  variables: PaginationVariables = { first: 50 },
  options?: { initialData?: HoldingStoresResponse; staleTime?: number }
) => {
  return useQuery({
    queryKey: ['holding', 'stores', 'list', variables],
    queryFn: getStores(variables),
    // Transform edges to nodes for backward compatibility
    select: (data) => ({
      nodes: edgesToNodes(data.holdingStores.edges),
      pageInfo: data.holdingStores.pageInfo
    }),
    initialData: options?.initialData,
    staleTime: options?.staleTime ?? 5 * 60 * 1000
  })
}

/**
 * Query options for stores (useful for route prefetching)
 */
export const storesOptions = (variables: PaginationVariables = { first: 50 }) =>
  queryOptions({
    queryKey: ['holding', 'stores', 'list', variables],
    queryFn: getStores(variables),
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  })

// ============================================================================
// COLLECTIONS HOOKS
// ============================================================================

/**
 * Fetch collections
 *
 * @example
 * const { data, isLoading } = useGetCollections()
 */
export const useGetCollections = (variables: PaginationVariables = { first: 50 }) => {
  return useQuery({
    queryKey: ['holding', 'collections', 'list', variables],
    queryFn: getCollections(variables),
    // Transform edges to nodes for backward compatibility
    select: (data) => ({
      nodes: edgesToNodes(data.holdingCollections.edges),
      pageInfo: data.holdingCollections.pageInfo
    })
  })
}

/**
 * Query options for collections (useful for route prefetching)
 */
export const collectionsOptions = (variables: PaginationVariables = { first: 50 }) =>
  queryOptions({
    queryKey: ['holding', 'collections', 'list', variables],
    queryFn: getCollections(variables)
  })

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Find a specific product by ID from the products list
 * Useful for product detail pages when you don't have a separate detail endpoint
 *
 * @example
 * const product = useFindProduct(productId, allProducts)
 */
export const useFindProduct = (productId: number, products: HoldingProduct[]): HoldingProduct | undefined => {
  return products.find((p) => p.id === productId)
}
