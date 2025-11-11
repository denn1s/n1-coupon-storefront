import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useGetItems, useDeleteItem } from '@services/items'
import { addToast } from '@lib/toasts'
import { format } from 'date-fns'

/**
 * Items List Page
 *
 * Demonstrates:
 * - Using TanStack Query hooks for data fetching
 * - Pagination
 * - Search functionality
 * - Loading and error states
 * - Delete mutations with optimistic updates
 * - Navigation to detail pages
 * - DaisyUI components
 */
export default function ItemsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading, isError, error } = useGetItems({ page, search })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page on new search
  }

  if (isError) {
    return (
      <div className="p-4">
        <div className="card max-w-2xl mx-auto bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-error">Error Loading Items</h2>
            <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Items</h1>
          <p className="text-base-content/70 mt-1">Manage your items</p>
        </div>
        <button className="btn btn-primary">Create Item</button>
      </div>

      {/* Search */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search items..."
              className="input input-bordered w-full"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Items List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>
                Page {page} of {data.totalPages}
              </span>
              <button className="btn btn-outline" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>
                Next
              </button>
            </div>
          )}

          {/* Empty State */}
          {data?.items.length === 0 && (
            <div className="card max-w-2xl mx-auto bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <p>No items found.</p>
                {search && <p className="text-sm text-base-content/70 mt-2">Try adjusting your search terms</p>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Item Card Component
 * Demonstrates individual item display with actions
 */
function ItemCard({ item }: { item: { id: string; name: string; description: string; createdAt: string } }) {
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem(item.id)

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItem(undefined, {
        onSuccess: () => {
          addToast({
            title: 'Item deleted',
            description: `"${item.name}" has been deleted successfully`,
            variant: 'success'
          })
        },
        onError: () => {
          addToast({
            title: 'Delete failed',
            description: 'Failed to delete the item. Please try again.',
            variant: 'error'
          })
        }
      })
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body">
        <h2 className="card-title">
          <Link to="/items/$itemId" params={{ itemId: item.id }} className="link link-hover">
            {item.name}
          </Link>
        </h2>
        <p className="text-sm text-base-content/70">{item.description}</p>
        <p className="text-xs text-base-content/50">Created: {format(new Date(item.createdAt), 'MMM dd, yyyy')}</p>
        <div className="card-actions justify-end mt-4">
          <Link to="/items/$itemId" params={{ itemId: item.id }}>
            <button className="btn btn-outline btn-sm">View Details</button>
          </Link>
          <button className="btn btn-error btn-outline btn-sm" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <span className="loading loading-spinner loading-xs"></span>}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
