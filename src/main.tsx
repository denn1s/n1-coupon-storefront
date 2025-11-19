// import { scan } from 'react-scan'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import App from './App'
import './styles/global.css'

import { routeTree } from './routeTree.gen'

const noRetryStatuses = [400, 401, 403, 404]

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not retry on 403; otherwise keep a small retry count
      retry: (failureCount, error) => {
        const status = (error as { status?: number })?.status
        if (status && noRetryStatuses.includes(status)) return false
        return failureCount < 3
      },
      // Do not throw on error; let components handle error states (including 403)
      throwOnError: false
    },
    mutations: {
      retry: (failureCount, error) => {
        const status = (error as { status?: number })?.status
        if (status && noRetryStatuses.includes(status)) return false
        return failureCount < 3
      },
      // Do not throw on error by default; callers can handle errors explicitly
      throwOnError: false
    }
  }
})
const router = createRouter({
  routeTree,
  context: {
    queryClient
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  // Debounce preloading by 300ms to avoid accidental triggers
  defaultPreloadDelay: 300,
  scrollRestoration: true
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Activate react scan
/*
scan({
  enabled: import.meta.env.DEV,
})
*/

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  // Use App.tsx to add global providers
  root.render(
    <React.StrictMode>
      <App queryClient={queryClient}>
        <RouterProvider router={router} />
      </App>
    </React.StrictMode>
  )
}
