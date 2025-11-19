import { useNavigate } from '@tanstack/react-router'
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa'
import styles from './ErrorPage.module.css'
import { isGraphQLError, getUserErrorMessage } from '@lib/api/graphqlErrors'

export interface ErrorPageProps {
  error?: Error | unknown
  reset?: () => void
  showDetails?: boolean
}

export default function ErrorPage({ error, reset, showDetails = false }: ErrorPageProps) {
  const navigate = useNavigate()

  const userMessage = error ? getUserErrorMessage(error) : 'An unexpected error occurred.'

  // Get error code if available
  const errorCode = isGraphQLError(error) ? error.code : 'UNKNOWN'
  const requiresAuth = isGraphQLError(error) ? error.requiresAuth : false
  const isRetryable = isGraphQLError(error) ? error.isRetryable : true

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  const handleRetry = () => {
    if (reset) {
      reset()
    } else {
      window.location.reload()
    }
  }

  const handleLogin = () => {
    navigate({ to: '/login' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Error Icon */}
        <div className={styles.iconWrapper}>
          <FaExclamationTriangle className={styles.icon} />
        </div>

        {/* Error Title */}
        <h1 className={styles.title}>Oops! Something went wrong</h1>

        {/* User-friendly message */}
        <p className={styles.message}>{userMessage}</p>

        {/* Show error code if available */}
        {showDetails && errorCode !== 'UNKNOWN' && <p className={styles.errorCode}>Error Code: {errorCode}</p>}

        {/* Action Buttons */}
        <div className={styles.actions}>
          {requiresAuth && (
            <button onClick={handleLogin} className={styles.buttonPrimary}>
              <FaHome className={styles.buttonIcon} />
              Log In
            </button>
          )}

          {!requiresAuth && (
            <button onClick={handleGoHome} className={styles.buttonPrimary}>
              <FaHome className={styles.buttonIcon} />
              Go Home
            </button>
          )}

          {isRetryable && (
            <button onClick={handleRetry} className={styles.buttonSecondary}>
              <FaRedo className={styles.buttonIcon} />
              Try Again
            </button>
          )}
        </div>

        {/* Technical details (for development) */}
        {showDetails && error instanceof Error && (
          <details className={styles.details}>
            <summary className={styles.detailsSummary}>Technical Details</summary>
            <pre className={styles.detailsContent}>
              <code>{error.message}</code>
              {error.stack && (
                <>
                  {'\n\n'}
                  <code>{error.stack}</code>
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
