import { useQuery, queryOptions } from '@tanstack/react-query'
import { graphqlQueryFn } from '@lib/api/graphqlFn'
import {
  HoldingProduct,
  HoldingBusinessCategory,
  HoldingStore,
  HoldingCollection,
  HoldingProductsResponse,
  HoldingBusinessCategoriesResponse,
  HoldingStoresResponse,
  HoldingCollectionsResponse,
  PaginationVariables,
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
      nodes {
        id
        name
        description
        salePrice
        productImageUrl
        quantityAvailable
        images {
          sequence
          url
        }
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

const HOLDING_BUSINESS_CATEGORIES_QUERY = `
  query HoldingBusinessCategories($first: Int, $after: String) {
    holdingBusinessCategories(first: $first, after: $after) {
      nodes {
        id
        name
        description
        bannerImageUrl
        smallBannerImageUrl
        storeCount
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

const HOLDING_STORES_QUERY = `
  query HoldingStores($first: Int, $after: String) {
    holdingStores(first: $first, after: $after) {
      nodes {
        id
        name
        description
        storeImageUrl
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

const HOLDING_COLLECTIONS_QUERY = `
  query HoldingCollections($first: Int, $after: String) {
    holdingCollections(first: $first, after: $after) {
      nodes {
        id
        name
        description
        bannerImageUrl
        smallBannerImageUrl
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

const getProducts = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, HoldingProductsResponse>(
    HOLDING_PRODUCTS_QUERY,
    variables
  )

const getCategories = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, HoldingBusinessCategoriesResponse>(
    HOLDING_BUSINESS_CATEGORIES_QUERY,
    variables
  )

const getStores = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, HoldingStoresResponse>(
    HOLDING_STORES_QUERY,
    variables
  )

const getCollections = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, HoldingCollectionsResponse>(
    HOLDING_COLLECTIONS_QUERY,
    variables
  )

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
    queryFn: getProducts(variables),
  })
}

/**
 * Query options for products list (useful for route prefetching)
 */
export const productsOptions = (variables: PaginationVariables = { first: 20 }) =>
  queryOptions({
    queryKey: ['holding', 'products', 'list', variables],
    queryFn: getProducts(variables),
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
 * } = useProductsPagination(20)
 */
export const useProductsPagination = (pageSize: number = 20) => {
  const [variables, setVariables] = useState<PaginationVariables>({
    first: pageSize,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedStore, setSelectedStore] = useState<number | null>(null)

  const query = useGetProducts(variables)

  const pageInfo = query.data?.holdingProducts.pageInfo
  const allProducts = query.data?.holdingProducts.nodes ?? []
  const totalCount = query.data?.holdingProducts.totalCount ?? 0

  // Client-side filtering (since API doesn't support filters yet)
  const filteredProducts = allProducts.filter((product) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
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
        after: pageInfo.endCursor,
      })
    }
  }

  const goToPreviousPage = () => {
    if (pageInfo?.hasPreviousPage && pageInfo.startCursor) {
      setVariables({
        last: pageSize,
        before: pageInfo.startCursor,
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
    error: query.error,

    // Pagination state
    hasNextPage: pageInfo?.hasNextPage ?? false,
    hasPreviousPage: pageInfo?.hasPreviousPage ?? false,

    // Pagination controls
    goToNextPage,
    goToPreviousPage,
    resetPagination,

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
    refetch: query.refetch,
  }
}

// ============================================================================
// CATEGORIES HOOKS
// ============================================================================

/**
 * Fetch business categories
 *
 * @example
 * const { data, isLoading } = useGetCategories()
 */
export const useGetCategories = (variables: PaginationVariables = { first: 100 }) => {
  return useQuery({
    queryKey: ['holding', 'categories', 'list', variables],
    queryFn: getCategories(variables),
    select: (data) => data.holdingBusinessCategories,
  })
}

/**
 * Query options for categories (useful for route prefetching)
 */
export const categoriesOptions = (variables: PaginationVariables = { first: 100 }) =>
  queryOptions({
    queryKey: ['holding', 'categories', 'list', variables],
    queryFn: getCategories(variables),
  })

// ============================================================================
// STORES HOOKS
// ============================================================================

/**
 * Fetch stores
 *
 * @example
 * const { data, isLoading } = useGetStores()
 */
export const useGetStores = (variables: PaginationVariables = { first: 100 }) => {
  return useQuery({
    queryKey: ['holding', 'stores', 'list', variables],
    queryFn: getStores(variables),
    select: (data) => data.holdingStores,
  })
}

/**
 * Query options for stores (useful for route prefetching)
 */
export const storesOptions = (variables: PaginationVariables = { first: 100 }) =>
  queryOptions({
    queryKey: ['holding', 'stores', 'list', variables],
    queryFn: getStores(variables),
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
export const useGetCollections = (variables: PaginationVariables = { first: 100 }) => {
  return useQuery({
    queryKey: ['holding', 'collections', 'list', variables],
    queryFn: getCollections(variables),
    select: (data) => data.holdingCollections,
  })
}

/**
 * Query options for collections (useful for route prefetching)
 */
export const collectionsOptions = (variables: PaginationVariables = { first: 100 }) =>
  queryOptions({
    queryKey: ['holding', 'collections', 'list', variables],
    queryFn: getCollections(variables),
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
export const useFindProduct = (
  productId: number,
  products: HoldingProduct[]
): HoldingProduct | undefined => {
  return products.find((p) => p.id === productId)
}
