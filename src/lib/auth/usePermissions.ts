import { useAuth } from './useAuth'

/**
 * Hook for checking user permissions
 * Provides a centralized way to verify if the current user has specific permissions
 */
const usePermissions = () => {
  const { permissions, isAuthenticated, isLoading } = useAuth()

  /**
   * Checks if the user has a specific permission
   * @param requiredPermission - The permission to check for (e.g., "write:applications")
   * @returns boolean - true if user has the permission, false otherwise
   */
  const hasPermission = (requiredPermission: string): boolean => {
    // If not authenticated or still loading, deny access
    if (!isAuthenticated || isLoading) {
      return false
    }

    // If permissions array is empty, null, or undefined, deny access
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return false
    }

    // Check if the required permission exists in the user's permissions array
    return permissions.includes(requiredPermission)
  }

  /**
   * Checks if the user has any of the provided permissions
   * @param requiredPermissions - Array of permissions to check for
   * @returns boolean - true if user has at least one of the permissions, false otherwise
   */
  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    if (!isAuthenticated || isLoading || !permissions || !Array.isArray(permissions)) {
      return false
    }

    return requiredPermissions.some(permission => permissions.includes(permission))
  }

  /**
   * Checks if the user has all of the provided permissions
   * @param requiredPermissions - Array of permissions to check for
   * @returns boolean - true if user has all permissions, false otherwise
   */
  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    if (!isAuthenticated || isLoading || !permissions || !Array.isArray(permissions)) {
      return false
    }

    return requiredPermissions.every(permission => permissions.includes(permission))
  }

  /**
   * Gets all permissions for the current user
   * @returns string[] - Array of user permissions
   */
  const getUserPermissions = (): string[] => {
    if (!isAuthenticated || isLoading || !permissions || !Array.isArray(permissions)) {
      return []
    }

    return [...permissions]
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
    permissions,
    isAuthenticated,
    isLoading,
  }
}

export default usePermissions
