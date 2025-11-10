import { useQuery, queryOptions } from '@tanstack/react-query'
import { graphqlQueryFn } from '@lib/api/graphqlFn'

/**
 * Products GraphQL Service
 *
 * This service demonstrates how to work with GraphQL queries using TanStack Query.
 * It includes cursor-based pagination patterns that are easy to use in components.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ProductImage {
  sequence: number
  url: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  salePrice: number
  productImageUrl: string | null
  quantityAvailable: number
  images: ProductImage[]
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export interface ProductsConnection {
  nodes: Product[]
  totalCount: number
  pageInfo: PageInfo
}

export interface HoldingProductsResponse {
  holdingProducts: ProductsConnection
}

export interface ProductDetailResponse {
  product: Product
}

/**
 * Query variables for products list
 * Uses cursor-based pagination (GraphQL standard)
 */
export interface ProductsQueryVariables {
  first?: number // Number of items to fetch (forward pagination)
  after?: string // Cursor for forward pagination
  before?: string // Cursor for backward pagination
  last?: number // Number of items to fetch (backward pagination)
  search?: string // Optional search filter
}

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

const PRODUCT_DETAIL_QUERY = `
  query ProductDetail($id: ID!) {
    product(id: $id) {
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
  }
`

// ============================================================================
// QUERY FUNCTIONS (Internal)
// ============================================================================

const getProducts = (variables: ProductsQueryVariables = {}) =>
  graphqlQueryFn<ProductsQueryVariables, HoldingProductsResponse>(HOLDING_PRODUCTS_QUERY, variables)

const getProduct = (id: string) => graphqlQueryFn<{ id: string }, ProductDetailResponse>(PRODUCT_DETAIL_QUERY, { id })

// ============================================================================
// QUERY HOOKS (Public API)
// ============================================================================

/**
 * Fetch paginated products list with cursor-based pagination
 *
 * @example Basic usage
 * const { data, isLoading } = useGetProducts({ first: 20 })
 *
 * @example With pagination
 * const { data } = useGetProducts({ first: 20, after: cursor })
 * const hasMore = data?.holdingProducts.pageInfo.hasNextPage
 * const nextCursor = data?.holdingProducts.pageInfo.endCursor
 */
export const useGetProducts = (variables: ProductsQueryVariables = { first: 20 }) => {
  return useQuery({
    queryKey: ['products', 'list', variables],
    queryFn: getProducts(variables)
  })
}

/**
 * Query options for products list (useful for route prefetching)
 *
 * @example In route loader
 * loader: ({ context }) => {
 *   return context.queryClient.ensureQueryData(productsOptions({ first: 20 }))
 * }
 */
export const productsOptions = (variables: ProductsQueryVariables = { first: 20 }) =>
  queryOptions({
    queryKey: ['products', 'list', variables],
    queryFn: getProducts(variables)
  })

/**
 * Fetch single product by ID
 *
 * @example
 * const { data: product, isLoading } = useGetProduct(productId)
 */
export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: getProduct(id),
    enabled: !!id,
    select: (data) => data.product // Extract product from response
  })
}

/**
 * Query options for single product (useful for route prefetching)
 *
 * @example In route loader
 * loader: ({ context, params }) => {
 *   return context.queryClient.ensureQueryData(productOptions(params.productId))
 * }
 */
export const productOptions = (id: string) =>
  queryOptions({
    queryKey: ['products', 'detail', id],
    queryFn: getProduct(id)
  })

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

/**
 * Hook to simplify cursor-based pagination
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
 * } = useProductsPagination(20) // 20 items per page
 *
 * return (
 *   <div>
 *     {data?.map(product => <ProductCard key={product.id} product={product} />)}
 *     <button onClick={goToPreviousPage} disabled={!hasPreviousPage}>Previous</button>
 *     <button onClick={goToNextPage} disabled={!hasNextPage}>Next</button>
 *   </div>
 * )
 */
export const useProductsPagination = (pageSize: number = 20) => {
  const [variables, setVariables] = React.useState<ProductsQueryVariables>({
    first: pageSize
  })

  const query = useGetProducts(variables)

  const pageInfo = query.data?.holdingProducts.pageInfo
  const products = query.data?.holdingProducts.nodes ?? []
  const totalCount = query.data?.holdingProducts.totalCount ?? 0

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
    data: products,
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

// Import React for useState in pagination hook
import React from 'react'

// ============================================================================
// MUTATION EXAMPLES (Uncomment when needed)
// ============================================================================

/*
const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        id
        name
        description
        salePrice
        productImageUrl
        quantityAvailable
      }
    }
  }
`

const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      product {
        id
        name
        description
        salePrice
        productImageUrl
        quantityAvailable
      }
    }
  }
`

const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
    }
  }
`

interface CreateProductInput {
  name: string
  description?: string
  salePrice: number
  quantityAvailable: number
}

interface UpdateProductInput {
  name?: string
  description?: string
  salePrice?: number
  quantityAvailable?: number
}

interface CreateProductResponse {
  createProduct: {
    product: Product
  }
}

interface UpdateProductResponse {
  updateProduct: {
    product: Product
  }
}

interface DeleteProductResponse {
  deleteProduct: {
    success: boolean
  }
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: graphqlMutationFn<{ input: CreateProductInput }, CreateProductResponse>(
      CREATE_PRODUCT_MUTATION
    ),
    onSuccess: () => {
      // Invalidate products list to refetch with new product
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
    },
  })
}

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: graphqlMutationFn<{ id: string; input: UpdateProductInput }, UpdateProductResponse>(
      UPDATE_PRODUCT_MUTATION
    ),
    onSuccess: () => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['products', 'detail', id] })
    },
  })
}

export const useDeleteProduct = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: graphqlMutationFn<{ id: string }, DeleteProductResponse>(
      DELETE_PRODUCT_MUTATION
    ),
    onSuccess: () => {
      // Invalidate list and remove detail from cache
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
      queryClient.removeQueries({ queryKey: ['products', 'detail', id] })
    },
  })
}
*/
