/**
 * API Enums
 *
 * Define enumerations for your API here.
 * These provide type-safe constants for status values, types, etc.
 */

// ============================================================================
// Example Enums (Replace with your own)
// ============================================================================

/**
 * Example: Item status enum
 * Replace this with your own enums as needed
 */
export enum ItemStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Archived = 'Archived',
  Draft = 'Draft'
}

/**
 * Example: Generic entity status
 */
export enum EntityStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Deleted = 'Deleted'
}

/**
 * Example: Sort direction
 */
export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

/**
 * Example: Role types
 */
export enum RoleType {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest'
}
