/**
 * GraphQL Error Utilities
 *
 * Provides custom error classes and utilities for handling GraphQL errors
 * with user-friendly messages and proper categorization.
 */

export type GraphQLErrorCode =
  | 'AUTH_NOT_AUTHORIZED'
  | 'AUTH_UNAUTHENTICATED'
  | 'BAD_USER_INPUT'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN'

export interface GraphQLErrorInfo {
  code: GraphQLErrorCode
  message: string
  userMessage: string
  isRetryable: boolean
  requiresAuth: boolean
}

/**
 * Custom GraphQL Error class with better error information
 */
export class GraphQLError extends Error {
  public readonly code: GraphQLErrorCode
  public readonly userMessage: string
  public readonly isRetryable: boolean
  public readonly requiresAuth: boolean
  public readonly originalError?: Error
  public readonly query?: string
  public readonly variables?: unknown

  constructor(info: GraphQLErrorInfo, originalError?: Error, query?: string, variables?: unknown) {
    super(info.message)
    this.name = 'GraphQLError'
    this.code = info.code
    this.userMessage = info.userMessage
    this.isRetryable = info.isRetryable
    this.requiresAuth = info.requiresAuth
    this.originalError = originalError
    this.query = query
    this.variables = variables

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GraphQLError)
    }
  }
}

/**
 * Parse GraphQL error response and categorize the error
 */
export function parseGraphQLError(
  error: unknown,
  query?: string,
  variables?: unknown
): GraphQLError {
  // Handle graphql-request ClientError
  if (error && typeof error === 'object' && 'response' in error) {
    const clientError = error as {
      response?: {
        errors?: Array<{
          message?: string
          extensions?: { code?: string }
        }>
      }
    }

    const firstError = clientError.response?.errors?.[0]
    const errorCode = firstError?.extensions?.code
    const errorMessage = firstError?.message || 'An unknown error occurred'

    return categorizeGraphQLError(errorCode, errorMessage, error as Error, query, variables)
  }

  // Handle network errors
  if (error instanceof TypeError && (error.message || '').indexOf('fetch') !== -1) {
    return new GraphQLError(
      {
        code: 'NETWORK_ERROR',
        message: 'Network error: Unable to connect to server',
        userMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
        isRetryable: true,
        requiresAuth: false
      },
      error as Error,
      query,
      variables
    )
  }

  // Handle generic errors
  if (error instanceof Error) {
    return new GraphQLError(
      {
        code: 'UNKNOWN',
        message: error.message,
        userMessage: 'Something went wrong. Please try again later.',
        isRetryable: true,
        requiresAuth: false
      },
      error,
      query,
      variables
    )
  }

  // Fallback for unknown error types
  return new GraphQLError(
    {
      code: 'UNKNOWN',
      message: 'An unknown error occurred',
      userMessage: 'Something went wrong. Please try again later.',
      isRetryable: true,
      requiresAuth: false
    },
    undefined,
    query,
    variables
  )
}

/**
 * Categorize GraphQL error by error code
 */
function categorizeGraphQLError(
  errorCode: string | undefined,
  errorMessage: string,
  originalError: Error,
  query?: string,
  variables?: unknown
): GraphQLError {
  switch (errorCode) {
    case 'AUTH_NOT_AUTHORIZED':
      return new GraphQLError(
        {
          code: 'AUTH_NOT_AUTHORIZED',
          message: errorMessage,
          userMessage:
            'You do not have permission to access this resource. Please contact support if you believe this is an error.',
          isRetryable: false,
          requiresAuth: true
        },
        originalError,
        query,
        variables
      )

    case 'AUTH_UNAUTHENTICATED':
    case 'UNAUTHENTICATED':
      return new GraphQLError(
        {
          code: 'AUTH_UNAUTHENTICATED',
          message: errorMessage,
          userMessage: 'Your session has expired. Please log in again.',
          isRetryable: false,
          requiresAuth: true
        },
        originalError,
        query,
        variables
      )

    case 'BAD_USER_INPUT':
    case 'BAD_REQUEST':
      return new GraphQLError(
        {
          code: 'BAD_USER_INPUT',
          message: errorMessage,
          userMessage: 'Invalid request. Please check your input and try again.',
          isRetryable: false,
          requiresAuth: false
        },
        originalError,
        query,
        variables
      )

    case 'FORBIDDEN':
      return new GraphQLError(
        {
          code: 'FORBIDDEN',
          message: errorMessage,
          userMessage: 'Access denied. You do not have permission to perform this action.',
          isRetryable: false,
          requiresAuth: true
        },
        originalError,
        query,
        variables
      )

    case 'NOT_FOUND':
      return new GraphQLError(
        {
          code: 'NOT_FOUND',
          message: errorMessage,
          userMessage: 'The requested resource could not be found.',
          isRetryable: false,
          requiresAuth: false
        },
        originalError,
        query,
        variables
      )

    case 'INTERNAL_SERVER_ERROR':
      return new GraphQLError(
        {
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
          userMessage: 'A server error occurred. Our team has been notified. Please try again later.',
          isRetryable: true,
          requiresAuth: false
        },
        originalError,
        query,
        variables
      )

    default:
      return new GraphQLError(
        {
          code: 'UNKNOWN',
          message: errorMessage,
          userMessage: 'An unexpected error occurred. Please try again later.',
          isRetryable: true,
          requiresAuth: false
        },
        originalError,
        query,
        variables
      )
  }
}

/**
 * Check if error is a GraphQL error
 */
export function isGraphQLError(error: unknown): error is GraphQLError {
  return error instanceof GraphQLError
}

/**
 * Get user-friendly error message from any error
 */
export function getUserErrorMessage(error: unknown): string {
  if (isGraphQLError(error)) {
    return error.userMessage
  }

  if (error instanceof Error) {
    return 'Something went wrong. Please try again later.'
  }

  return 'An unexpected error occurred. Please try again later.'
}
