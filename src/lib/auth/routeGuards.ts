import { redirect } from '@tanstack/react-router'
import usePermissions from './usePermissions'

/**
 * Route guard utilities for TanStack Router
 * These can be used in route loaders to protect routes at the routing level
 */

/**
 * Creates a route guard that checks for read permission
 * @param resource - The resource to check permissions for
 * @param redirectTo - Where to redirect if permission is denied
 */
export const createReadPermissionGuard = (resource: string, redirectTo: string = '/unauthorized') => {
  return () => {
    const { hasPermission } = usePermissions()

    if (!hasPermission(`read:${resource}`)) {
      throw redirect({ to: redirectTo })
    }
  }
}

/**
 * Creates a route guard that checks for write permission
 * @param resource - The resource to check permissions for
 * @param redirectTo - Where to redirect if permission is denied
 */
export const createWritePermissionGuard = (resource: string, redirectTo: string = '/unauthorized') => {
  return () => {
    const { hasPermission } = usePermissions()

    if (!hasPermission(`write:${resource}`)) {
      throw redirect({ to: redirectTo })
    }
  }
}

/**
 * Creates a route guard that checks for multiple permissions
 * @param permissions - Array of permissions to check
 * @param requireAll - Whether all permissions are required (default: true)
 * @param redirectTo - Where to redirect if permission is denied
 */
export const createMultiplePermissionGuard = (
  permissions: string[],
  requireAll: boolean = true,
  redirectTo: string = '/unauthorized'
) => {
  return () => {
    const { hasAnyPermission, hasAllPermissions } = usePermissions()

    const hasPermission = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)

    if (!hasPermission) {
      throw redirect({ to: redirectTo })
    }
  }
}

/**
 * Pre-defined route guards for common resources
 */
export const routeGuards = {
  // Applications
  applicationsRead: createReadPermissionGuard('applications'),
  applicationsWrite: createWritePermissionGuard('applications'),

  // Application Credentials
  applicationCredentialsRead: createReadPermissionGuard('application-credentials'),
  applicationCredentialsWrite: createWritePermissionGuard('application-credentials'),

  // Campaigns
  campaignsRead: createReadPermissionGuard('campaigns'),
  campaignsWrite: createWritePermissionGuard('campaigns'),

  // Campaign Groups
  campaignGroupsRead: createReadPermissionGuard('campaign-groups'),
  campaignGroupsWrite: createWritePermissionGuard('campaign-groups'),

  // Loyalty Programs
  loyaltyProgramsRead: createReadPermissionGuard('loyalty-programs'),
  loyaltyProgramsWrite: createWritePermissionGuard('loyalty-programs'),

  // Management Credentials
  managementCredentialsRead: createReadPermissionGuard('management-credentials'),
  managementCredentialsWrite: createWritePermissionGuard('management-credentials'),

  // Profiles
  profilesRead: createReadPermissionGuard('profiles'),
  profilesWrite: createWritePermissionGuard('profiles'),

  // Segments
  segmentsRead: createReadPermissionGuard('segments'),
  segmentsWrite: createWritePermissionGuard('segments'),

  // Stores
  storesRead: createReadPermissionGuard('stores'),
  storesWrite: createWritePermissionGuard('stores'),

  // Tags
  tagsRead: createReadPermissionGuard('tags'),
  tagsWrite: createWritePermissionGuard('tags'),

  // Users
  usersRead: createReadPermissionGuard('users'),
  usersWrite: createWritePermissionGuard('users')
}

/**
 * Usage: Add to route definitions
 *
 * export const Route = createFileRoute('/my-route')({
 *   component: MyComponent,
 *   loader: routeGuards.myResourceRead
 * })
 */
