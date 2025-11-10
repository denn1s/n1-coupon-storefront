import { AccessDenied } from '@components/atoms/AccessDenied'
import Breadcrumbs from '@components/atoms/Breadcrumbs'

interface ResourceAccessDeniedProps {
  resource: string
  breadcrumbs?: Array<{ displayName: string; path: string }>
  customTitle?: string
  customMessage?: string
}

/**
 * Standardized component for resource access denied
 */
const ResourceAccessDenied = ({ 
  resource, 
  breadcrumbs = [],
  customTitle,
  customMessage
}: ResourceAccessDeniedProps) => {
  const title = customTitle || `Access Denied to ${resource.charAt(0).toUpperCase() + resource.slice(1).replace('-', ' ')}`
  const message = customMessage || 'You don\'t have the necessary permissions to view this section. Contact your administrator to get access.'

  return (
    <>
      {breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      <div className="p-6">
        <AccessDenied 
          title={title}
          message={message}
        />
      </div>
    </>
  )
}

export default ResourceAccessDenied
