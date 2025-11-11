# Permission Pattern Implementation Guide

## Standard Pattern

Each protected module should follow this pattern:

### 1. Import Permission Hooks

```tsx
import { useResourcePermissions } from '@auth/useResourcePermissions'
import { ResourceAccessDenied } from '@components/atoms/ResourceAccessDenied'
```

### 2. Check Permissions

```tsx
const { canRead, canWrite } = useResourcePermissions('resource-name')

if (!canRead) {
  return <ResourceAccessDenied resource="resource-name" breadcrumbs={breadcrumbs} />
}
```

### 3. Conditional UI

```tsx
// Create buttons
{canWrite && <CreateButton />}

// Row clicks
onRowClick={canWrite ? handleEdit : undefined}

// Action buttons
{canWrite && <DeleteButton />}
```

## Resource-Specific Hooks

Use the appropriate hook for each resource:

- `useApplicationsPermissions()`
- `useCampaignsPermissions()`
- `useProfilesPermissions()`
- etc.

## Route Protection

Add to route definitions:

```tsx
export const Route = createFileRoute('/my-route')({
  component: MyComponent,
  loader: routeGuards.myResourceRead
})
```

## Best Practices

1. **Early Returns**: Check read permissions at component start
2. **Conditional Rendering**: Use conditional rendering instead of hiding elements
3. **Event Handling**: Properly handle event propagation
4. **Consistent Naming**: Use consistent permission naming across modules
5. **Type Safety**: Leverage TypeScript for better error checking
