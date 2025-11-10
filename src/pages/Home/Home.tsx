import { useAuthStore } from '@stores/authStore'
import { Link } from '@tanstack/react-router'
import styles from './Home.module.css'

export default function Index() {
  const { user, isAuthenticated } = useAuthStore()

  return (
    <div className={styles.container}>
      <div className={styles.welcomeSection}>
        <h3 className={styles.title}>Welcome Home!</h3>
        {isAuthenticated && user && (
          <p className={styles.subtitle}>
            Hello, {user.name ?? user.email ?? 'User'}!
          </p>
        )}
        {!isAuthenticated && <p className={styles.subtitle}>Please log in to access more features.</p>}
      </div>

      {/* Quick Links */}
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <h2 className={styles.cardTitle}>Quick Links</h2>
          <div className={styles.quickLinksGrid}>
            <Link to="/items" className={styles.link}>
              <button className={styles.linkButton}>
                View Items
              </button>
            </Link>
            <Link to="/settings" className={styles.link}>
              <button className={styles.linkButton}>
                Settings
              </button>
            </Link>
            <Link to="/about" className={styles.link}>
              <button className={styles.linkButton}>
                About
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* UI Components Example */}
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <h2 className={styles.cardTitle}>UI Components</h2>
          <p className={styles.description}>
            This template includes DaisyUI components. Here are some button variants:
          </p>
          <div className={styles.buttonsContainer}>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>Primary</button>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>Secondary</button>
            <button className={`${styles.btn} ${styles.btnAccent}`}>Accent</button>
            <button className={`${styles.btn} ${styles.btnInfo}`}>Info</button>
            <button className={`${styles.btn} ${styles.btnSuccess}`}>Success</button>
            <button className={`${styles.btn} ${styles.btnWarning}`}>Warning</button>
            <button className={`${styles.btn} ${styles.btnError}`}>Error</button>
            <button className={`${styles.btn} ${styles.btnGhost}`}>Ghost</button>
            <button className={`${styles.btn} ${styles.btnLink}`}>Link</button>
            <button className={styles.btnOutline}>Outline</button>
            <button className={styles.btnSm}>Small</button>
            <button className={styles.btnLg}>Large</button>
          </div>
        </div>
      </div>
    </div>
  )
}
