/**
 * Environment Variable Helpers
 *
 * Utilities for accessing environment variables in a Vite application.
 * All environment variables must be prefixed with 'VITE_' to be exposed to the client.
 *
 * @module lib/helpers/env
 *
 * @example
 * ```typescript
 * import { getEnv, getEnvs } from '@helpers/env'
 *
 * // Get single variable
 * const apiHost = getEnv('API_HOST') // Reads VITE_API_HOST
 *
 * // Get multiple variables
 * const [host, mount] = getEnvs(['API_HOST', 'API_MOUNT'])
 * ```
 */

/**
 * Prefix required for all Vite environment variables
 *
 * Vite only exposes environment variables that start with this prefix to the client.
 * This is a security measure to prevent accidental exposure of server-side secrets.
 *
 * @see {@link https://vite.dev/guide/env-and-mode.html|Vite Env Variables}
 */
const ENV_PREFIX = 'VITE_'

/**
 * Retrieves an environment variable value
 *
 * Automatically prepends 'VITE_' prefix and converts the key to uppercase.
 * Returns an empty string if the environment variable is not defined.
 *
 * @param key - The environment variable key (without VITE_ prefix)
 * @returns The environment variable value or empty string if not found
 *
 * @example
 * ```typescript
 * // In .env file:
 * // VITE_API_HOST=https://api.example.com
 * // VITE_API_MOUNT=/api/v1
 *
 * const apiHost = getEnv('API_HOST')
 * // Returns: 'https://api.example.com'
 *
 * const apiMount = getEnv('api_mount') // Case insensitive
 * // Returns: '/api/v1'
 *
 * const missing = getEnv('MISSING_VAR')
 * // Returns: '' (empty string)
 * ```
 */
export function getEnv(key: string): string {
  const envKey = ENV_PREFIX + key.toUpperCase()
  return import.meta.env[envKey] ?? ''
}

/**
 * Retrieves multiple environment variables at once
 *
 * Convenience function for fetching multiple environment variables in a single call.
 * Useful for array destructuring.
 *
 * @param keys - Array of environment variable keys (without VITE_ prefix)
 * @returns Array of environment variable values in the same order as keys
 *
 * @example
 * ```typescript
 * // Get multiple related variables
 * const [host, mount, timeout] = getEnvs(['API_HOST', 'API_MOUNT', 'API_TIMEOUT'])
 *
 * // Build URL from environment variables
 * const [authDomain, clientId, audience] = getEnvs([
 *   'AUTH_DOMAIN',
 *   'AUTH_CLIENT_ID',
 *   'AUTH_AUDIENCE'
 * ])
 * ```
 */
export function getEnvs(keys: string[]): string[] {
  return keys.map((key) => getEnv(key))
}
