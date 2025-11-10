import { Link } from '@tanstack/react-router'
import { useBreadcrumbStore } from '@stores/breadStore'
import styles from './BreadcrumbsRenderer.module.css'

export const BreadcrumbsRenderer = () => {
  const { breadcrumbs } = useBreadcrumbStore()

  if (breadcrumbs.length === 0) return null

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.breadcrumbList}>
        {breadcrumbs.map(({ displayName, path }, index) => {
          const isLast = index === breadcrumbs.length - 1
          return (
            <li key={path || 'last-breadcrumb'} className={styles.breadcrumbItem}>
              {isLast || !path ? (
                <span aria-current="page" className={styles.current}>
                  {displayName}
                </span>
              ) : (
                <Link to={path} className={styles.link}>
                  {displayName}
                </Link>
              )}
              {!isLast && <span className={styles.separator}>/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

