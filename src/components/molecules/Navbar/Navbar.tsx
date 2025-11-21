import { useState } from 'react'
import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@stores/authStore'
import { useGetCategories } from '@services/holding.graphql'
import { HoldingBusinessCategory } from '@lib/api/types'
import SearchBox from '@components/atoms/SearchBox'
import { HiMenu, HiSearch, HiShoppingBag } from 'react-icons/hi'
import styles from './Navbar.module.css'

/**
 * Navbar Component
 *
 * Redesigned header matching n1coDeals branding.
 * Features:
 * - Desktop: Logo (Left) | Search (Center) | Mis Cupones (Right)
 * - Mobile: Hamburger | Logo | Search | Cart
 * - Category Sub-header
 */
export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, clearAuthState } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')

  // Check if we're on the My Orders page
  const isOnMyOrdersPage = location.pathname.startsWith('/orders')

  const handleLogout = () => {
    clearAuthState()
    navigate({ to: '/' })
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate({ to: '/search', search: { q: searchTerm } })
    }
  }

  // Parse category IDs from env
  const categoryIdsStr = import.meta.env.VITE_HEADER_CATEGORIES || '[]'
  let categoryIds: number[] = []
  try {
    categoryIds = JSON.parse(categoryIdsStr)
  } catch (e) {
    console.error('Failed to parse VITE_HEADER_CATEGORIES', e)
  }

  // Fetch categories
  const { data: categoriesData } = useGetCategories({ first: 50 })
  const allCategories = categoriesData?.holdingBusinessCategories?.nodes ?? []

  // Filter categories by ID
  const categories = allCategories.filter((category: HoldingBusinessCategory) => categoryIds.includes(category.id))

  return (
    <div className={styles.wrapper}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button className={styles.mobileMenuBtn}>
          <HiMenu size={24} />
        </button>
        <Link to="/" className={styles.logoLink}>
          <img src="/n1coDeals-black.svg" alt="n1coDeals" className={styles.logoImage} />
        </Link>
        <div className={styles.mobileActions}>
          <HiSearch size={24} className="text-gray-600" />
          <HiShoppingBag size={24} className="text-gray-600" />
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className={`${styles.navbar} hidden md:block`}>
        <div className={styles.container}>
          {/* Left side - Logo */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logoLink}>
              <img src="/n1coDeals-black.svg" alt="n1coDeals" className={styles.logoImage} />
            </Link>
          </div>

          {/* Center - Search Box */}
          <div className={styles.searchContainer}>
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={handleSearch}
              placeholder="Buscar más ofertas"
              className={styles.searchBox}
            />
          </div>

          {/* Right side - Navigation Links */}
          <div className={styles.nav}>
            {isAuthenticated ? (
              <>
                {/* My Orders Link */}
                {!isOnMyOrdersPage && (
                  <Link to="/orders" className={styles.navLink}>
                    <HiShoppingBag className={styles.navIcon} />
                    Mis cupones
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
                <Link to="/login" className={styles.loginLink}>
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Categories Bar */}
      {categories.length > 0 && (
        <div className={styles.categoriesBar}>
          <div className={styles.categoriesContainer}>
            {categories.map((category: HoldingBusinessCategory) => (
              <Link
                key={category.id}
                to="/categories/$categoryId"
                params={{ categoryId: category.id.toString() }}
                className={styles.categoryLink}
              >
                {/* Placeholder icons based on category name logic could go here */}
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
