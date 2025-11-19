import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@stores/authStore'
import styles from './Navbar.module.css'

/**
 * Navbar Component
 *
 * Horizontal navigation bar with My Coupons link
 * - Shows "Login" if not authenticated
 * - Shows "My Coupons" and "Logout" if authenticated
 * - Hides "My Coupons" link when already on that page
 */
export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, clearAuthState } = useAuthStore()

  // Check if we're on the My Coupons page
  const isOnMyCouponsPage = location.pathname === '/my-coupons'

  const handleLogout = () => {
    clearAuthState()
    navigate({ to: '/' })
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Left side - Logo/Brand */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logoLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={styles.logoIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
              />
            </svg>
            <span className={styles.logoText}>N1 Coupons</span>
          </Link>
        </div>

        {/* Right side - Navigation Links */}
        <div className={styles.nav}>
          {isAuthenticated ? (
            <>
              {/* My Coupons Link - only show when not on that page */}
              {!isOnMyCouponsPage && (
                <Link to="/my-coupons" className={styles.navLink}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={styles.navIcon}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                    />
                  </svg>
                  My Coupons
                </Link>
              )}

              {/* User Info */}
              {user && <span className={styles.userInfo}>{user.name || user.phone || 'User'}</span>}

              {/* Logout Button */}
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login Link */}
              <Link to="/login" className={styles.loginLink}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
