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
 *
 * Updated to match APIDOCS.md - uses nodes[] pattern directly
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
        store {
          id
          name
          storeImageUrl
        }
        holdingCollections {
          id
          name
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

const PRODUCT_QUERY = `
  query Product($id: Int!) {
    product(id: $id) {
      id
      name
      description
      salePrice
      price
      productImageUrl
      quantityAvailable
      images {
        sequence
        url
      }
      store {
        id
        name
        storeImageUrl
      }
      holdingCollections {
        id
        name
      }
    }
  }
`

// ============================================================================
// QUERY FUNCTIONS (Internal)
// ============================================================================

const getProducts = (variables: PaginationVariables = {}) =>
  graphqlQueryFn<PaginationVariables, HoldingProductsResponse>(HOLDING_PRODUCTS_QUERY, variables)

const getProduct = (variables: { id: number }) =>
  graphqlQueryFn<{ id: number }, { product: HoldingProduct }>(PRODUCT_QUERY, variables)

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
 * Fetch a single product by ID
 *
 * @example
 * const { data, isLoading } = useGetProduct(123)
 */
export const useGetProduct = (productId: number) => {
  return useQuery({
    queryKey: ['holding', 'product', productId],
    queryFn: getProduct({ id: productId }),
    enabled: !!productId
  })
}

/**
 * Query options for single product (useful for route prefetching)
 */
export const productOptions = (productId: number) =>
  queryOptions({
    queryKey: ['holding', 'product', productId],
    queryFn: getProduct({ id: productId }),
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  })

/**
 * Hook to simplify cursor-based pagination for products
 * Includes client-side search and filtering
 *
 * @example
 * const {
 *   data,
 *   totalCount,
 *   hasNextPage,
 *   goToNextPage,
 *   searchTerm,
 *   setSearchTerm
 * } = useProductsPagination(20)
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
  const allProducts = query.data?.holdingProducts.nodes ?? []
  const totalCount = query.data?.holdingProducts.totalCount ?? 0

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
 * const { data, isLoading } = useGetCategories({ first: 50 })
 */
export const useGetCategories = (
  variables: PaginationVariables = { first: 50 },
  options?: { initialData?: HoldingBusinessCategoriesResponse; staleTime?: number }
) => {
  return useQuery({
    queryKey: ['holding', 'categories', 'list', variables],
    queryFn: getCategories(variables),
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
 * const { data, isLoading } = useGetStores({ first: 50 })
 */
export const useGetStores = (
  variables: PaginationVariables = { first: 50 },
  options?: { initialData?: HoldingStoresResponse; staleTime?: number }
) => {
  return useQuery({
    queryKey: ['holding', 'stores', 'list', variables],
    queryFn: getStores(variables),
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
export const useGetCollections = (
  variables: PaginationVariables = { first: 50 },
  options?: { initialData?: HoldingCollectionsResponse; staleTime?: number }
) => {
  return useQuery({
    queryKey: ['holding', 'collections', 'list', variables],
    queryFn: getCollections(variables),
    initialData: options?.initialData,
    staleTime: options?.staleTime ?? 5 * 60 * 1000
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
