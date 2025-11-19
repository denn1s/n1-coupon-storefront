import { createRootRouteWithContext, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import MainLayout from '@layouts/Main'
import PublicLayout from '@layouts/Public'

import type { QueryClient } from '@tanstack/react-query'

export interface RouterContext {
  queryClient: QueryClient
}

const RootComponent = () => {
  const location = useLocation()
  const pathname = location.pathname
  // Paths that use PublicLayout (simple navbar layout)
  // Note: /my-coupons still requires auth via route's beforeLoad
  const publicPaths = ['/', '/login', '/products', '/my-coupons']
  const isPublic = publicPaths.includes(pathname) || publicPaths.some((p) => p !== '/' && pathname.startsWith(`${p}/`))

  return (
    <>
      {isPublic ? (
        <PublicLayout>
          <Outlet />
        </PublicLayout>
      ) : (
        <MainLayout />
      )}
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  onError: ({ error }) => {
    // Log the error
    console.error('[Router] error', error)
  },
  errorComponent: ({ error, reset }) => {
    // Render an error message
    return (
      <div>
        Error
        {error.message}
        <button
          onClick={() => {
            // Reset the router error boundary
            reset()
          }}
        >
          retry
        </button>
      </div>
    )
  }
})
