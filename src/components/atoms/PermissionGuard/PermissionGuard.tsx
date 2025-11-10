import { ReactNode } from 'react'
import usePermissions from '@auth/usePermissions'

interface PermissionGuardProps {
  children: ReactNode
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  fallback?: ReactNode
}

/**
 * Component that conditionally renders children based on user permissions
 * 
 * @param children - Content to render if permission check passes
 * @param permission - Single permission to check for
 * @param permissions - Array of permissions to check for
 * @param requireAll - If true, user must have ALL permissions. If false, user needs ANY permission
 * @param fallback - Content to render if permission check fails
 */
const PermissionGuard = ({ 
  children, 
  permission, 
  permissions, 
  requireAll = false, 
  fallback = null 
}: PermissionGuardProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(permission)
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
  } else {
    // If no permissions specified, allow access
    hasAccess = true
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

export default PermissionGuard
