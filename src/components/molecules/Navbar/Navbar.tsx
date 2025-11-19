import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@stores/authStore'
import styles from './Navbar.module.css'

/**
 * Navbar Component
 *
 * Horizontal navigation bar with My Orders link
 * - Shows "Login" if not authenticated
 * - Shows "My Orders" and "Logout" if authenticated
 * - Hides "My Orders" link when already on that page
 */
export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, clearAuthState } = useAuthStore()

  // Check if we're on the My Orders page
  const isOnMyOrdersPage = location.pathname.startsWith('/orders')

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
              {/* My Orders Link - only show when not on that page */}
              {!isOnMyOrdersPage && (
                <Link to="/orders" className={styles.navLink}>
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
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  My Orders
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
