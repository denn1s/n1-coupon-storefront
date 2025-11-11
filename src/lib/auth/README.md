# Authentication & Permissions System

A centralized authentication and permission management system for the admin dashboard.

## Overview

This system provides:

- JWT token decoding and permission extraction
- Centralized permission checking
- Resource-specific permission hooks
- Route-level protection
- Consistent access denied UI

## Core Components

### 1. AuthProvider

Wraps the application and manages authentication state and permissions.

```tsx
import { AuthProvider } from '@auth'

function App() {
  return (
    <Auth0Provider>
      <AuthProvider>{/* Your app */}</AuthProvider>
    </Auth0Provider>
  )
}
```

### 2. Permission Hooks

#### Basic Permission Check

```tsx
import { usePermissions } from '@auth'

function MyComponent() {
  const { hasPermission } = usePermissions()
  const canRead = hasPermission('read:applications')
  const canWrite = hasPermission('write:applications')
}
```

#### Resource-Specific Hooks

```tsx
import { useApplicationsPermissions } from '@auth'

function ApplicationsPage() {
  const { canRead, canWrite } = useApplicationsPermissions()

  if (!canRead) {
    return <AccessDenied />
  }

  return <div>{canWrite && <CreateButton />}</div>
}
```

### 3. Available Permission Hooks

- `useApplicationsPermissions()`
- `useApplicationCredentialsPermissions()`
- `useCampaignsPermissions()`
- `useCampaignGroupsPermissions()`
- `useLoyaltyProgramsPermissions()`
- `useManagementCredentialsPermissions()`
- `useProfilesPermissions()`
- `useSegmentsPermissions()`
- `useStoresPermissions()`
- `useTagsPermissions()`
- `useUsersPermissions()`

### 4. Route Protection

```tsx
import { routeGuards } from '@auth'

export const Route = createFileRoute('/applications')({
  component: Applications,
  loader: routeGuards.applicationsRead
})
```

## Permission Structure

Each resource follows a consistent pattern:

- `read:<resource>` - Controls access to listing views
- `write:<resource>` - Controls create, update, delete operations

## Resource Mappings

| Resource                | Route                           | Permissions                                                     |
| ----------------------- | ------------------------------- | --------------------------------------------------------------- |
| Applications            | `/apps`                         | `read:applications`, `write:applications`                       |
| Application Credentials | `/app/:id/settings/credentials` | `read:application-credentials`, `write:application-credentials` |
| Campaigns               | `/app/:id`                      | `read:campaigns`, `write:campaigns`                             |
| Campaign Groups         | `/app/:id`                      | `read:campaign-groups`, `write:campaign-groups`                 |
| Loyalty Programs        | `/loyalty-programs`             | `read:loyalty-programs`, `write:loyalty-programs`               |
| Management Credentials  | `/settings/management-api-keys` | `read:management-credentials`, `write:management-credentials`   |
| Profiles                | `/profiles`                     | `read:profiles`, `write:profiles`                               |
| Segments                | `/segments`                     | `read:segments`, `write:segments`                               |
| Stores                  | `/stores`                       | `read:stores`, `write:stores`                                   |
| Tags                    | `/tags`                         | `read:tags`, `write:tags`                                       |
| Users                   | `/settings/users`               | `read:users`, `write:users`                                     |

## Implementation Pattern

### 1. Page-Level Protection

```tsx
function MyPage() {
  const { canRead, canWrite } = useResourcePermissions('my-resource')

  if (!canRead) {
    return <ResourceAccessDenied resource="my-resource" />
  }

  return (
    <div>
      {canWrite && <CreateButton />}
      <Table onRowClick={canWrite ? handleEdit : undefined} />
    </div>
  )
}
```

### 2. Component-Level Protection

```tsx
function MyComponent() {
  const { canWrite } = useResourcePermissions('my-resource')

  return <div>{canWrite && <ActionButton />}</div>
}
```

## Error Handling

The system gracefully handles:

- Missing or invalid JWT tokens
- Empty permission arrays
- Network errors during token refresh
- Invalid permission formats

## Type Safety

All hooks and components are fully typed with TypeScript for better developer experience and compile-time error checking.
