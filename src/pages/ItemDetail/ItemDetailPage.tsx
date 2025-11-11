import { useParams, useNavigate } from '@tanstack/react-router'
import { useGetItem, useUpdateItem, useDeleteItem } from '@services/items'
import { addToast } from '@lib/toasts'
import { format } from 'date-fns'

/**
 * Item Detail Page
 *
 * Demonstrates:
 * - Using route parameters (itemId)
 * - Fetching single item data
 * - Update and delete mutations
 * - Navigation after actions
 * - Loading and error states
 * - DaisyUI components
 */
export default function ItemDetailPage() {
  const { itemId } = useParams({ from: '/items/$itemId' })
  const navigate = useNavigate()

  const { data: item, isLoading, isError, error } = useGetItem(itemId)
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem(itemId)
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem(itemId)

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item?.name}"?`)) {
      deleteItem(undefined, {
        onSuccess: () => {
          addToast({
            title: 'Item deleted',
            description: 'Item has been deleted successfully',
            variant: 'success'
          })
          navigate({ to: '/items' })
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

  const handleUpdate = () => {
    // Example update - in real app, you'd have a form/modal
    updateItem(
      { name: item!.name + ' (Updated)' },
      {
        onSuccess: () => {
          addToast({
            title: 'Item updated',
            description: 'Item has been updated successfully',
            variant: 'success'
          })
        },
        onError: () => {
          addToast({
            title: 'Update failed',
            description: 'Failed to update the item. Please try again.',
            variant: 'error'
          })
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4">
        <div className="card max-w-2xl mx-auto bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-error">Error Loading Item</h2>
            <p className="mb-4">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            <button className="btn btn-primary" onClick={() => navigate({ to: '/items' })}>
              Back to Items
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="p-4">
        <div className="card max-w-2xl mx-auto bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Item Not Found</h2>
            <p className="mb-4">The requested item could not be found.</p>
            <button className="btn btn-primary" onClick={() => navigate({ to: '/items' })}>
              Back to Items
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button className="btn btn-ghost btn-sm mb-2" onClick={() => navigate({ to: '/items' })}>
            ← Back to Items
          </button>
          <h1 className="text-3xl font-bold">{item.name}</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-primary" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating && <span className="loading loading-spinner loading-xs"></span>}
            Update
          </button>
          <button className="btn btn-error" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <span className="loading loading-spinner loading-xs"></span>}
            Delete
          </button>
        </div>
      </div>

      {/* Details Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium opacity-70">ID</label>
              <p className="font-mono text-sm">{item.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Name</label>
              <p>{item.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Description</label>
              <p>{item.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Created At</label>
              <p>{format(new Date(item.createdAt), 'MMMM dd, yyyy HH:mm:ss')}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Updated At</label>
              <p>{format(new Date(item.updatedAt), 'MMMM dd, yyyy HH:mm:ss')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Example of nested data or related resources */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Related Data</h2>
          <p className="opacity-70">
            This section could display related resources, nested data, or actions related to this item.
          </p>
        </div>
      </div>
    </div>
  )
}
