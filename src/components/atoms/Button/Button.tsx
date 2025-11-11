import { useState, useCallback } from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

export interface ButtonProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  onClick: () => void | Promise<void>
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  disableAfterClick?: boolean
  disabled?: boolean
}

const Button = ({
  color = 'primary',
  onClick,
  icon,
  children,
  className,
  disableAfterClick = false,
  disabled = false
}: ButtonProps) => {
  const [loading, setLoading] = useState(false)
  const [clickedOnce, setClickedOnce] = useState(false)

  const handleClick = useCallback(async () => {
    if (disabled || loading || (disableAfterClick && clickedOnce)) return

    const result = onClick()
    if (disableAfterClick) setClickedOnce(true)

    if (result instanceof Promise) {
      try {
        setLoading(true)
        await result
      } finally {
        setLoading(false)
      }
    }
  }, [onClick, disabled, loading, disableAfterClick, clickedOnce])

  const isDisabled = disabled || loading || (disableAfterClick && clickedOnce)

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={clsx(styles.btn, styles[color], loading && styles.btnLoading, className)}
      role="button"
      aria-label="Button"
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  )
}

export default Button
