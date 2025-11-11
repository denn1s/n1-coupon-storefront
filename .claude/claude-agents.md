# Claude AI Agents Guide

This document provides a comprehensive overview of all specialized AI agents available in this project and how to use them effectively.

---

## 🎯 Overview

This project includes **5 specialized AI agents**, each expert in a specific domain. These agents help maintain consistency, enforce best practices, and accelerate development.

### Agent Roster

| Agent                        | Focus Area              | Primary Use Cases                                        |
| ---------------------------- | ----------------------- | -------------------------------------------------------- |
| **services-agent**           | API & Data Fetching     | Creating services, TanStack Query hooks, API integration |
| **pages-routes-agent**       | Pages & Navigation      | Building pages, file-based routing, route parameters     |
| **components-styling-agent** | UI Components & Styles  | Creating components, CSS Modules, DaisyUI integration    |
| **testing-agent**            | Test Coverage           | Component tests, integration tests, mocking              |
| **storybook-agent**          | Component Documentation | Writing stories, documenting props, interactive examples |

---

## 🔌 Services Agent

**File:** `.claude/services-agent.md`

### Expertise

- TanStack Query (React Query) patterns
- Custom query function builders (getFn, postFn, patchFn, deleteFn)
- Query key strategies
- Mutation patterns with optimistic updates
- Cache invalidation
- Error handling
- TypeScript typing for API responses

### When to Use

- Creating a new API service file
- Implementing data fetching for a resource
- Setting up mutations (create, update, delete)
- Managing cache invalidation
- Configuring query options (retry, staleTime, etc.)

### Key Patterns

```typescript
// Service file: src/services/products.ts
import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import { getFn, postFn, patchFn, deleteFn } from '@lib/api/queryFn'

// Query
export const useGetProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', 'list', params],
    queryFn: getFn<ProductsResponse>('/products', params)
  })
}

// Mutation with cache invalidation
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postFn<CreateProductRequest, Product>('/products'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
    }
  })
}
```

---

## 🧭 Pages & Routes Agent

**File:** `.claude/pages-routes-agent.md`

### Expertise

- TanStack Router file-based routing
- Route structure and organization
- Dynamic routes ($param)
- Route loaders and prefetching
- Navigation patterns
- Page component structure
- Layout integration

### When to Use

- Creating a new page
- Adding a new route
- Implementing route parameters
- Setting up route guards/auth
- Building page layouts
- Implementing navigation

### Key Patterns

```typescript
// Route file: src/routes/products/$productId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@pages/ProductDetail'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage
})

// Page file: src/pages/ProductDetail/ProductDetailPage.tsx
import { useParams } from '@tanstack/react-router'
import { useGetProduct } from '@services/products'

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' })
  const { data: product, isLoading } = useGetProduct(productId)

  if (isLoading) return <Spinner />
  return <div>{product.name}</div>
}
```

---

## 🎨 Components & Styling Agent

**File:** `.claude/components-styling-agent.md`

### Expertise

- Atomic Design (atoms, molecules, organisms)
- CSS Modules with Tailwind @apply directive
- DaisyUI component integration
- Component prop interfaces
- TypeScript best practices
- Accessibility patterns

### When to Use

- Creating a new UI component
- Styling components
- Converting inline classes to CSS Modules
- Integrating DaisyUI components
- Building reusable component libraries

### **CRITICAL: Component Creation Priority Workflow**

**ALWAYS follow this priority when creating components:**

#### 1️⃣ Check `src/components/COMPONENTS.md`

- **First action**: Read `/src/components/COMPONENTS.md`
- Check if a suitable component already exists
- Review component props and usage examples

#### 2️⃣ Search the Filesystem

- Search `src/components/` for similar components
- Check atoms/, molecules/, organisms/ directories
- Look for components with similar functionality

#### 3️⃣ Check DaisyUI Documentation

- Visit https://daisyui.com/components/
- Check if DaisyUI provides the component
- Prefer DaisyUI classes over custom components for standard UI elements

#### 4️⃣ Create New Component (Only if necessary)

If no suitable component exists:

- Place in correct Atomic Design category
- Follow naming conventions (PascalCase)
- Create with TypeScript props interface
- Write CSS Module file (.module.css) with @apply
- Create index.ts export
- **Write tests** (\*.test.tsx)
- **Write Storybook story** (\*.stories.tsx)
- **Update `/src/components/COMPONENTS.md`** ⚠️ REQUIRED

### Key Patterns

```typescript
// Component: src/components/atoms/StatusBadge/StatusBadge.tsx
import styles from './StatusBadge.module.css'

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending'
  label?: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {label || status}
    </span>
  )
}

// Styles: src/components/atoms/StatusBadge/StatusBadge.module.css
@reference "tailwindcss";

.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.active {
  @apply bg-green-100 text-green-800;
}

.inactive {
  @apply bg-gray-100 text-gray-800;
}

.pending {
  @apply bg-yellow-100 text-yellow-800;
}
```

---

## 🧪 Testing Agent

**File:** `.claude/testing-agent.md`

### Expertise

- Vitest configuration and patterns
- React Testing Library best practices
- User-centric testing
- Mocking TanStack Query hooks
- Async testing patterns
- Accessibility testing
- Test organization

### When to Use

- Writing component tests
- Testing user interactions
- Mocking API calls
- Testing async behavior
- Implementing accessibility tests
- Setting up test utilities

### Key Patterns

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button', { name: /click me/i }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## 📚 Storybook Agent

**File:** `.claude/storybook-agent.md`

### Expertise

- Storybook 10 CSF3 format
- Component stories and variants
- Args and controls configuration
- Decorators and global config
- Interactive documentation
- Accessibility addon

### When to Use

- Creating component stories
- Documenting component APIs
- Building interactive examples
- Setting up component variants
- Writing documentation

### **CRITICAL: Story Creation is Required**

**When creating a new component, you MUST create a story:**

- Story file: `ComponentName.stories.tsx`
- Include all variants (states, sizes, etc.)
- Document props with argTypes
- Add to Storybook for visual review

### Key Patterns

```typescript
// StatusBadge.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import StatusBadge from './StatusBadge'

const meta: Meta<typeof StatusBadge> = {
  title: 'Atoms/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'inactive', 'pending']
    }
  }
}

export default meta
type Story = StoryObj<typeof StatusBadge>

export const Active: Story = {
  args: {
    status: 'active',
    label: 'Active'
  }
}

export const Inactive: Story = {
  args: {
    status: 'inactive'
  }
}

export const Pending: Story = {
  args: {
    status: 'pending',
    label: 'Awaiting Approval'
  }
}
```

---

## 🔄 Multi-Agent Workflows

Complex features often require multiple agents. Here's how to orchestrate them:

### Example: Creating a New Resource (Products)

#### Step 1: Services Agent

Create the API service and data fetching layer

```bash
Task: Create products service with CRUD operations
Agent: services-agent
Output: src/services/products.ts
```

#### Step 2: Components Agent

Create any custom components needed

```bash
Task: Create ProductCard component
Agent: components-styling-agent
Output: src/components/molecules/ProductCard/
Checklist:
  ✓ Check COMPONENTS.md first
  ✓ Search for existing card components
  ✓ Check DaisyUI card component
  ✓ Create component + styles
  ✓ Update COMPONENTS.md
```

#### Step 3: Pages & Routes Agent

Create the page and routes

```bash
Task: Create products list and detail pages
Agent: pages-routes-agent
Output:
  - src/routes/products.tsx
  - src/routes/products/$productId.tsx
  - src/pages/Products/
  - src/pages/ProductDetail/
```

#### Step 4: Testing Agent

Write comprehensive tests

```bash
Task: Add tests for ProductCard and ProductsPage
Agent: testing-agent
Output:
  - src/components/molecules/ProductCard/ProductCard.test.tsx
  - src/pages/Products/ProductsPage.test.tsx
```

#### Step 5: Storybook Agent

Document components in Storybook

```bash
Task: Create ProductCard stories
Agent: storybook-agent
Output: src/components/molecules/ProductCard/ProductCard.stories.tsx
```

---

## ⚠️ Critical Rules for All Agents

### Component Creation Workflow (MANDATORY)

Every agent that creates components MUST follow this workflow:

```
START: Need a component
  ↓
1. READ src/components/COMPONENTS.md
  ↓
2. Search src/components/ filesystem
  ↓
3. Check https://daisyui.com/components/
  ↓
4. Does suitable component exist?
  ├─ YES → Use existing component ✓
  └─ NO → Continue to Step 5
  ↓
5. Create new component:
   - Choose Atomic Design category (atom/molecule/organism)
   - Create Component.tsx with TypeScript props
   - Create Component.module.css with @apply
   - Create index.ts export
   - Write Component.test.tsx
   - Write Component.stories.tsx
  ↓
6. UPDATE src/components/COMPONENTS.md ⚠️ REQUIRED
  ↓
END
```

### Universal Patterns

**All agents must follow these patterns:**

1. **Styling**: CSS Modules with @apply (NOT inline classes)

   ```css
   @reference "tailwindcss";
   .button {
     @apply btn btn-primary;
   }
   ```

2. **Services**: Use custom query builders

   ```typescript
   getFn, postFn, patchFn, deleteFn
   ```

3. **Routes**: TanStack Router file-based

   ```typescript
   createFileRoute('/path')
   ```

4. **Types**: Always use TypeScript interfaces

   ```typescript
   export interface ComponentProps { ... }
   ```

5. **Tests**: User-centric with Testing Library

   ```typescript
   screen.getByRole('button', { name: /submit/i })
   ```

6. **Stories**: CSF3 format with comprehensive variants

---

## 📖 How to Reference Agents

### In Development

When working with Claude Code or AI assistants:

```bash
# Specific agent
"Follow patterns in .claude/services-agent.md to create a users service"

# Multiple agents
"Use .claude/components-styling-agent.md and .claude/storybook-agent.md
to create a StatusBadge component with stories"

# Component creation (most important)
"Before creating any components, check src/components/COMPONENTS.md
and follow the component creation priority workflow in
.claude/claude-agents.md"
```

### Quick Reference

| Need            | Agent(s)                 | Additional Resources |
| --------------- | ------------------------ | -------------------- |
| API integration | services-agent           | CLAUDE.md            |
| New page        | pages-routes-agent       | CLAUDE.md            |
| New component   | components-styling-agent | **COMPONENTS.md** ⚠️ |
| Tests           | testing-agent            | setupTests.ts        |
| Documentation   | storybook-agent          | .storybook/main.ts   |

---

## 🎯 Agent Philosophy

### Core Principles

1. **Consistency Over Cleverness**

   - Follow established patterns
   - Don't reinvent the wheel
   - Check existing code first

2. **Documentation is Code**

   - Every component needs tests
   - Every component needs stories
   - Every component needs COMPONENTS.md entry

3. **TypeScript First**

   - No `any` types
   - Export all interfaces
   - Comprehensive prop typing

4. **User-Centric**

   - Test like a user would use it
   - Accessible by default
   - Error states matter

5. **DRY but Not Too DRY**
   - Reuse components when it makes sense
   - Don't over-abstract too early
   - Check COMPONENTS.md before creating

---

## 🔄 Keeping Agents Updated

As the project evolves, keep agents synchronized:

### When to Update Agents

- New pattern emerges (update relevant agent)
- Breaking change in dependencies (update all affected)
- Better practice discovered (document why + update)
- Deprecating old pattern (mark as deprecated, provide migration)

### Update Checklist

- [ ] Update agent markdown file
- [ ] Update examples in agent
- [ ] Update CLAUDE.md if needed
- [ ] Update COMPONENTS.md if component-related
- [ ] Update this claude-agents.md overview
- [ ] Verify examples still work

---

## 💡 Tips for Effective Agent Use

### DO

✅ Read COMPONENTS.md before creating components
✅ Use multiple agents for complex features
✅ Follow the workflows exactly
✅ Update documentation after creating components
✅ Reference agents in your prompts
✅ Check DaisyUI before custom components

### DON'T

❌ Skip the component priority workflow
❌ Create components without checking existing ones
❌ Forget to write tests and stories
❌ Use inline Tailwind classes (use CSS Modules)
❌ Ignore TypeScript errors
❌ Create components without updating COMPONENTS.md

---

## 💅 Code Style Standards

All agents and development in this project follow these consistent code style conventions:

### Semicolons

**Never use semicolons** in JavaScript/TypeScript code:

```typescript
// ❌ WRONG
import React from 'react'
const value = 'hello'

// ✅ CORRECT
import React from 'react'
const value = 'hello'
```

### Quotes

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

### Enforcement

- **ESLint**: Configured with `semi: ['error', 'never']` and `jsx-quotes: ['error', 'prefer-double']`
- **Prettier**: Configured with `"semi": false`, `"singleQuote": true`, `"jsxSingleQuote": false`
- **Auto-fix**: Run `npm run fix` to automatically format all files

---

## 📚 Additional Resources

- **Main Guide**: `CLAUDE.md` - Comprehensive project documentation
- **Component Library**: `src/components/COMPONENTS.md` - All available components
- **API Patterns**: `src/services/items.ts` - Example service implementation
- **Route Examples**: `src/routes/` - File-based routing patterns
- **Storybook**: Run `npm run storybook` to view component documentation

---

## 🚀 Quick Start for New Developers

1. Read `CLAUDE.md` for project overview
2. Read this file (`claude-agents.md`) for agent overview
3. Read `src/components/COMPONENTS.md` for available components
4. When building features:
   - Start with services-agent for API
   - Use components-agent for UI (check COMPONENTS.md first!)
   - Add pages-routes-agent for navigation
   - Test with testing-agent
   - Document with storybook-agent
5. Always follow the component creation priority workflow

---

**Remember: These agents are your teammates. Use them to maintain consistency and quality across the entire codebase!**
