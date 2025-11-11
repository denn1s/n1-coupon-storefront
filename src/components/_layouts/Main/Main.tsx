import { useState, Fragment, useRef, useEffect } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { HiOutlineMenu, HiOutlineCog, HiOutlineHome, HiOutlineCollection } from 'react-icons/hi'
import { AiOutlineAppstore } from 'react-icons/ai'
import { Dialog, DialogBackdrop, DialogPanel, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { BreadcrumbsRenderer } from '@components/atoms/Breadcrumbs'
import styles from './Main.module.css'
import useAuth, { useAuthActions } from '@auth/useAuth'

const navItems = [
  { name: 'Home', icon: HiOutlineHome, to: '/' },
  { name: 'Items', icon: HiOutlineCollection, to: '/items' },
  { name: 'About', icon: AiOutlineAppstore, to: '/about' },
  { name: 'Settings', icon: HiOutlineCog, to: '/settings' }
]

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const { user } = useAuth()
  const { logout } = useAuthActions()

  // Get user info from the user object (from authStore)
  const userName = user?.name ?? user?.email ?? 'User'
  const userEmail = user?.email
  const userPicture = (user as Record<string, unknown>)?.picture as string | undefined

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userMenuOpen])

  return (
    <div className={styles.layout}>
      {/* Mobile hamburger button */}
      <button
        type="button"
        className={styles.hamburger}
        aria-label="Open sidebar menu"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <HiOutlineMenu size={24} />
      </button>

      {/* Mobile sidebar using Headless UI Dialog */}
      <Dialog
        open={mobileSidebarOpen}
        onClose={setMobileSidebarOpen}
        className="fixed inset-0 z-50 md:hidden"
        aria-label="Primary Navigation"
      >
        {/* Backdrop with transition */}
        <Transition
          as={Fragment}
          show={mobileSidebarOpen}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/40 -z-10" />
        </Transition>

        {/* Sidebar panel with slide transition */}
        <Transition
          as={Fragment}
          show={mobileSidebarOpen}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <DialogPanel className={`${styles.sidebar} flex flex-col w-64 h-full overflow-y-auto`}>
            <div
              className={styles.logo}
              onClick={() => {
                setCollapsed(!collapsed)
                setMobileSidebarOpen(false)
              }}
              role="button"
              tabIndex={0}
              aria-pressed={collapsed}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setCollapsed(!collapsed)
                  setMobileSidebarOpen(false)
                }
              }}
            >
              <img alt="" src="/favicon.png" className={styles.logo__image} />
              <span className={styles.logo__text}>My App</span>
            </div>

            <ul className={styles.nav}>
              {navItems.map(({ name, icon: Icon, to }) => (
                <li key={name} className={styles.nav__item}>
                  <Link to={to} className={styles.nav__link} onClick={() => setMobileSidebarOpen(false)}>
                    <div className={styles.nav__content}>
                      <Icon className={styles.nav__icon} aria-hidden="true" />
                      <span className={styles.nav__label}>{name}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </DialogPanel>
        </Transition>
      </Dialog>

      {/* Desktop sidebar */}
      <nav
        className={clsx(styles.sidebar, collapsed && styles['sidebar--collapsed'], 'hidden md:flex flex-col')}
        aria-label="Primary Navigation"
      >
        <div
          className={styles.logo}
          onClick={() => setCollapsed(!collapsed)}
          role="button"
          tabIndex={0}
          aria-pressed={collapsed}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setCollapsed(!collapsed)
            }
          }}
        >
          <img alt="" src="/favicon.png" className={styles.logo__image} />
          <span className={styles.logo__text}>My App</span>
        </div>
        <ul className={styles.nav}>
          {navItems.map(({ name, icon: Icon, to }) => (
            <li key={name}>
              <Link to={to} className={styles.nav__link} activeOptions={{ exact: true }}>
                <div className={styles.nav__content}>
                  <Icon className={styles.nav__icon} aria-hidden="true" />
                  <span className={styles.nav__label}>{name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.breadcrumbs}>
            <BreadcrumbsRenderer />
          </div>
          <div ref={userMenuRef} className="relative">
            <button
              className={`${styles['button--avatar']} cursor-pointer`}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label="User menu"
              onClick={() => setUserMenuOpen((v) => !v)}
            >
              {userPicture ? (
                <img
                  src={userPicture}
                  alt={userName ? `${userName} avatar` : 'User avatar'}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className={styles.avatar} />
              )}
            </button>
            {userMenuOpen && (
              <div
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-64 rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{userName ?? 'User'}</p>
                  {userEmail && <p className="text-xs text-gray-500 truncate mt-1">{userEmail}</p>}
                </div>
                <button
                  type="button"
                  role="menuitem"
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setUserMenuOpen(false)
                    // Trigger logout
                    logout()
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <section className={styles.content}>
          <div className={styles.content__inner}>
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  )
}
