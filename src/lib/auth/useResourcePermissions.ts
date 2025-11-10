import usePermissions from './usePermissions'

/**
 * Custom hook for resource-specific permissions
 * Provides a standardized way to check permissions for any resource
 */
export const useResourcePermissions = (resource: string) => {
  const { hasPermission } = usePermissions()
  
  const readPermission = `read:${resource}`
  const writePermission = `write:${resource}`
  
  return {
    canRead: hasPermission(readPermission),
    canWrite: hasPermission(writePermission),
    readPermission,
    writePermission,
  }
}

/**
 * Pre-defined permission hooks for common resources
 */
export const useApplicationsPermissions = () => useResourcePermissions('applications')
export const useApplicationCredentialsPermissions = () => useResourcePermissions('application-credentials')
export const useBadgesPermissions = () => useResourcePermissions('badges')
export const useCampaignsPermissions = () => useResourcePermissions('campaigns')
export const useCampaignGroupsPermissions = () => useResourcePermissions('campaign-groups')
export const useLoyaltyProgramsPermissions = () => useResourcePermissions('loyalty-programs')
export const useManagementCredentialsPermissions = () => useResourcePermissions('management-credentials')
export const useProfilesPermissions = () => useResourcePermissions('profiles')
export const useSegmentsPermissions = () => useResourcePermissions('segments')
export const useStoresPermissions = () => useResourcePermissions('stores')
export const useTagsPermissions = () => useResourcePermissions('tags')
export const useUsersPermissions = () => useResourcePermissions('users')

/**
 * Hook for checking multiple resource permissions at once
 */
export const useMultipleResourcePermissions = (resources: string[]) => {
  const { hasPermission } = usePermissions()
  
  return resources.reduce((acc, resource) => {
    const readPermission = `read:${resource}`
    const writePermission = `write:${resource}`
    
    acc[resource] = {
      canRead: hasPermission(readPermission),
      canWrite: hasPermission(writePermission),
      readPermission,
      writePermission,
    }
    
    return acc
  }, {} as Record<string, {
    canRead: boolean
    canWrite: boolean
    readPermission: string
    writePermission: string
  }>)
}

/**
 * Hook for checking if user has any of the specified permissions
 */
export const useAnyPermission = (permissions: string[]) => {
  const { hasAnyPermission } = usePermissions()
  return hasAnyPermission(permissions)
}

/**
 * Hook for checking if user has all of the specified permissions
 */
export const useAllPermissions = (permissions: string[]) => {
  const { hasAllPermissions } = usePermissions()
  return hasAllPermissions(permissions)
}
