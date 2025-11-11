import { HiLockClosed, HiExclamation } from 'react-icons/hi'

interface AccessDeniedProps {
  title?: string
  message?: string
  showIcon?: boolean
  className?: string
}

/**
 * Component to display when user doesn't have permissions to access a section
 */
const AccessDenied = ({
  title = 'Access Denied',
  message = "You don't have the necessary permissions to access this section.",
  showIcon = true,
  className = ''
}: AccessDeniedProps) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] px-4 ${className}`}>
      <div className="text-center max-w-md">
        {showIcon && (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <HiLockClosed className="h-8 w-8 text-red-600" />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
          <HiExclamation className="h-5 w-5 mr-2 text-yellow-500" />
          <span>Contact your administrator if you believe this is an error.</span>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied
