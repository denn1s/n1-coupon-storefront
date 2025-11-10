/**
 * Utility functions for error handling
 */

/**
 * Type guard to check if an error object has an HTTP status property
 * @param error - The error object to check
 * @returns True if the error has a numeric status property
 */
export function isHttpError(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error && typeof (error as { status?: unknown }).status === 'number'
}
