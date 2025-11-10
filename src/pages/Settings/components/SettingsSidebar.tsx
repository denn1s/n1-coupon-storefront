import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { FiChevronDown, FiChevronRight, FiUser, FiChevronsLeft, FiChevronsRight, FiSettings } from 'react-icons/fi'
import styles from './SettingsSidebar.module.css'

/**
 * Interface for sidebar navigation items
 */
interface SidebarItem {
  name: string
  href?: string
  icon: React.ReactNode
  color: string
  activeColor: string
  children?: SidebarItem[]
}

/**
 * Collapsible sidebar component for Settings navigation
 *
 * CUSTOMIZE THIS: Replace placeholder items with your actual settings pages
 */
const SettingsSidebar: React.FC = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(true)

  /**
   * Toggles the sidebar collapsed state
   */
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev)
  }

  /**
   * Navigation items configuration
   * REPLACE THESE with your actual settings routes
   */
  const sidebarItems: SidebarItem[] = [
    {
      name: 'Profile',
      href: '/settings/profile',
      icon: <FiUser size={16} />,
      color: 'text-gray-600',
      activeColor: 'text-blue-600'
    },
    {
      name: 'General',
      href: '/settings/general',
      icon: <FiSettings size={16} />,
      color: 'text-gray-600',
      activeColor: 'text-blue-600'
    }
    // Add more settings pages here as you build them
  ]

  /**
   * Toggles the expanded state of a sidebar item
   */
  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]
    )
  }

  /**
   * Handles item clicks with smart expansion behavior
   * When collapsed and clicking an item with children, expands sidebar and shows submenu
   */
  const handleItemClick = (item: SidebarItem) => {
    if (isCollapsed && item.children && item.children.length > 0) {
      setIsCollapsed(false)
      // Delay expansion to allow animation to complete
      setTimeout(() => {
        if (!expandedItems.includes(item.name)) {
          setExpandedItems((prev) => [...prev, item.name])
        }
      }, 100)
    } else if (!isCollapsed) {
      toggleExpanded(item.name)
    }
  }

  /**
   * Checks if a route is currently active
   */
  const isActive = (href?: string) => {
    if (!href) return false
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  /**
   * Checks if a parent item should be highlighted (when any child is active)
   */
  const isParentActive = (item: SidebarItem) => {
    if (item.href && isActive(item.href)) return true
    if (item.children) {
      return item.children.some((child) => isActive(child.href))
    }
    return false
  }

  /**
   * Renders a sidebar item with proper styling and behavior
   */
  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)
    const itemIsActive = item.href ? isActive(item.href) : isParentActive(item)
    const paddingLeft = level === 0 ? 'pl-4' : 'pl-8'

    return (
      <div key={item.name}>
        {item.href ? (
          <Link
            to={item.href}
            className={`${styles.sidebarLink} ${paddingLeft} ${itemIsActive ? item.activeColor : item.color}`}
            data-active={itemIsActive}
            title={isCollapsed ? item.name : undefined}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </span>
          </Link>
        ) : (
          <button
            onClick={() => handleItemClick(item)}
            className={`${styles.sidebarButton} ${paddingLeft} ${itemIsActive ? item.activeColor : item.color}`}
            data-active={itemIsActive}
            title={isCollapsed ? (hasChildren ? `${item.name} (click to expand)` : item.name) : undefined}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </span>
            {hasChildren && !isCollapsed && (
              <span className="flex-shrink-0 ml-2">
                {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </span>
            )}
          </button>
        )}

        {hasChildren && isExpanded && !isCollapsed && (
          <div className={styles.submenu}>{item.children!.map((child) => renderSidebarItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className={`${styles.sidebarContainer} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Configuration</h3>
        )}
        <button
          onClick={toggleCollapse}
          className={styles.collapseButton}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FiChevronsRight size={18} /> : <FiChevronsLeft size={18} />}
        </button>
      </div>
      <nav className={styles.sidebar} aria-label="Settings Navigation">
        {sidebarItems.map((item) => renderSidebarItem(item))}
      </nav>
    </div>
  )
}

export default SettingsSidebar
