import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import styles from './ButtonLink.module.css'

export interface ButtonLinkProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  to: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
  color = 'primary',
  to,
  icon,
  children,
  className,
  disabled = false
}) => (
  <Link
    type="button"
    to={to}
    disabled={disabled}
    className={clsx(styles.btn, styles[color], className)}
    role="button"
    aria-label="Button"
  >
    {icon && <span className={styles.icon}>{icon}</span>}
    {children}
  </Link>
)

export default ButtonLink
