import { createRootRouteWithContext, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import MainLayout from '@layouts/Main'
import PublicLayout from '@layouts/Public'
import { ErrorPage } from '@pages/ErrorPage'

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
    // Show detailed error information in development mode
    const showDetails = import.meta.env.DEV

    return <ErrorPage error={error} reset={reset} showDetails={showDetails} />
  }
})
