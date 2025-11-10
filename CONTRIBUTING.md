# Contributing to TanStack Admin Template

Thank you for your interest in contributing to the TanStack Admin Template! This guide will help you understand our development workflow and coding standards.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Testing Requirements](#testing-requirements)
- [Commit Message Conventions](#commit-message-conventions)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Common Tasks](#common-tasks)

## Getting Started

### Prerequisites

- Node.js 20 or higher
- bun (preferred) or npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tanstack-template

# Install dependencies (use bun if available, npm otherwise)
bun install  # or npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
bun run dev  # or npm run dev
```

### VSCode Setup

This project includes recommended VSCode extensions and workspace settings:

1. Open the project in VSCode
2. When prompted, click "Install Recommended Extensions"
3. Workspace settings will automatically configure formatting and linting

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Follow the [Code Style Guide](#code-style-guide)
- Write tests for new features
- Update documentation as needed

### 3. Run Quality Checks

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Tests
npm test

# All at once
npm run fix
```

### 4. Commit Your Changes

Use our [commit message conventions](#commit-message-conventions):

```bash
git add .
git commit -m "feat: add new feature"
```

**Note**: Husky pre-commit hooks will automatically:

- Run ESLint and auto-fix issues
- Format code with Prettier
- Prevent commits that don't pass linting

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style Guide

### TypeScript

**Always use TypeScript**. No `any` types unless absolutely necessary.

```typescript
// ❌ Bad: Using any
const data: any = fetchData()

// ✅ Good: Using proper types
const data: User = fetchData()

// ✅ Good: Using unknown when type is truly unknown
const data: unknown = fetchData()
```

**Use strict type checking**:

```typescript
// ❌ Bad: Optional chaining without null checks
user.name.toUpperCase()

// ✅ Good: Proper null handling
user?.name?.toUpperCase()
```

### Component Structure

**Follow Atomic Design principles**:

- `atoms/` - Basic building blocks (Button, Input, Checkbox)
- `molecules/` - Simple compositions (FormField, SearchBar)
- `organisms/` - Complex components (DataTable, Sidebar)
- `_layouts/` - Layout components

**Component file structure**:

```
src/components/atoms/Button/
├── Button.tsx          # Component implementation
├── Button.module.css   # Styles
├── Button.test.tsx     # Tests
├── Button.stories.tsx  # Storybook stories
└── index.ts           # Exports
```

**Component template**:

```typescript
// Button.tsx
import { ReactNode } from 'react'
import styles from './Button.module.css'

export interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

/**
 * Button component for user interactions
 *
 * @param props - Button component props
 * @returns Button element
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick
}: ButtonProps) {
  return (
    <button
      className={styles.button}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

### Styling

**Prefer CSS Modules with @apply over inline utilities**:

```css
/* ✅ Good: CSS Modules with @apply */
@reference "tailwindcss";

.button {
  @apply rounded-xl px-4 py-2 font-semibold;
  @apply transition-colors duration-200;
}

.buttonPrimary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

```tsx
// Use the CSS Module classes
<button className={styles.button}>Click me</button>
```

**Use inline Tailwind classes only for**:

- DaisyUI component classes (`btn`, `btn-primary`, etc.)
- One-off overrides
- Dynamic classes based on props

### Path Aliases

**Always use path aliases instead of relative imports**:

```typescript
// ❌ Bad: Relative imports
import { Button } from '../../../components/atoms/Button'
import { useAuth } from '../../lib/auth/useAuth'

// ✅ Good: Path aliases
import { Button } from '@components/atoms/Button'
import { useAuth } from '@auth/useAuth'
```

**Available aliases**:

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

### API Services

**Use the custom query function builders**:

```typescript
// ✅ Good: Using getFn, postFn, patchFn, deleteFn
import { getFn, postFn } from '@lib/api/queryFn'
import { useQuery, useMutation } from '@tanstack/react-query'

export const useGetItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: getFn<Item[]>('/items')
  })
}

export const useCreateItem = () => {
  return useMutation({
    mutationFn: postFn<CreateItemRequest, Item>('/items')
  })
}
```

**Query key structure**:

- List: `['items', 'list']` or `['items', 'list', params]`
- Detail: `['items', 'detail', id]`
- Nested: `['items', itemId, 'comments']`

### Component Creation Priority

**Before creating a new component, follow this workflow**:

1. **Check `src/components/COMPONENTS.md`** - Is it already documented?
2. **Search filesystem** - Does a similar component exist?
3. **Check DaisyUI** - Does DaisyUI provide this component?
4. **Create new component** only if steps 1-3 fail

**When creating a new component**:

- [ ] Create component with TypeScript props
- [ ] Create CSS Module with `@apply`
- [ ] Write tests (`*.test.tsx`)
- [ ] Write Storybook stories (`*.stories.tsx`)
- [ ] **Update `src/components/COMPONENTS.md`** ⚠️ Required
- [ ] Export from `index.ts`

## Testing Requirements

### Test Coverage

**All new components and features must include tests**:

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Testing Best Practices

1. **Test behavior, not implementation**
2. **Use accessible queries** (`getByRole`, `getByLabelText`)
3. **Write user-centric tests** (test from user's perspective)
4. **Mock external dependencies** (API calls, external services)
5. **Test edge cases** (error states, loading states, empty data)

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test-watch

# With coverage
npm test -- --coverage

# Specific file
npm test Button.test.tsx
```

## Commit Message Conventions

We follow **Conventional Commits** specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic changes)
- `refactor`: Code refactoring (no feature changes or bug fixes)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, tooling, dependencies

### Examples

```bash
# Feature
git commit -m "feat(auth): add social login support"

# Bug fix
git commit -m "fix(button): resolve disabled state styling issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api): migrate to v2 endpoints

BREAKING CHANGE: API endpoints now use /api/v2 prefix"
```

### Scope

Optional but recommended. Use component/module name:

- `auth`
- `router`
- `ui`
- `api`
- `tests`
- `build`

## Pull Request Process

### 1. Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] COMPONENTS.md is updated (if applicable)

### 2. PR Title

Use conventional commit format:

```
feat(auth): add OAuth2 authentication
```

### 3. PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] All existing tests pass
- [ ] New tests added
- [ ] Tested manually

## Screenshots (if applicable)

Add screenshots for UI changes

## Related Issues

Closes #123
```

### 4. Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Address feedback** and push changes
4. **Squash and merge** when approved

### 5. After Merge

- Delete feature branch
- Update local main branch
- Close related issues

## Project Structure

```
tanstack-template/
├── .github/              # GitHub Actions workflows
├── .husky/               # Git hooks
├── .storybook/           # Storybook configuration
├── .vscode/              # VSCode settings
├── public/               # Static assets
├── src/
│   ├── components/       # React components (Atomic Design)
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── _layouts/
│   ├── pages/            # Page components
│   ├── routes/           # TanStack Router routes
│   ├── services/         # API service hooks
│   ├── lib/
│   │   ├── api/          # API utilities and types
│   │   ├── auth/         # Authentication
│   │   ├── helpers/      # Helper functions
│   │   ├── hooks/        # Custom hooks
│   │   └── stores/       # Zustand stores
│   └── styles/           # Global styles
├── CLAUDE.md             # AI agent instructions
├── CONTRIBUTING.md       # This file
├── ARCHITECTURE.md       # Architecture documentation
└── README.md             # Project readme
```

## Common Tasks

### Adding a New Route

```typescript
// 1. Create route file in src/routes/
// src/routes/my-page.tsx
import { createFileRoute } from '@tanstack/react-router'
import { MyPage } from '@pages/MyPage'

export const Route = createFileRoute('/my-page')({
  component: MyPage
})

// 2. Create page component in src/pages/MyPage/
// 3. Route tree auto-generates, no manual update needed
```

### Adding a New API Service

```typescript
// 1. Define types in src/lib/api/types.ts
export interface MyResource {
  id: string
  name: string
}

// 2. Create service in src/services/myResource.ts
import { getFn, postFn } from '@lib/api/queryFn'
import { useQuery, useMutation } from '@tanstack/react-query'

export const useGetMyResources = () => {
  return useQuery({
    queryKey: ['myResources'],
    queryFn: getFn<MyResource[]>('/my-resources')
  })
}

// 3. Use in components
const { data, isLoading } = useGetMyResources()
```

### Adding Global State

```typescript
// 1. Create store in src/lib/stores/myStore.ts
import { create } from 'zustand'

interface MyState {
  count: number
  increment: () => void
}

export const useMyStore = create<MyState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

// 2. Use in components
const { count, increment } = useMyStore()
```

### Running Storybook

```bash
# Development
npm run storybook

# Build
npm run build-storybook
```

### Analyzing Bundle Size

```bash
npm run analyze
# Opens interactive bundle visualization
```

## Getting Help

- **Documentation**: Check `CLAUDE.md` and `ARCHITECTURE.md`
- **Components**: See `src/components/COMPONENTS.md`
- **AI Agents**: See `.claude/claude-agents.md`
- **Issues**: Open a GitHub issue
- **Discussions**: Start a GitHub discussion

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

Thank you for contributing! 🎉
