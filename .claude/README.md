# Claude Development Agents

This folder contains specialized Claude agents to assist with development in this template. Each agent has deep knowledge of specific patterns and conventions used in the project.

## Available Agents

### 🔌 [services-agent.md](./services-agent.md)
**REST API Services & TanStack Query Expert**

Use this agent when:
- Creating new REST API service files
- Implementing TanStack Query hooks (useQuery, useMutation)
- Managing query keys and cache invalidation
- Setting up data fetching patterns
- Handling REST API integrations

**Expertise**: Custom query builders (getFn, postFn), mutation patterns, cache management, TypeScript types for REST APIs

---

### 🌐 [graphql-agent.md](./graphql-agent.md)
**GraphQL Services & TanStack Query Expert**

Use this agent when:
- Creating new GraphQL service files
- Writing GraphQL queries and mutations
- Implementing cursor-based pagination
- Handling GraphQL operations with TanStack Query
- Managing GraphQL cache invalidation

**Expertise**: GraphQL query syntax, cursor pagination, graphqlQueryFn builder, connection patterns, GraphQL + TanStack Query integration

---

### 🧭 [pages-routes-agent.md](./pages-routes-agent.md)
**Pages & Routes Expert**

Use this agent when:
- Creating new pages or routes
- Working with TanStack Router file-based routing
- Implementing route loaders and prefetching
- Handling route parameters and navigation
- Building page layouts

**Expertise**: File-based routing, dynamic routes, route guards, navigation patterns, page structure

---

### 🎨 [components-styling-agent.md](./components-styling-agent.md)
**Components & Styling Expert**

Use this agent when:
- Creating new UI components (atoms, molecules, organisms)
- Writing CSS Modules with @apply directive
- Using DaisyUI utility classes
- Following Atomic Design principles
- Building reusable component libraries

**Expertise**: Atomic Design, CSS Modules, Tailwind @apply, DaisyUI components, TypeScript props

---

### 🧪 [testing-agent.md](./testing-agent.md)
**Testing Expert**

Use this agent when:
- Writing component tests
- Testing async behavior and API calls
- Mocking TanStack Query hooks
- Testing user interactions
- Implementing accessibility tests

**Expertise**: Vitest, React Testing Library, user-centric testing, mocking patterns, a11y testing

---

### 📚 [storybook-agent.md](./storybook-agent.md)
**Storybook Documentation Expert**

Use this agent when:
- Creating component stories
- Documenting component APIs
- Building interactive examples
- Setting up play functions
- Organizing component documentation

**Expertise**: CSF3 format, args and controls, decorators, interaction testing, documentation

---

## How to Use These Agents

### In Claude Code CLI

When working on a specific task, reference the appropriate agent:

```bash
# Example: Creating a new service
claude "Create a users service following the patterns in .claude/services-agent.md"

# Example: Building a new component
claude "Create a StatusBadge atom component following .claude/components-styling-agent.md"

# Example: Writing tests
claude "Add tests for the Button component using patterns from .claude/testing-agent.md"
```

### Agent Selection Guide

| Task | Agent |
|------|-------|
| REST API integration | services-agent |
| GraphQL integration | graphql-agent |
| New page/route | pages-routes-agent |
| UI component | components-styling-agent |
| Writing tests | testing-agent |
| Component docs | storybook-agent |
| Complex feature | Multiple agents |

### Combining Agents

For complex features, use multiple agents in sequence:

1. **Feature: User Profile Page**
   - services-agent: Create user service with API calls
   - pages-routes-agent: Create profile route and page
   - components-styling-agent: Create profile components
   - testing-agent: Add tests for components
   - storybook-agent: Document components

## Agent Philosophy

Each agent embodies deep knowledge of:
- ✅ Project-specific patterns and conventions
- ✅ Best practices for their domain
- ✅ Common pitfalls to avoid
- ✅ TypeScript typing strategies
- ✅ Real working examples

## Maintaining Agents

When patterns change in the project:
1. Update the relevant agent documentation
2. Ensure examples match current code
3. Add new patterns as they emerge
4. Remove deprecated practices

## Quick Reference

### Key Patterns Across All Agents

**Styling**: CSS Modules with @apply directive (NOT inline classes)
```css
/* Component.module.css */
@reference "tailwindcss";

.button {
  @apply btn btn-primary;
}
```

**Services (REST)**: Custom query builders (getFn, postFn, etc.)
```typescript
const getUsers = () => getFn<UsersResponse>('/users')
export const useGetUsers = () => useQuery({ queryKey: ['users'], queryFn: getUsers() })
```

**Services (GraphQL)**: GraphQL query builder with cursor pagination
```typescript
const USERS_QUERY = `query Users($first: Int) { users(first: $first) { nodes { id name } } }`
const getUsers = (variables) => graphqlQueryFn<Variables, Response>(USERS_QUERY, variables)
export const useGetUsers = (variables = { first: 20 }) =>
  useQuery({ queryKey: ['users', 'list', variables], queryFn: getUsers(variables) })
```

**Routes**: File-based with TanStack Router
```typescript
// src/routes/users.tsx
export const Route = createFileRoute('/users')({ component: UsersPage })
```

**Components**: Atomic Design with TypeScript
```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary'
}
export default function Button({ variant = 'primary' }: ButtonProps) { }
```

**Tests**: User-centric with Testing Library
```typescript
it('submits form', async () => {
  render(<Form />)
  await userEvent.type(screen.getByLabelText(/name/i), 'John')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))
  expect(handleSubmit).toHaveBeenCalled()
})
```

**Stories**: CSF3 with comprehensive variants
```typescript
export const Primary: Story = {
  args: { variant: 'primary', children: 'Button' }
}
```

## Benefits of Using Agents

1. **Consistency**: All code follows the same patterns
2. **Speed**: No need to look up patterns each time
3. **Quality**: Built-in best practices and TypeScript types
4. **Learning**: New developers can reference agents
5. **Maintenance**: Easy to update patterns project-wide

## Contributing

When you discover a better pattern:
1. Test it thoroughly
2. Update the relevant agent
3. Update existing code to match
4. Document why the pattern is better

---

**Remember**: These agents are living documentation. Keep them updated as the project evolves!
