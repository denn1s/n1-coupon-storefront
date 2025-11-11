import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import type { QueryClient } from '@tanstack/react-query'

type QueryProviderProps = {
  queryClient: QueryClient
  children: React.ReactNode
}

export default function QueryProvider({ queryClient, children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      {children}
    </QueryClientProvider>
  )
}
