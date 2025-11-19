# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Project Overview

This is the **N1 Coupon Storefront** - a modern coupon and deals marketplace platform similar to Groupon. It features a complete e-commerce experience for browsing and purchasing coupon deals, built with a robust authentication system, modern routing, efficient data fetching patterns (including GraphQL), and a complete component architecture following atomic design principles.

### Key Features

#### Platform Features

- 🎟️ Coupon marketplace for browsing and purchasing deals
- 🛍️ Shopping cart and checkout experience
- 💳 Payment processing integration
- 📱 Responsive design for mobile and desktop
- 🔍 Search and filtering by category, location, and price

#### Technical Features

- 🔐 Auth0 authentication with role-based permissions
- 🧭 File-based routing with TanStack Router
- 🔄 Data fetching with TanStack Query (React Query)
- 🌐 **GraphQL support** with cursor-based pagination for product catalog
- 🎨 UI components with DaisyUI
- 💅 Styling with Tailwind CSS + CSS Modules
- 📝 Form handling with TanStack Form + Zod validation
- 🏪 State management with TanStack Store
- 📦 Built with Vite for optimal developer experience
- 🔧 TypeScript for type safety

## 🤖 AI Agents & Development Workflow

This project includes **specialized AI agents** to help maintain consistency and best practices. Before working on any feature, consult the appropriate agent:

### Quick Agent Reference

- **Creating components?** → Read `src/components/COMPONENTS.md` FIRST, then consider the `.claude/components-styling-agent.md`
- **Building API services?** → Consider the `.claude/services-agent.md`
- **Adding pages/routes?** → Consider the `.claude/pages-routes-agent.md`
- **Writing tests?** → Consider the `.claude/testing-agent.md`
- **Documenting components?** → Consider the `.claude/storybook-agent.md`

### ⚠️ Critical: Component Creation Priority

**ALWAYS follow this workflow when creating components:**

1.  **Check `src/components/COMPONENTS.md`** - Component already exists?
2.  **Search filesystem** - Similar component in `src/components/`?
3.  **Check DaisyUI** - Does DaisyUI provide this component?
4.  **Create new component** - Only if none exist:
    - Write component with TypeScript props
    - Create CSS Module with @apply
    - Write tests (\*.test.tsx)
    - Write Storybook story (\*.stories.tsx)
    - **Update COMPONENTS.md** (required!)

📚 **Full agent documentation**: See `.claude/claude-agents.md` for comprehensive guide

## Development Commands

**Package Manager**: This project **exclusively uses bun** for package management and running scripts.

### Essential Commands

```bash
# Install dependencies
bun install

# Development server (runs on http://localhost:3000)
bun run dev

# Build for production
bun run build

# Build for development environment
bun run build:dev

# Run tests (single run)
bun test

# Run tests in watch mode
bun test-watch

# Lint code
bun run lint

# Preview production build
bun run preview

# Run Storybook (on port 6006)
bun run storybook

# Build Storybook
bun run build-storybook
```

### Running Tests

- Tests use **Vitest** with **jsdom** environment
- Test files: `*.test.ts` or `*.test.tsx` in `src/**/*.test.{ts,tsx}`
- Setup file: `src/setupTests.ts`

## 🚨 CRITICAL: Tailwind CSS v4 Compatibility

**This project uses Tailwind CSS v4**, which has **breaking changes** with DaisyUI classes and semantic colors when used with `@apply` in CSS Modules.

### ❌ DO NOT Use These With @apply:

1.  **DaisyUI Component Classes**: `btn`, `card`, `badge`, `card-body`, `card-title`, etc.
2.  **DaisyUI Semantic Colors**: `text-primary`, `text-error`, `text-success`, `text-base-content`, `bg-base-100`, `bg-base-200`, `border-base-300`, etc.
3.  **Opacity Modifiers on DaisyUI Colors**: `text-base-content/60`, `bg-warning/20`, etc.
4.  **Old Animation Classes**: `animate-in`, `fade-in`, `zoom-in`, etc.
5.  **Old Opacity Syntax**: `bg-opacity-50` (use `bg-black/50` instead)

### ✅ DO Use Standard Tailwind Utilities:

Replace DaisyUI classes with raw Tailwind utilities:

```css
/* ❌ WRONG */
.button {
  @apply btn btn-primary;
}

/* ✅ CORRECT */
.button {
  @apply px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors;
}
```

**See `.claude/components-styling-agent.md`** for complete color mapping reference and replacement patterns.

## Architecture Overview

### Core Technology Stack

- **Build Tool**: Vite with React plugin
- **Router**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack Query (React Query) with custom query builders
- **GraphQL**: graphql-request for GraphQL operations
- **Auth**: Token-based authentication with TanStack Store
- **UI Framework**: DaisyUI component library
- **Styling**: Tailwind CSS (primary) + CSS Modules (complex styles)
- **Forms**: TanStack Form with Zod validation
- **State Management**: TanStack Store for global state

### Path Aliases

Configured in `vite.config.ts` for clean imports:

- `@components` → `src/components`
- `@layouts` → `src/components/_layouts`
- `@pages` → `src/pages`
- `@routes` → `src/routes`
- `@lib` → `src/lib`
- `@auth` → `src/lib/auth`
- `@helpers` → `src/lib/helpers`
- `@types` → `src/lib/types`
- `@stores` → `src/lib/stores`
- `@services` → `src/services`
- `@styles` → `src/styles`

### Component Architecture (Atomic Design)

Components follow Atomic Design methodology:

- **`atoms/`**: Basic building blocks (Button, Checkbox, Dropdown, Spinner, etc.)
- **`molecules/`**: Simple component compositions (TableHeader, TableFooter, FilePicker)
- **`organisms/`**: Complex, reusable components (Table)
- **`_layouts/`**: Layout components (Main, Public)

Each component should:

- Live in its own directory
- Use PascalCase naming
- Include `.tsx` file, optional `.module.css`, and `index.ts` for exports
- Define typed props with `{ComponentName}Props` interface

### Routing Pattern (TanStack Router)

**File-based routing** in `src/routes/`:

```
src/routes/
  __root.tsx          # Root layout
  index.tsx           # Home page (//)
  about.tsx           # About page (/about)
  login.tsx           # Login page
  signup.tsx          # Signup page
  coupons.tsx         # Coupons list (/coupons)
  coupons/
    $couponId.tsx     # Coupon detail (/coupons/:couponId)
  cart.tsx            # Shopping cart
  checkout.tsx        # Checkout page
  orders.tsx          # User orders
  settings.tsx        # Settings parent route
  settings/
    profile.tsx       # User profile settings
```

**Key conventions:**

- Export a `Route` created with `createFileRoute`
- Use `<Link>` from `@tanstack/react-router` for navigation
- Use `useNavigate()` for programmatic navigation
- Dynamic routes: `$paramName.tsx` format
- Route tree auto-generated in `routeTree.gen.ts` (don't edit manually)

### Data Fetching Pattern (TanStack Query)

This template uses a **custom query function builder** pattern in `src/lib/api/queryFn.ts`:

#### API Query Pattern

```typescript
// In services file (e.g., src/services/coupons.ts)
import { getFn, postFn, patchFn, deleteFn } from '@lib/api/queryFn'
import { queryOptions, useQuery } from '@tanstack/react-query'

// Create query options
export const couponsOptions = (params = {})
queryOptions({
  queryKey: ['coupons', 'list', params],
  queryFn: getFn<CouponsResponse>('/coupons', params)
})

// Create custom hook
export const useGetCoupons = (params = {}) => {
  return useQuery(couponsOptions(params))
}
```

#### API Mutation Pattern

```typescript
export const usePurchaseCoupon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postFn<PurchaseCouponRequest, Order>('/orders'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      addToast({ title: 'Purchase successful!', variant: 'success' })
    }
  })
}
```

#### Query Key Structure

- Simple list: `['coupons', 'list']`
- With params: `['coupons', 'list', { category: 'food', minDiscount: 20 }]`
- Specific item: `['coupons', 'detail', couponId]`
- User orders: `['orders', 'list', userId]`
- Shopping cart: `['cart', userId]`

#### API Configuration

- Base URL: `VITE_API_HOST` + `VITE_API_MOUNT` + route
- Auth token automatically added from `authStore`
- Custom `buildQueryFn` handles headers, params, errors, logging

### GraphQL Integration (New!)

This template now supports **GraphQL** alongside REST APIs using `graphql-request` + TanStack Query.

#### GraphQL Query Pattern

```typescript
// In services file (e.g., src/services/products.graphql.ts)
import { graphqlQueryFn } from '@lib/api/graphqlFn'
import { queryOptions, useQuery } from '@tanstack/react-query'

const PRODUCTS_QUERY = `
  query HoldingProducts($first: Int, $after: String) {
    holdingProducts(first: $first, after: $after) {
      nodes { id name salePrice }
      totalCount
      pageInfo { hasNextPage endCursor }
    }
  }
`

const getProducts = (variables = {}) => graphqlQueryFn<ProductsVariables, ProductsResponse>(PRODUCTS_QUERY, variables)

export const useGetProducts = (variables = { first: 20 }) => {
  return useQuery({
    queryKey: ['products', 'list', variables],
    queryFn: getProducts(variables)
  })
}
```

#### Easy Cursor-Based Pagination

GraphQL services include pagination helpers for cursor-based pagination:

```typescript
export const useProductsPagination = (pageSize = 20) => {
  // Returns: data, totalCount, hasNextPage, hasPreviousPage, goToNextPage, goToPreviousPage
}

// In component
const { data, goToNextPage, hasNextPage } = useProductsPagination(20)
```

#### GraphQL Configuration

- Endpoint: `${VITE_API_HOST}/graphql`
- Custom headers: `X-App-Id: plazamalta` (mandatory), `Authorization: Bearer {token}` (optional)
- See `.claude/graphql-agent.md` for complete patterns

### Authentication & Authorization

**Custom Auth0 integration** with permission system:

- **Auth Context**: `src/lib/auth/AuthContext.tsx` - Auth state management
- **Auth Provider**: `src/lib/auth/AuthProvider.tsx` - Wraps Auth0 provider
- **Auth Handler**: `src/lib/auth/AuthHandler.tsx` - Handles auth flow
- **Auth Store**: `src/lib/stores/authStore.ts` - Zustand store for auth state

#### Permission System

Resource-specific permission hooks in `src/lib/auth/useResourcePermissions.ts`:

```typescript
const { canRead, canWrite, canDelete } = useCouponsPermissions()
const { canRead: canViewOrders } = useOrdersPermissions()
```

Use `useMultipleResourcePermissions()`, `useAnyPermission()`, `useAllPermissions()` for complex checks.

### Form Patterns

**TanStack Form** with Zod validation:

```typescript
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string()
})

const form = useForm({
  defaultValues: { name: '', description: '' },
  onSubmit: async ({ value }) => {
    await createItem(value)
  },
  validatorAdapter: zodValidator()
})
```

### Styling Conventions

**Preferred Approach: CSS Modules with @apply**

This project prefers CSS Modules with Tailwind's `@apply` directive over inline utility classes:

```css
/* Component.module.css */
@reference "tailwindcss";

.container {
  @apply flex flex-col gap-4 p-6;
}

.header {
  @apply flex justify-between items-center;
}

.title {
  @apply text-2xl font-semibold text-gray-900;
}

.button {
  @apply rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700;
}
```

```tsx
// Component.tsx
import styles from './Component.module.css'

export default function Component() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Title</h1>
        <button className={styles.button}>Action</button>
      </div>
    </div>
  )
}
```

**Key Points:**

- Use `.module.css` files for all component styles
- Use `@reference "tailwindcss"` at the top of CSS files
- Apply Tailwind utilities via `@apply` directive
- Use `camelCase` for CSS class names
- Keep styles co-located with components
- Use inline Tailwind classes only for DaisyUI classes or one-off overrides

**Example Structure:**

```
src/components/atoms/Card/
├── Card.tsx
├── Card.module.css
└── index.ts
```

### JavaScript/TypeScript Code Style

This project follows specific code style conventions for all JavaScript and TypeScript files:

#### Semicolons

**Never use semicolons** in JavaScript/TypeScript code:

```typescript
// ❌ WRONG
import React from 'react'
import styles from './Component.module.css'
const value = 'hello'

// ✅ CORRECT
import React from 'react'
import styles from './Component.module.css'
const value = 'hello'
```

#### Quotes

- **Single quotes** for JavaScript/TypeScript strings
- **Double quotes** for JSX attributes and HTML

```typescript
// ❌ WRONG
import styles from "./Component.module.css"
const message = "Hello world"
return <div className='container'>Hello</div>

// ✅ CORRECT
import styles from './Component.module.css'
const message = 'Hello world'
return <div className="container">Hello</div>
```

#### Enforcement & Auto-formatting

These rules are automatically enforced by:

- **ESLint** (`eslint.config.js`): `semi: ['error', 'never']`, `jsx-quotes: ['error', 'prefer-double']`
- **Prettier** (`.prettierrc`): `"semi": false`, `"singleQuote": true`, `"jsxSingleQuote": false`

To automatically fix all files: `bun run lint --fix`

### Global State (Zustand)

Located in `src/lib/stores/`:

- `authStore.ts`: Authentication state (token, user, permissions)
- `breadStore.ts`: Breadcrumb navigation state

### Toast Notifications

```typescript
import { addToast } from './lib/toasts'

addToast({
  title: 'Success',
  description: 'Operation completed',
  variant: 'success' // or 'error', 'warning', 'info'
})
```

### Environment Variables

All prefixed with `VITE_`:

- `VITE_AUTH_REDIRECT_URI`: Auth0 redirect URI
- `VITE_AUTH_DOMAIN`: Auth0 domain
- `VITE_AUTH_CLIENT_ID`: Auth0 client ID
- `VITE_AUTH_AUDIENCE`: Auth0 API audience
- `VITE_API_HOST`: Backend API host
- `VITE_API_MOUNT`: API mount path (e.g., `/api/v1`)

Access via `import.meta.env.VITE_*` or `getEnv()` helper from `@lib/helpers/env`

## Example Implementation Guide

### Adding a New Feature (Example: Merchant Reviews)

1.  **Define types** in `src/lib/api/types.ts`:

```typescript
export interface Review {
  id: string
  merchantId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
}
```

2.  **Create service** in `src/services/reviews.ts`:

```typescript
import { getFn, postFn, patchFn, deleteFn } from '@lib/api/queryFn'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useGetMerchantReviews = (merchantId: string) => {
  return useQuery({
    queryKey: ['reviews', 'merchant', merchantId],
    queryFn: getFn<Review[]>(`/merchants/${merchantId}/reviews`)
  })
}
```

3.  **Create route** `src/routes/merchants/$merchantId/reviews.tsx` (adjust as per actual routing needs):

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { MerchantReviewsPage } from '@pages/MerchantReviews'

export const Route = createFileRoute('/merchants/$merchantId/reviews')({
  component: MerchantReviewsPage
})
```

4.  **Create page** `src/pages/MerchantReviews/MerchantReviewsPage.tsx` (adjust as per actual routing needs):

```typescript
import { useParams } from "@tanstack/react-router" // Assuming useParams is from TanStack Router
import { useGetMerchantReviews } from "@services/reviews" // Adjust import path as needed

export default function MerchantReviewsPage() {
  const { merchantId } = useParams()
  const { data, isLoading } = useGetMerchantReviews(merchantId)

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Merchant Reviews</h1>
      {/* ... */}
    </div>
  )
}
```

5.  **Export page** in `src/pages/MerchantReviews/index.ts`:

```typescript
export { default as MerchantReviewsPage } from './MerchantReviewsPage'
```

## Important Development Patterns

### Services Layer

All API interactions centralized in `src/services/`:

- Each resource gets its own file
- Export custom hooks for queries and mutations
- Handle query invalidation in mutation `onSuccess`

### Type Definitions

- API types in `src/lib/api/types.ts`
- Component prop types inline or separate `.d.ts`
- Never use `any` - prefer `unknown` if type is truly unknown

### Error Handling

- React Query handles errors automatically
- Use `isError` and `error` from query/mutation hooks
- Display errors with toast notifications or error components
- `throwOnError: false` configured globally

### Testing

- Use `@testing-library/react` for component tests
- Use `@testing-library/user-event` for interactions
- Storybook available for component development
- Co-locate test files with components

## Key Project Conventions

1.  **Always use path aliases** instead of relative imports
2.  **Follow Atomic Design** for component organization
3.  **Use custom API query builders** (`getFn`, `postFn`, etc.) for all API calls
4.  **Create service functions** for API interactions, don't call API directly from components
5.  **Use permission hooks** to control UI based on user permissions
6.  **Invalidate queries** after mutations to keep data fresh
7.  **Use DaisyUI components** for consistency
8.  **Show toasts** for user feedback on mutations
9.  **Handle loading and error states** using React Query states
10. **Use TypeScript strictly** - enable type checking everywhere
11. **No semicolons** - Never use semicolons in JavaScript/TypeScript
12. **Single quotes in JS, double quotes in JSX** - Follow quote conventions consistently
13. **Use CSS Modules for styling** - Prefer CSS Modules with `@apply` over inline Tailwind classes.

## Getting Started

1.  **Clone and install** (using **bun**):

```bash
git clone <repo-url>
cd n1-coupon-storefront
bun install
```

2.  **Set up environment variables**:

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3.  **Configure Auth0**:

- Create Auth0 application
- Add environment variables
- Configure callback URLs

4.  **Start development** (using **bun**):

```bash
bun run dev
```

5.  **Start customizing**:

- Review the coupon marketplace architecture
- Explore GraphQL integration for product catalog
- Build new features like merchant reviews, favorites, etc.
- Customize the storefront for your brand!

## Project Structure

```
src/
├── components/          # Atomic design components
│   ├── atoms/          # Basic components
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex components
│   └── _layouts/       # Layout components
├── pages/              # Page components
├── routes/             # TanStack Router files
├── services/           # API service hooks
├── lib/
│   ├── api/           # API utilities and types
│   ├── auth/          # Authentication
│   ├── helpers/       # Helper functions
│   ├── hooks/         # Custom hooks
│   └── stores/        # Zustand stores
└── styles/            # Global styles
```

## Additional Resources

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [DaisyUI Docs](https://daisyui.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)
