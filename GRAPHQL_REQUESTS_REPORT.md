# GraphQL Requests Report

## Findings

Based on the analysis of the network requests on the home page, the following observations were made:

1.  **Initial GraphQL Requests:** Upon loading the home page, the application initiates three GraphQL queries:

    - `HoldingBusinessCategories`
    - `HoldingStores`
    - `HoldingProducts`

2.  **Request Cancellation and Duplication:** Immediately following the initial requests, the same three requests are aborted and then re-fetched successfully. This results in a total of six GraphQL requests on the initial load (three aborted, three successful).

## Speculation and Possible Improvements

The "signal is aborted without reason" error and the duplicated requests are likely caused by the interaction between TanStack Query and TanStack Router's `loader` functions. Here's a possible scenario:

1.  The `loader` function in `src/routes/index.tsx` initiates the `categoriesOptions` and `storesOptions` queries.
2.  The `ProductsPage` component (or another component) simultaneously calls the `useGetProducts` hook.
3.  A rapid re-render or component unmount/remount occurs, causing TanStack Query to cancel the initial, in-flight requests.
4.  The components then re-mount and trigger the queries again, which succeed.

This behavior, while not necessarily a critical bug, is inefficient and can lead to a perception of slowness.

### Recommendations

1.  **Consolidate Data Fetching in the Router `loader`:** To avoid the race condition and unnecessary re-fetches, consolidate all initial data fetching into the `loader` function for the route. This ensures that all required data is fetched _before_ the component renders, preventing the component from initiating its own requests that might get cancelled.

    For example, in `src/routes/index.tsx`, you can add the `productsOptions` to the `loader`:

    ```typescript
    // src/routes/index.tsx
    import { createFileRoute } from '@tanstack/react-router'
    import { categoriesOptions, storesOptions, productsOptions } from '@services/holding.graphql'

    export const Route = createFileRoute('/')({
      loader: ({ context }) => {
        return Promise.all([
          context.queryClient.ensureQueryData(categoriesOptions({ first: 50 })),
          context.queryClient.ensureQueryData(storesOptions({ first: 50 })),
          context.queryClient.ensureQueryData(productsOptions({ first: 20 })) // Adjust 'first' as needed
        ])
      },
      component: HomePage
    })
    ```

2.  **Remove Data Fetching from Components on Initial Load:** Once the data is being pre-fetched by the router, you can remove the corresponding `useQuery` calls from the components that are rendered on the initial load. The components can then get the data from the `useRoute` hook or by using the same query key with `useQuery`, which will retrieve the data from the cache.

By implementing these changes, you can ensure that the data is fetched only once, eliminating the aborted requests and improving the initial load performance of the application.
