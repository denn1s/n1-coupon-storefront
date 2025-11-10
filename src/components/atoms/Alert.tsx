import React from 'react'

export type AlertProps = {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

const variantClasses: Record<NonNullable<AlertProps['variant']>, string> = {
  info: 'bg-blue-50 text-blue-800 border-blue-300',
  success: 'bg-green-50 text-green-800 border-green-300',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-300',
  error: 'bg-red-50 text-red-800 border-red-300',
}

const Alert: React.FC<AlertProps> = ({ children, variant = 'error', className }) => {
  return (
    <div
      role="alert"
      className={[
        'rounded border px-3 py-2 text-sm',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export default Alert


