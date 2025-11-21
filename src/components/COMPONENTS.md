# Available Components

This document lists all available components in the project. **ALWAYS check this file before creating a new component** to avoid duplication.

## Component Creation Priority

When you need a component, follow this priority:

1. **Check this COMPONENTS.md file first** - Is the component already available?
2. **Check the filesystem** - Search `src/components/` for similar components
3. **Check DaisyUI** - Does [DaisyUI](https://daisyui.com/components/) provide this component?
4. **Create new component** - If none exist:
   - Create the component following Atomic Design principles
   - Write tests (`*.test.tsx`)
   - Write Storybook stories (`*.stories.tsx`)
   - **Add it to this COMPONENTS.md file**

---

## Layouts

### MainLayout

**Location:** `src/components/_layouts/Main/Main.tsx`
**Purpose:** Authenticated app layout with sidebar navigation, header, breadcrumbs
**When to use:** All protected/authenticated pages
**Props:**

- None (uses `<Outlet />` for child routes)

**Features:**

- Collapsible sidebar with navigation items
- User menu with profile and logout
- Breadcrumb navigation
- Responsive mobile sidebar

**Example:**

```tsx
// Used automatically in __root.tsx for protected routes
// No manual usage needed
```

---

### PublicLayout

**Location:** `src/components/_layouts/Public/Public.tsx`
**Purpose:** Public/unauthenticated pages layout (login, signup, landing)
**When to use:** Public pages that don't require authentication
**Props:**

- `children: ReactNode`

**Features:**

- Simple centered layout
- No navigation or authentication UI
- Clean, minimal design

**Example:**

```tsx
<PublicLayout>
  <LoginForm />
</PublicLayout>
```

---

## Atoms (Basic Building Blocks)

### Button

**Location:** `src/components/atoms/Button/Button.tsx`
**Purpose:** Reusable button component with icon support
**When to use:** Any clickable action
**Props:**

- `children: ReactNode` - Button text/content
- `onClick?: () => void` - Click handler
- `icon?: ReactNode` - Optional icon
- `disabled?: boolean` - Disable state
- `disableAfterClick?: boolean` - Auto-disable after first click
- `className?: string` - Additional classes

**Storybook:** ✅ Available
**Tests:** ✅ Available

**Example:**

```tsx
import Button from '@components/atoms/Button'
import { FaSave } from 'react-icons/fa'
;<Button onClick={handleSave} icon={<FaSave />}>
  Save Changes
</Button>
```

---

### ButtonLink

**Location:** `src/components/atoms/ButtonLink/ButtonLink.tsx`
**Purpose:** Button styled as a link (navigation)
**When to use:** Navigation that looks like a button
**Props:**

- `to: string` - Route path
- `children: ReactNode`
- `className?: string`

**Example:**

```tsx
import { ButtonLink } from '@components/atoms/ButtonLink'
;<ButtonLink to="/settings">Go to Settings</ButtonLink>
```

---

### Checkbox

**Location:** `src/components/atoms/Checkbox/Checkbox.tsx`
**Purpose:** Controlled checkbox input with label
**When to use:** Boolean input fields, multi-select options
**Props:**

- `checked: boolean` - Checked state
- `onChange: (checked: boolean) => void` - Change handler
- `label?: string` - Label text
- `disabled?: boolean` - Disable state
- `className?: string` - Additional classes

**Storybook:** ✅ Available
**Tests:** ✅ Available

**Example:**

```tsx
import Checkbox from '@components/atoms/Checkbox'

const [agreed, setAgreed] = useState(false)

<Checkbox
  checked={agreed}
  onChange={setAgreed}
  label="I agree to the terms"
/>
```

---

### Spinner

**Location:** `src/components/atoms/Spinner/Spinner.tsx`
**Purpose:** Loading indicator using DaisyUI spinner
**When to use:** Loading states, async operations
**Props:**

- `size?: 'xs' | 'sm' | 'md' | 'lg'` - Spinner size (default: 'md')
- `color?: 'primary' | 'secondary' | 'accent' | 'neutral'` - Color theme (default: 'primary')

**Example:**

```tsx
import Spinner from '@components/atoms/Spinner'

{
  isLoading && <Spinner size="lg" color="primary" />
}
```

---

### SearchBox

**Location:** `src/components/atoms/Search Box/SearchBox.tsx`
**Purpose:** Search input with clear button
**When to use:** Search/filter functionality
**Props:**

- `value: string` - Search value
- `onChange: (value: string) => void` - Change handler
- `onClear?: () => void` - Clear button handler
- `placeholder?: string` - Placeholder text
- `className?: string` - Additional classes

**Storybook:** ✅ Available
**Tests:** ✅ Available

**Example:**

```tsx
import SearchBox from '@components/atoms/SearchBox'

const [search, setSearch] = useState('')

<SearchBox
  value={search}
  onChange={setSearch}
  onClear={() => setSearch('')}
  placeholder="Search items..."
/>
```

---

### ReactSelect

**Location:** `src/components/atoms/ReactSelect/ReactSelect.tsx`
**Purpose:** Enhanced select/dropdown using react-select library with DaisyUI styling
**When to use:** Dropdowns with search, multi-select, async options
**Props:**

- All `react-select` props
- Custom styles matching DaisyUI theme

**Features:**

- Searchable options
- Multi-select support
- Async option loading
- Custom styling to match DaisyUI

**Example:**

```tsx
import ReactSelect from '@components/atoms/ReactSelect'
;<ReactSelect
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  onChange={(option) => console.log(option)}
  placeholder="Select an option"
/>
```

---

### Alert

**Location:** `src/components/atoms/Alert.tsx`
**Purpose:** DaisyUI alert component for notifications
**When to use:** Info, success, warning, error messages
**Props:**

- `type?: 'info' | 'success' | 'warning' | 'error'`
- `children: ReactNode`

**Example:**

```tsx
import Alert from '@components/atoms/Alert'
;<Alert type="success">Operation completed successfully!</Alert>
```

---

### CopyableId

**Location:** `src/components/atoms/CopyableId/CopyableId.tsx`
**Purpose:** Display ID with copy-to-clipboard functionality
**When to use:** Display API keys, UUIDs, or any copyable IDs
**Props:**

- `id: string` - The ID to display
- `label?: string` - Optional label

**Example:**

```tsx
import CopyableId from '@components/atoms/CopyableId'
;<CopyableId id="abc-123-def-456" label="API Key" />
```

---

### Date

**Location:** `src/components/atoms/Date/Date.tsx`
**Purpose:** Format and display dates consistently
**When to use:** Display timestamps, dates
**Props:**

- `date: string | Date` - Date to format
- `format?: string` - Format pattern (default: 'MMM dd, yyyy')

**Example:**

```tsx
import Date from '@components/atoms/Date'
;<Date date={createdAt} format="MMM dd, yyyy HH:mm" />
```

---

### Breadcrumbs

**Location:** `src/components/atoms/Breadcrumbs/`
**Purpose:** Display navigation breadcrumbs
**When to use:** Show current page location in hierarchy

**Components:**

- `Breadcrumbs` - Breadcrumb container
- `BreadcrumbsRenderer` - Auto-renders from breadcrumb store

**Example:**

```tsx
import { BreadcrumbsRenderer } from '@components/atoms/Breadcrumbs'

// In MainLayout (already included)
;<BreadcrumbsRenderer />
```

---

### PermissionGuard

**Location:** `src/components/atoms/PermissionGuard/PermissionGuard.tsx`
**Purpose:** Show/hide content based on user permissions
**When to use:** Permission-based UI visibility
**Props:**

- `permission: string | string[]` - Required permission(s)
- `requireAll?: boolean` - Require all permissions (default: false)
- `children: ReactNode`
- `fallback?: ReactNode` - Show when no permission

**Example:**

```tsx
import PermissionGuard from '@components/atoms/PermissionGuard'
;<PermissionGuard permission="items:write">
  <Button>Create Item</Button>
</PermissionGuard>
```

---

### AccessDenied

**Location:** `src/components/atoms/AccessDenied/AccessDenied.tsx`
**Purpose:** Generic access denied message
**When to use:** Show when user lacks general access
**Props:**

- `message?: string` - Custom message

**Example:**

```tsx
import AccessDenied from '@components/atoms/AccessDenied'
;<AccessDenied message="You don't have access to this page" />
```

---

### ResourceAccessDenied

**Location:** `src/components/atoms/ResourceAccessDenied/ResourceAccessDenied.tsx`
**Purpose:** Resource-specific access denied message
**When to use:** Show when user lacks resource-specific permissions
**Props:**

- `resourceName: string` - Name of the resource
- `requiredPermission: string` - Required permission

**Example:**

```tsx
import ResourceAccessDenied from '@components/atoms/ResourceAccessDenied'
;<ResourceAccessDenied resourceName="Items" requiredPermission="items:write" />
```

---

## DaisyUI Components

The following DaisyUI components are available without custom wrappers. Use them directly from DaisyUI classes:

- **Badge** - `<div className="badge badge-primary">New</div>`
- **Card** - `<div className="card bg-base-100 shadow-xl">...</div>`
- **Modal** - `<dialog className="modal">...</dialog>`
- **Toast** - Use `react-hot-toast` (already configured)
- **Dropdown** - `<div className="dropdown">...</div>`
- **Tabs** - `<div className="tabs">...</div>`
- **Table** - `<table className="table">...</table>`
- **Input** - `<input className="input input-bordered" />`
- **Select** - `<select className="select select-bordered">...</select>` (or use ReactSelect for advanced features)
- **Textarea** - `<textarea className="textarea textarea-bordered" />`
- **Toggle** - `<input type="checkbox" className="toggle" />`
- **Radio** - `<input type="radio" className="radio" />`
- **Range** - `<input type="range" className="range" />`
- **Progress** - `<progress className="progress" value="70" max="100"></progress>`
- **Loading** - `<span className="loading loading-spinner"></span>` (or use Spinner component)
- **Tooltip** - `<div className="tooltip" data-tip="hello">...</div>`

**Documentation:** https://daisyui.com/components/

---

## When to Create a New Component

### ✅ Create a new component when:

- You need to reuse UI in 3+ places
- Complex logic that should be isolated
- Component has clear, single responsibility
- No suitable DaisyUI or existing component

### ❌ Don't create a new component when:

- One-off usage (use inline JSX)
- Simple wrapper around DaisyUI (use DaisyUI classes directly)
- Too generic/abstract (YAGNI principle)

---

## Component Creation Checklist

When creating a new component:

- [ ] Check this COMPONENTS.md file
- [ ] Search src/components for similar components
- [ ] Check DaisyUI documentation
- [ ] Create component following Atomic Design (atoms/molecules/organisms)
- [ ] Write TypeScript interfaces for props
- [ ] Add JSDoc comments
- [ ] Create `*.test.tsx` file with tests
- [ ] Create `*.stories.tsx` file for Storybook
- [ ] Export from `index.ts`
- [ ] **Update this COMPONENTS.md file**
- [ ] Follow CSS Modules + @apply pattern (see CLAUDE.md)

---

## Molecules (Composite Components)

### ProductCard

**Location:** `src/components/molecules/ProductCard/ProductCard.tsx`
**Purpose:** Display product/deal card with image, name, price, and buy button
**When to use:** Product listing pages, deal grids
**Props:**

- `product: HoldingProduct` - Product data
- `onBuyClick?: (product: HoldingProduct) => void` - Buy button handler

**Storybook:** ✅ Available
**Tests:** ✅ Available

**Example:**

```tsx
import ProductCard from '@components/molecules/ProductCard'
;<ProductCard product={product} onBuyClick={(product) => handlePurchase(product)} />
```

---

### ProductCardSkeleton

**Location:** `src/components/molecules/ProductCardSkeleton/ProductCardSkeleton.tsx`
**Purpose:** Skeleton loader for ProductCard, shown during pagination loading
**When to use:** Pagination loading states, product list loading feedback
**Props:** None (stateless skeleton)

**Features:**

- Matches ProductCard dimensions and layout for smooth transitions
- Animated shimmer effect with staggered delays
- Lightweight (no images, just divs with pulse animations)
- Displays 20 cards during pagination for consistent grid

**Usage:**

```tsx
import ProductCardSkeleton from '@components/molecules/ProductCardSkeleton'

// Show during pagination loading
{
  isPaginationLoad
    ? Array.from({ length: 20 }).map((_, index) => <ProductCardSkeleton key={`skeleton-${index}`} />)
    : products.map((product) => <ProductCard key={product.id} product={product} />)
}
```

---

### ProductFilters

**Location:** `src/components/molecules/ProductFilters/ProductFilters.tsx`
**Purpose:** Filter products by category and store
**When to use:** Product listing pages with filter functionality
**Props:**

- `categories: HoldingBusinessCategory[]` - Available categories
- `stores: HoldingStore[]` - Available stores
- `selectedCategory: number | null` - Selected category ID
- `selectedStore: number | null` - Selected store ID
- `onCategoryChange: (id: number | null) => void` - Category change handler
- `onStoreChange: (id: number | null) => void` - Store change handler
- `onReset: () => void` - Reset filters handler
- `isLoading?: boolean` - Loading state

**Storybook:** ✅ Available
**Tests:** ✅ Available

**Example:**

```tsx
import ProductFilters from '@components/molecules/ProductFilters'
;<ProductFilters
  categories={categories}
  stores={stores}
  selectedCategory={selectedCategory}
  selectedStore={selectedStore}
  onCategoryChange={setSelectedCategory}
  onStoreChange={setSelectedStore}
  onReset={resetFilters}
/>
```

---

### CouponDisplay

**Location:** `src/components/molecules/CouponDisplay/CouponDisplay.tsx`
**Purpose:** Display purchased coupon with QR code
**When to use:** After purchase, in coupon list, coupon detail modal
**Props:**

- `coupon: Coupon` - Coupon data
- `onClose?: () => void` - Close handler

**Features:**

- QR code generation using qrcode library
- Coupon status display (active, redeemed, expired)
- Download QR code functionality
- Product information display

**Example:**

```tsx
import CouponDisplay from '@components/molecules/CouponDisplay'
;<CouponDisplay coupon={purchasedCoupon} onClose={() => setShowCoupon(false)} />
```

---

## Organisms (Complex Components)

### CheckoutModal

**Location:** `src/components/organisms/CheckoutModal/CheckoutModal.tsx`
**Purpose:** Handle checkout flow and display coupon after purchase
**When to use:** Product purchase flow
**Props:**

- `product: HoldingProduct` - Product to purchase
- `isOpen: boolean` - Modal open state
- `onClose: () => void` - Close handler

**Features:**

- Dummy payment form (no real processing)
- Two-step flow: checkout → success with coupon
- Uses CouponDisplay component for success state
- QR code generation for purchased coupon

**Example:**

```tsx
import CheckoutModal from '@components/organisms/CheckoutModal'
;<CheckoutModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
```

---

### FeaturedProducts

**Location:** `src/components/organisms/FeaturedProducts/FeaturedProducts.tsx`
**Purpose:** Display featured products from a specific collection in a horizontal scrolling layout
**When to use:** Homepage, category pages, or any page where you want to showcase curated products
**Props:**

- `collectionId: number` - Collection ID to filter products by
- `title?: string` - Section title (default: "Featured Deals")
- `subtitle?: string` - Section subtitle/description
- `maxProducts?: number` - Maximum number of products to display (default: 10)
- `onBuyClick?: (product: HoldingProduct) => void` - Callback when buy button is clicked

**Features:**

- Horizontal scrolling with modern CSS
- Smooth scroll snapping
- Client-side filtering by collection ID
- Skeleton loading states
- Responsive design (mobile & desktop)
- Auto-hides if no featured products found
- Uses existing ProductCard component

**Example:**

```tsx
import FeaturedProducts from '@components/organisms/FeaturedProducts'
;<FeaturedProducts
  collectionId={29}
  title="🌟 Featured Deals"
  subtitle="Hand-picked deals just for you"
  maxProducts={10}
  onBuyClick={handleBuyClick}
/>
```

---

## Need Help?

- Read: `CLAUDE.md` for component patterns
- Check: Existing component source code for examples
- Review: Storybook at `http://localhost:6006` (run `npm run storybook`)
- DaisyUI: https://daisyui.com/components/
