import { ReactNode } from 'react'
import { toast as hotToast, Toaster, ToastOptions } from 'react-hot-toast'

type ToastVariant = 'default' | 'success' | 'error' | 'info'

interface AddToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: ReactNode
}

const ToastContent = ({ title, description }: { title: string; description?: string }) => (
  <div className="flex flex-col">
    <strong className="text-sm font-medium text-gray-900">{title}</strong>
    {description && <span className="text-sm text-gray-600 mt-1">{description}</span>}
  </div>
)

// eslint-disable-next-line react-refresh/only-export-components
export const addToast = ({ title, description, variant = 'default', duration }: AddToastOptions) => {
  const options: ToastOptions = {
    duration: duration ?? 4000,
    className: ''
  }

  const content = <ToastContent title={title} description={description} />

  switch (variant) {
    case 'success':
      hotToast.success(content, options)
      break
    case 'error':
      hotToast.error(content, options)
      break
    case 'info':
    case 'default':
    default:
      hotToast(content, options)
      break
  }
}

export { Toaster as ToastViewport }
