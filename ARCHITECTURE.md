# Architecture Documentation

This document provides a deep dive into the architecture, design decisions, and patterns used in the TanStack Admin Template.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture Decisions](#architecture-decisions)
- [Project Structure](#project-structure)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Routing Architecture](#routing-architecture)
- [API Integration](#api-integration)
- [Component Architecture](#component-architecture)
- [Styling Architecture](#styling-architecture)
- [Build and Deployment](#build-and-deployment)

## Overview

The TanStack Admin Template is a production-ready React starter template built with modern web technologies. It emphasizes:

- **Type Safety**: TypeScript throughout the codebase
- **Developer Experience**: Fast refresh, hot reload, automated tooling
- **Performance**: Code splitting, lazy loading, optimized builds
- **Maintainability**: Atomic design, clear separation of concerns
- **Scalability**: Modular architecture, reusable patterns

## Technology Stack

### Core

- **React 19** - UI library with latest features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool with HMR

### Routing & Data Fetching

- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Server state management and data fetching
- **TanStack Form** - Type-safe form handling

### UI & Styling

- **DaisyUI** - Component library built on Tailwind
- **Tailwind CSS v4** - Utility-first CSS framework
- **CSS Modules** - Scoped styles with `@apply` directive

### State Management

- **Zustand** - Lightweight global state management
- **TanStack Store** - Fine-grained reactive state (where needed)

### Authentication

- **Auth0** - Authentication and authorization platform
- **Custom Auth Context** - Application-specific auth logic

### Development Tools

- **Vitest** - Fast unit testing
- **Testing Library** - User-centric component testing
- **Storybook 10** - Component documentation and development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

## Architecture Decisions

### Why TanStack Router over React Router?

**Decision**: Use TanStack Router

**Reasons**:

1. **Type Safety**: Full TypeScript support with type-safe params and search
2. **File-based Routing**: Automatic route generation from file structure
3. **Built-in Features**: Code splitting, prefetching, suspense out of the box
4. **Better DX**: Auto-generated route tree, no manual configuration

### Why TanStack Query for Data Fetching?

**Decision**: Use TanStack Query (React Query)

**Reasons**:

1. **Caching**: Automatic request deduplication and caching
2. **Background Updates**: Stale-while-revalidate pattern
3. **Error Handling**: Centralized error and retry logic
4. **DevTools**: Excellent debugging experience
5. **Optimistic Updates**: Easy optimistic UI updates

### Why CSS Modules with @apply over Inline Utilities?

**Decision**: Prefer CSS Modules with Tailwind `@apply`

**Reasons**:

1. **Maintainability**: Complex styles are easier to read in CSS files
2. **Reusability**: Styles can be composed and extended
3. **Performance**: No runtime class concatenation
4. **Organization**: Co-located with components
5. **Type Safety**: CSS Modules provide TypeScript types

Example:

```css
/* Button.module.css */
@reference "tailwindcss";

.button {
  @apply rounded-xl px-4 py-2 font-semibold;
  @apply transition-colors duration-200;
}
```

### Why Zustand over Redux?

**Decision**: Use Zustand for global state

**Reasons**:

1. **Simplicity**: Minimal boilerplate
2. **Performance**: No context provider, no re-renders
3. **TypeScript**: Excellent TypeScript support
4. **Flexibility**: Works with or without React
5. **Bundle Size**: Much smaller than Redux

### Why Auth0?

**Decision**: Use Auth0 for authentication

**Reasons**:

1. **Security**: Industry-standard security practices
2. **Features**: MFA, social login, passwordless out of the box
3. **Compliance**: SOC 2, GDPR, HIPAA compliant
4. **Scalability**: Handles millions of users
5. **DX**: Excellent SDKs and documentation

## Project Structure

```
src/
├── components/              # React components (Atomic Design)
│   ├── atoms/              # Basic building blocks
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   └── ...
│   ├── molecules/          # Simple compositions
│   ├── organisms/          # Complex components
│   ├── _layouts/           # Layout components
│   └── COMPONENTS.md       # Component documentation
│
├── pages/                  # Page components
│   ├── Items/
│   │   ├── ItemsPage.tsx
│   │   ├── ItemsPage.module.css
│   │   └── index.ts
│   └── ...
│
├── routes/                 # TanStack Router routes
│   ├── __root.tsx         # Root layout
│   ├── index.tsx          # Home page (/)
│   ├── items.tsx          # Items list (/items)
│   └── items/
│       └── $itemId.tsx    # Item detail (/items/:itemId)
│
├── services/               # API service hooks
│   ├── items.ts
│   └── ...
│
├── lib/
│   ├── api/               # API utilities
│   │   ├── queryFn.ts     # Query function builders
│   │   └── types.ts       # API type definitions
│   │
│   ├── auth/              # Authentication
│   │   ├── AuthContext.tsx
│   │   ├── AuthProvider.tsx
│   │   ├── AuthHandler.tsx
│   │   └── useResourcePermissions.ts
│   │
│   ├── helpers/           # Helper functions
│   │   ├── env.ts
│   │   └── ...
│   │
│   ├── hooks/             # Custom hooks
│   │   └── ...
│   │
│   └── stores/            # Zustand stores
│       ├── authStore.ts
│       └── breadStore.ts
│
└── styles/                # Global styles
    └── global.css
```

### Directory Organization Principles

1. **Co-location**: Related files live together (component, styles, tests, stories)
2. **Feature-based**: Group by feature/domain, not by file type
3. **Atomic Design**: Components organized by complexity (atoms → organisms)
4. **Separation of Concerns**: Clear boundaries between UI, business logic, and data

## Data Flow

### Request Flow Diagram

```
User Action
    ↓
Component
    ↓
TanStack Query Hook (useGetItems)
    ↓
Query Function Builder (getFn)
    ↓
Custom buildQueryFn (adds auth, headers, error handling)
    ↓
fetch API
    ↓
Backend API
    ↓
Response
    ↓
TanStack Query Cache
    ↓
Component Re-render
```

### Detailed Flow

1. **User Interaction**: User clicks button, submits form, etc.
2. **Component Event**: Event handler calls mutation or triggers query
3. **Query/Mutation Hook**: TanStack Query hook executes
4. **Query Function**: Custom query function builder creates fetch config
5. **Middleware**: `buildQueryFn` adds:
   - Authentication token
   - Headers (Content-Type, Accept)
   - Base URL construction
   - Error handling
   - Response parsing
6. **Network Request**: Fetch API makes HTTP request
7. **Backend Response**: API returns data or error
8. **Query Cache**: TanStack Query caches successful responses
9. **Component Update**: React re-renders with new data
10. **UI Update**: User sees updated interface

### Example: Creating an Item

```typescript
// 1. User clicks "Create Item" button
<button onClick={() => createMutation.mutate(formData)}>
  Create Item
</button>

// 2. Component calls mutation
const createMutation = useCreateItem()

// 3. Service hook (services/items.ts)
export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    // 4. Query function builder
    mutationFn: postFn<CreateItemRequest, Item>('/items'),

    // 5. Success handler
    onSuccess: (newItem) => {
      // 6. Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['items', 'list'] })

      // 7. Show success toast
      addToast({
        title: 'Item created',
        variant: 'success'
      })
    }
  })
}

// 8. buildQueryFn handles the request
// 9. Backend creates item and returns data
// 10. Query cache updates
// 11. Component re-renders with new data
```

## State Management

### State Categories

We use different state management solutions based on state type:

```
┌─────────────────────────────────────────────────────────┐
│                    State Categories                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Server State          →  TanStack Query                │
│  (API data)               - Automatic caching            │
│                          - Background updates            │
│                          - Error handling                │
│                                                          │
│  Global Client State   →  Zustand                       │
│  (auth, UI state)         - authStore                   │
│                          - breadStore                    │
│                                                          │
│  URL State             →  TanStack Router               │
│  (search, filters)        - Type-safe search params     │
│                          - Automatic sync                │
│                                                          │
│  Local Component State →  useState / useReducer         │
│  (form inputs, UI)        - React built-ins             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Server State (TanStack Query)

**Use for**: API data, remote resources

**Example**:

```typescript
// Reading
const { data, isLoading, error } = useGetItems()

// Writing
const createMutation = useCreateItem()
createMutation.mutate(formData)
```

**Benefits**:

- Automatic caching and deduplication
- Background refetching
- Optimistic updates
- Request cancellation

### Global Client State (Zustand)

**Use for**: Auth state, global UI state, cross-component data

**Example**:

```typescript
// authStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null })
}))

// In component
const { token, user } = useAuthStore()
```

**Benefits**:

- No provider needed
- No unnecessary re-renders
- Simple API
- TypeScript support

### URL State (TanStack Router)

**Use for**: Filters, pagination, search queries

**Example**:

```typescript
// In route
export const Route = createFileRoute('/items')({
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
    search: String(search.search || '')
  })
})

// In component
const { page, search } = Route.useSearch()
const navigate = useNavigate()

// Update URL
navigate({
  search: { page: 2, search: 'query' }
})
```

**Benefits**:

- Shareable URLs
- Browser back/forward support
- Type-safe parameters

### Local Component State (React)

**Use for**: Form inputs, toggles, temporary UI state

**Example**:

```typescript
const [isOpen, setIsOpen] = useState(false)
const [formData, setFormData] = useState({ name: '', email: '' })
```

## Authentication Flow

### Login Flow

```
User clicks "Login"
    ↓
Redirect to Auth0 Universal Login
    ↓
User enters credentials
    ↓
Auth0 validates credentials
    ↓
Redirect back to app with code
    ↓
AuthHandler component intercepts
    ↓
Exchange code for tokens
    ↓
Decode JWT for user info and permissions
    ↓
Store in authStore (Zustand)
    ↓
Store token in localStorage (optional)
    ↓
Redirect to protected route
    ↓
App renders with user context
```

### Authentication Architecture

```typescript
// 1. Auth0Provider wraps entire app
<Auth0Provider {...config}>
  <AuthProvider>
    <App />
  </AuthProvider>
</Auth0Provider>

// 2. AuthProvider adds custom logic
// - Extracts permissions from JWT
// - Syncs with authStore
// - Handles token refresh

// 3. AuthHandler intercepts callback
// - Handles OAuth redirect
// - Exchanges code for token
// - Redirects to app

// 4. authStore holds auth state
// - token: string | null
// - user: User | null
// - permissions: string[]

// 5. Protected routes check auth
// - Public routes: /, /login, /signup
// - Protected routes: All others
```

### Permission System

```typescript
// 1. Permissions stored in JWT
{
  "permissions": [
    "read:items",
    "write:items",
    "delete:items"
  ]
}

// 2. Resource-specific hooks
const { canRead, canWrite, canDelete } = useItemsPermissions()

// 3. UI conditional rendering
{canWrite && (
  <button onClick={handleEdit}>Edit</button>
)}

// 4. Route-level protection (future)
// Can add permission checks to routes
```

## Routing Architecture

### File-based Routing

TanStack Router uses file structure to generate routes:

```
src/routes/
  __root.tsx          →  /              (layout)
  index.tsx           →  /              (page)
  about.tsx           →  /about
  items.tsx           →  /items
  items/
    index.tsx         →  /items         (redirect or default)
    $itemId.tsx       →  /items/:itemId
  settings.tsx        →  /settings      (layout)
  settings/
    profile.tsx       →  /settings/profile
    general.tsx       →  /settings/general
```

### Route Configuration

```typescript
// __root.tsx - Root layout
export const Route = createRootRoute({
  component: RootLayout
})

// Determines public vs protected routes
const isPublicRoute = ['/', '/login', '/signup'].includes(pathname)
```

### Layouts

- **Public routes** (`/`, `/login`, `/signup`) → `PublicLayout`
- **Protected routes** (all others) → `MainLayout` (with sidebar, header, auth)

### Navigation

```typescript
// Declarative
<Link to="/items/$itemId" params={{ itemId: '123' }}>
  View Item
</Link>

// Programmatic
const navigate = useNavigate()
navigate({ to: '/items/$itemId', params: { itemId: '123' } })
```

### Code Splitting

TanStack Router automatically code-splits by route with `autoCodeSplitting: true` in config.

## API Integration

### Query Function Builders

Custom builders abstract fetch logic:

```typescript
// lib/api/queryFn.ts

/**
 * GET request builder
 */
export const getFn = <T>(url: string, params?: object) => {
  return buildQueryFn<T>({ url, method: 'GET', params })
}

/**
 * POST request builder
 */
export const postFn = <TRequest, TResponse>(url: string) => {
  return (data: TRequest) => buildQueryFn<TResponse>({ url, method: 'POST', body: data })
}

/**
 * Core query function with middleware
 */
const buildQueryFn = async <T>(config: RequestConfig): Promise<T> => {
  // 1. Get auth token
  const { token } = useAuthStore.getState()

  // 2. Build full URL
  const fullUrl = `${API_HOST}${API_MOUNT}${config.url}`

  // 3. Add headers
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }

  // 4. Make request
  const response = await fetch(fullUrl, {
    method: config.method,
    headers,
    body: config.body ? JSON.stringify(config.body) : undefined
  })

  // 5. Handle errors
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  // 6. Parse response
  return response.json()
}
```

### Service Layer Pattern

```typescript
// services/items.ts

import { getFn, postFn, patchFn, deleteFn } from '@lib/api/queryFn'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Get all items
 */
export const useGetItems = (params = {}) => {
  return useQuery({
    queryKey: ['items', 'list', params],
    queryFn: getFn<ItemsResponse>('/items', params)
  })
}

/**
 * Get single item by ID
 */
export const useGetItem = (id: string) => {
  return useQuery({
    queryKey: ['items', 'detail', id],
    queryFn: getFn<Item>(`/items/${id}`)
  })
}

/**
 * Create item
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postFn<CreateItemRequest, Item>('/items'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', 'list'] })
      addToast({ title: 'Item created', variant: 'success' })
    }
  })
}

/**
 * Update item
 */
export const useUpdateItem = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patchFn<UpdateItemRequest, Item>(`/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['items', 'detail', id] })
      addToast({ title: 'Item updated', variant: 'success' })
    }
  })
}

/**
 * Delete item
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFn(`/items/{id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', 'list'] })
      addToast({ title: 'Item deleted', variant: 'success' })
    }
  })
}
```

## Component Architecture

### Atomic Design

Components are organized by complexity:

```
Atoms (Smallest)
├─ Button
├─ Input
├─ Checkbox
└─ Spinner

Molecules (Combinations)
├─ FormField (Label + Input + Error)
├─ SearchBar (Input + Icon + Clear)
└─ TableHeader (Multiple columns)

Organisms (Complex)
├─ Table (Header + Body + Footer + Pagination)
├─ Navigation (Logo + Menu + User dropdown)
└─ DataTable (Search + Filters + Table + Pagination)

Layouts (Structure)
├─ MainLayout (Header + Sidebar + Content)
└─ PublicLayout (Centered content)
```

### Component Lifecycle

```typescript
// 1. Component file
export default function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}

// 2. Tests
describe('Button', () => {
  it('calls onClick when clicked', () => {
    // Test implementation
  })
})

// 3. Stories
export const Primary: Story = {
  args: { children: 'Click me', variant: 'primary' }
}

// 4. Documentation (COMPONENTS.md)
# Button

## Props
- children: ReactNode
- variant: 'primary' | 'secondary'
- onClick: () => void
```

## Styling Architecture

### CSS Modules + Tailwind @apply

```css
/* Component.module.css */
@reference "tailwindcss";

/* Base styles */
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Variants */
.containerNarrow {
  @apply max-w-3xl;
}

/* Responsive */
.grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* States */
.button {
  @apply px-4 py-2 rounded-lg;
  @apply transition-colors duration-200;
}

.buttonPrimary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.buttonDisabled {
  @apply opacity-50 cursor-not-allowed;
}
```

### DaisyUI Components

Use DaisyUI classes directly when appropriate:

```tsx
// Use DaisyUI button classes
<button className="btn btn-primary">Click me</button>

// Or custom styles
<button className={styles.customButton}>Custom</button>
```

### Global Styles

```css
/* styles/global.css */
@import 'tailwindcss';

/* CSS variables for theming */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}

/* Global resets */
* {
  box-sizing: border-box;
}

/* Utility classes */
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Build and Deployment

### Development Build

```bash
npm run dev
```

**Process**:

1. Vite starts dev server on port 3000
2. HMR enabled for instant updates
3. Source maps for debugging
4. No minification for faster builds

### Production Build

```bash
npm run build
```

**Process**:

1. TypeScript type checking (`tsc -b`)
2. Vite build process:
   - Tree shaking
   - Code splitting (automatic per route)
   - Minification (terser)
   - Asset optimization
   - Source map generation
3. Output to `dist/` directory

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true // Automatic code splitting
    }),
    react(),
    tailwindcss(),
    // Bundle analyzer (optional)
    visualizer({
      /* config */
    })
  ],
  build: {
    target: 'esnext' // Modern browsers only
    // Vite handles code splitting automatically
  }
})
```

### Deployment

**Recommended Platforms**:

- Vercel (automatic Next.js-style deployment)
- Netlify (SPA with redirects)
- AWS S3 + CloudFront
- Docker container

**Environment Variables**:

```bash
VITE_AUTH_DOMAIN=your-auth0-domain
VITE_AUTH_CLIENT_ID=your-client-id
VITE_AUTH_REDIRECT_URI=https://yourdomain.com
VITE_AUTH_AUDIENCE=your-api-audience
VITE_API_HOST=https://api.yourdomain.com
VITE_API_MOUNT=/api/v1
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint-and-test:
    - Run type checking
    - Run ESLint
    - Run Prettier
    - Run tests

  build:
    - Build application
    - Upload artifacts

  build-storybook:
    - Build Storybook
    - Upload artifacts
```

## Performance Considerations

### Code Splitting

- **Route-based**: Automatic with TanStack Router
- **Component-based**: Use React.lazy() for heavy components

### Caching Strategy

- **TanStack Query**: 5-minute default stale time
- **Service Worker**: Can add for offline support
- **Browser Caching**: Configured in deployment

### Bundle Size

- Monitor with `npm run analyze`
- Target: < 200KB initial bundle
- Lazy load heavy dependencies

### Runtime Performance

- React 19 concurrent features
- Virtual scrolling for long lists (if needed)
- Memoization for expensive computations

---

**Last Updated**: 2025-11-08
**Version**: 1.0.0
