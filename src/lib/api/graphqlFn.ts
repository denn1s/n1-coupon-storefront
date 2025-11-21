import { QueryFunctionContext } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { authStore } from '@stores/authStore'
import { getEnv } from '@lib/helpers/env'
import { parseGraphQLError } from './graphqlErrors'

/**
 * GraphQL client instance (singleton pattern)
 */
let graphqlClient: GraphQLClient | null = null

/**
 * Get or create GraphQL client
 * Ensures a single client instance throughout the app
 */
export function getGraphQLClient(): GraphQLClient {
  if (!graphqlClient) {
    const apiHost = getEnv('API_HOST') || 'https://localhost:5005'
    const graphqlEndpoint = `${apiHost}/graphql`

    // Initialize with mandatory headers
    graphqlClient = new GraphQLClient(graphqlEndpoint, {
      headers: {
        'X-App-Id': 'plazamalta', // Mandatory custom header for H4B API
        'Content-Type': 'application/json'
      }
    })
  }

  return graphqlClient
}

/**
 * Type for GraphQL query function compatible with TanStack Query
 */
type GraphQLQueryFn<TData> = (context?: QueryFunctionContext) => Promise<TData>

/**
 * GraphQL Query Function Builder
 *
 * Creates a query function compatible with TanStack Query's useQuery.
 * Automatically handles authentication, headers, and error handling.
 *
 * @param query - GraphQL query string
 * @param variables - Query variables (optional)
 * @returns A function compatible with TanStack Query
 *
 * @example
 * const getProducts = (variables: ProductsVariables) =>
 *   graphqlQueryFn<HoldingProductsResponse>(PRODUCTS_QUERY, variables)
 *
 * export const useGetProducts = (variables: ProductsVariables) => {
 *   return useQuery({
 *     queryKey: ['products', 'list', variables],
 *     queryFn: getProducts(variables)
 *   })
 * }
 */
export function graphqlQueryFn<TVariables = undefined, TData = unknown>(
  query: string,
  variables?: TVariables
): GraphQLQueryFn<TData> {
  return async (context?: QueryFunctionContext): Promise<TData> => {
    const client = getGraphQLClient()
    const { accessToken } = authStore.state

    // Always include mandatory X-App-Id header (already set in client initialization)
    // Conditionally add Authorization header only if token exists
    if (accessToken) {
      client.setHeader('Authorization', `Bearer ${accessToken}`)
    } else {
      // Remove Authorization header if no token (for public endpoints)
      client.setHeader('Authorization', '')
    }

    if (import.meta.env.DEV) {
      console.log('[GRAPHQL REQUEST]', {
        query: query.trim().split('\n')[0] + '...', // First line of query
        variables,
        hasAuth: !!accessToken
      })
    }

    try {
      // GraphQL request with abort signal support
      const data = await client.request<TData>({
        document: query,
        variables: variables as Record<string, unknown>,
        signal: context?.signal
      })

      if (import.meta.env.DEV) {
        console.log('[GRAPHQL RESPONSE]', data)
      }

      return data
    } catch (error) {
      // Ignore abort errors (cancellation)
      if (error instanceof Error && error.name === 'AbortError') {
        throw error
      }

      console.error('[GRAPHQL ERROR]', error)

      // Parse and enhance error with better categorization and user-friendly messages
      const parsedError = parseGraphQLError(error, query, variables as unknown)
      throw parsedError
    }
  }
}

/**
 * GraphQL Mutation Function Builder
 *
 * Creates a mutation function compatible with TanStack Query's useMutation.
 * Returns a function that accepts variables and returns a Promise.
 *
 * @param mutation - GraphQL mutation string
 * @returns A function that accepts variables and returns Promise<TData>
 *
 * @example
 * const createProduct = graphqlMutationFn<CreateProductInput, CreateProductResponse>(
 *   CREATE_PRODUCT_MUTATION
 * )
 *
 * export const useCreateProduct = () => {
 *   const queryClient = useQueryClient()
 *   return useMutation({
 *     mutationFn: createProduct,
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
 *     }
 *   })
 * }
 */
export function graphqlMutationFn<TVariables = undefined, TData = unknown>(
  mutation: string
): (variables?: TVariables) => Promise<TData> {
  return async (variables?: TVariables): Promise<TData> => {
    const client = getGraphQLClient()
    const { accessToken } = authStore.state

    // Conditionally add Authorization header
    if (accessToken) {
      client.setHeader('Authorization', `Bearer ${accessToken}`)
    } else {
      client.setHeader('Authorization', '')
    }

    if (import.meta.env.DEV) {
      console.log('[GRAPHQL MUTATION]', {
        mutation: mutation.trim().split('\n')[0] + '...', // First line
        variables,
        hasAuth: !!accessToken
      })
    }

    try {
      const data = await client.request<TData>({
        document: mutation,
        variables: variables as Record<string, unknown>
      })

      if (import.meta.env.DEV) {
        console.log('[GRAPHQL MUTATION RESPONSE]', data)
      }

      return data
    } catch (error) {
      console.error('[GRAPHQL MUTATION ERROR]', error)

      // Parse and enhance error with better categorization and user-friendly messages
      const parsedError = parseGraphQLError(error, mutation, variables as unknown)
      throw parsedError
    }
  }
}
