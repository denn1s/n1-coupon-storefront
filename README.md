# N1 Coupon Storefront

A modern coupon and deals marketplace platform built with React and cutting-edge technologies. Similar to Groupon, this application provides a complete storefront for browsing, purchasing, and managing coupon deals.

## ✨ Features

### Core Platform Features
- **🎟️ Coupon Marketplace** - Browse and purchase deals from various merchants
- **🛍️ Shopping Cart** - Full e-commerce checkout experience
- **💳 Payment Integration** - Secure payment processing
- **📱 Responsive Design** - Optimized for mobile and desktop
- **🔍 Search & Filter** - Find deals by category, location, and price

### Technical Features
- **🔐 Auth0 Authentication** - Complete auth system with role-based permissions
- **🧭 File-based Routing** - TanStack Router for type-safe, file-based routing
- **🔄 Data Fetching** - TanStack Query (React Query) with custom query builders
- **🌐 GraphQL Integration** - Efficient data fetching with cursor-based pagination
- **🎨 UI Components** - DaisyUI component library for beautiful interfaces
- **💅 Modern Styling** - Tailwind CSS + CSS Modules for flexible styling
- **📝 Form Management** - TanStack Form with Zod validation
- **🏪 State Management** - TanStack Store for lightweight global state
- **📦 Vite Build Tool** - Lightning-fast HMR and optimized builds
- **🔧 TypeScript** - Full type safety across the application
- **🧪 Testing Setup** - Vitest + Testing Library ready to go
- **📚 Storybook** - Component development and documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Auth0 account (for authentication)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd n1-coupon-storefront

# Install dependencies (use bun if available, npm otherwise)
bun install  # or npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Auth0 Configuration
VITE_AUTH_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH_CLIENT_ID=your-auth0-client-id
VITE_AUTH_REDIRECT_URI=http://localhost:3000
VITE_AUTH_AUDIENCE=your-api-audience

# API Configuration
VITE_API_HOST=https://api.example.com
VITE_API_MOUNT=/api/v1
```

### Development

```bash
# Start development server
bun run dev  # or npm run dev

# Open http://localhost:3000
```

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive guide for Claude Code and developers
- **[Architecture](#architecture)** - Learn about the project structure
- **[Examples](#examples)** - See implementation examples

## 🏗️ Architecture

### Technology Stack

| Category      | Technology                 |
| ------------- | -------------------------- |
| Build Tool    | Vite                       |
| Framework     | React 18                   |
| Language      | TypeScript                 |
| Routing       | TanStack Router            |
| Data Fetching | TanStack Query             |
| UI Library    | DaisyUI                    |
| Styling       | Tailwind CSS + CSS Modules |
| Forms         | TanStack Form + Zod        |
| Auth          | Auth0                      |
| State         | Zustand                    |
| Testing       | Vitest + Testing Library   |

### Project Structure

```
src/
├── components/          # UI components (Atomic Design)
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Simple composites
│   ├── organisms/      # Complex components
│   └── _layouts/       # Layout components
├── pages/              # Page components
├── routes/             # Route definitions
├── services/           # API service layer
├── lib/
│   ├── api/           # API utilities & types
│   ├── auth/          # Authentication
│   ├── helpers/       # Helper functions
│   ├── hooks/         # Custom React hooks
│   └── stores/        # Global state stores
└── styles/            # Global styles
```

### Path Aliases

```typescript
@components  →  src/components
@layouts     →  src/components/_layouts
@pages       →  src/pages
@routes      →  src/routes
@lib         →  src/lib
@auth        →  src/lib/auth
@helpers     →  src/lib/helpers
@types       →  src/lib/types
@stores      →  src/lib/stores
@services    →  src/services
@styles      →  src/styles
```

## 📝 Examples

### Creating a New Resource

#### 1. Define Types (`src/lib/api/types.ts`)

```typescript
export interface Coupon {
  id: string
  title: string
  description: string
  originalPrice: number
  salePrice: number
  discount: number
  merchantName: string
  category: string
  expiresAt: string
}

export interface CouponsResponse extends PaginatedResponse<Coupon> {}
```

#### 2. Create Service (`src/services/coupons.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFn, postFn, patchFn, deleteFn } from '@lib/api/queryFn'

export const useGetCoupons = (params = {}) => {
  return useQuery({
    queryKey: ['coupons', 'list', params],
    queryFn: getFn<CouponsResponse>('/coupons', params)
  })
}

export const usePurchaseCoupon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postFn<PurchaseCouponRequest, Order>('/orders'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'list'] })
    }
  })
}
```

#### 3. Create Route (`src/routes/coupons.tsx`)

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { CouponsPage } from '@pages/Coupons'

export const Route = createFileRoute('/coupons')({
  component: CouponsPage
})
```

#### 4. Create Page (`src/pages/Coupons/CouponsPage.tsx`)

```typescript
import { useGetCoupons } from '@services/coupons'

export default function CouponsPage() {
  const { data, isLoading } = useGetCoupons()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Available Deals</h1>
      <div className="grid grid-cols-3 gap-4">
        {data?.items.map(coupon => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
  )
}
```

## 🛠️ Available Scripts

```bash
# Development
bun run dev              # or npm run dev - Start dev server
bun run build            # or npm run build - Build for production
bun run build:dev        # or npm run build:dev - Build for development
bun run preview          # or npm run preview - Preview production build

# Testing
bun test                 # or npm test - Run tests
bun run test-watch       # or npm run test-watch - Run tests in watch mode

# Code Quality
bun run lint             # or npm run lint - Lint code
bun run lint:fix         # or npm run lint:fix - Auto-fix lint errors
bun run typecheck        # or npm run typecheck - TypeScript type checking
bun run format           # or npm run format - Format code with Prettier
bun run format:check     # or npm run format:check - Check code formatting
bun run fix              # or npm run fix - Fix linting and formatting

# Storybook
bun run storybook        # or npm run storybook - Start Storybook
bun run build-storybook  # or npm run build-storybook - Build Storybook
```

## 🎨 Component Development

### Atomic Design Structure

**Atoms** - Basic building blocks

```typescript
// src/components/atoms/Button/Button.tsx
import styles from './Button.module.css'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export default function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  )
}
```

```css
/* src/components/atoms/Button/Button.module.css */
@reference "tailwindcss";

.button {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.secondary {
  @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
}
```

**Molecules** - Simple composites

```typescript
// src/components/molecules/SearchBar/SearchBar.tsx
import styles from './SearchBar.module.css'

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        className={`input input-bordered ${styles.input}`}
        placeholder="Search..."
      />
      <button className="btn btn-primary">Search</button>
    </div>
  )
}
```

```css
/* src/components/molecules/SearchBar/SearchBar.module.css */
@reference "tailwindcss";

.container {
  @apply flex gap-2 items-center;
}

.input {
  @apply flex-1;
}
```

**Organisms** - Complex components

```typescript
// src/components/organisms/DataTable/DataTable.tsx
export default function DataTable<T>({ data, columns }: DataTableProps<T>) {
  // Complex table logic with sorting, filtering, pagination
  return <table>...</table>
}
```

## 🔐 Authentication

The template includes a complete Auth0 integration:

```typescript
import { useAuth } from '@auth/useAuth'
import { usePermissions } from '@auth/usePermissions'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const { canRead, canWrite } = usePermissions('coupons')

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}</p>
          {canWrite && <Button>Purchase Coupon</Button>}
        </>
      ) : (
        <Button onClick={login}>Login to Purchase</Button>
      )}
    </div>
  )
}
```

## 🧪 Testing

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## 📚 Key Patterns

### Data Fetching

- Use custom hooks from services
- Query keys follow: `[resource, operation, params]` pattern
- Mutations invalidate related queries automatically

### Styling

- **Primary**: CSS Modules with Tailwind's `@apply` directive
- Use `.module.css` files with `@reference "tailwindcss"` at the top
- Inline Tailwind classes only for DaisyUI classes or one-off overrides
- DaisyUI for pre-built components using utility classes

**Example:**

```css
/* Button.module.css */
@reference "tailwindcss";

.button {
  @apply px-4 py-2 rounded-xl font-medium transition-colors;
}

.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

```tsx
import styles from './Button.module.css'

export function Button({ variant = 'primary' }) {
  return <button className={`${styles.button} ${styles[variant]}`}>Click</button>
}
```

### Forms

- TanStack Form with Zod validation
- Type-safe form handling
- Built-in error management

### State Management

- React Query for server state
- Zustand for global client state
- Local state with useState

## 🚢 Deployment

### Build

```bash
bun run build  # or npm run build
```

Output will be in `dist/` directory.

### Environment Variables

Ensure all required environment variables are set in your deployment environment:

- `VITE_AUTH_DOMAIN`
- `VITE_AUTH_CLIENT_ID`
- `VITE_AUTH_REDIRECT_URI`
- `VITE_AUTH_AUDIENCE`
- `VITE_API_HOST`
- `VITE_API_MOUNT`

### Platforms

This template can be deployed to:

- Vercel
- Netlify
- Azure Static Web Apps
- AWS Amplify
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TanStack](https://tanstack.com/) for amazing developer tools
- [DaisyUI](https://daisyui.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Auth0](https://auth0.com/) for authentication
- [Vite](https://vitejs.dev/) for blazing fast builds

## 📞 Support

- Documentation: [CLAUDE.md](./CLAUDE.md)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Happy coding! 🎉**
