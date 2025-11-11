/**
 * Simple Spinner component using DaisyUI
 */
export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'accent' | 'neutral'
}

export default function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
  const sizeClass = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  }[size]

  const colorClass = color ? `text-${color}` : ''

  return <span className={`loading loading-spinner ${sizeClass} ${colorClass}`}></span>
}
