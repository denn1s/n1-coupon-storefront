import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductFilters from './ProductFilters'
import { HoldingBusinessCategory, HoldingStore } from '@lib/api/types'

const mockCategories: HoldingBusinessCategory[] = [
  {
    id: 1,
    name: 'Food',
    description: 'Food category',
    bannerImageUrl: null,
    smallBannerImageUrl: null,
    storeCount: 5,
  },
  {
    id: 2,
    name: 'Entertainment',
    description: 'Entertainment category',
    bannerImageUrl: null,
    smallBannerImageUrl: null,
    storeCount: 3,
  },
]

const mockStores: HoldingStore[] = [
  {
    id: 1,
    name: 'Pizza Place',
    description: 'Best pizza in town',
    storeImageUrl: 'https://example.com/pizza.jpg',
  },
  {
    id: 2,
    name: 'Coffee Shop',
    description: 'Great coffee',
    storeImageUrl: 'https://example.com/coffee.jpg',
  },
]

describe('ProductFilters', () => {
  const defaultProps = {
    categories: mockCategories,
    stores: mockStores,
    selectedCategory: null,
    selectedStore: null,
    onCategoryChange: vi.fn(),
    onStoreChange: vi.fn(),
    onReset: vi.fn(),
  }

  it('renders filter sections', () => {
    render(<ProductFilters {...defaultProps} />)

    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Store')).toBeInTheDocument()
  })

  it('displays all categories in dropdown', () => {
    render(<ProductFilters {...defaultProps} />)

    expect(screen.getByRole('option', { name: 'All Categories' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Food (5)' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Entertainment (3)' })).toBeInTheDocument()
  })

  it('displays all stores in dropdown', () => {
    render(<ProductFilters {...defaultProps} />)

    expect(screen.getByRole('option', { name: 'All Stores' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pizza Place' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Coffee Shop' })).toBeInTheDocument()
  })

  it('calls onCategoryChange when category is selected', async () => {
    const onCategoryChange = vi.fn()
    const user = userEvent.setup()

    render(<ProductFilters {...defaultProps} onCategoryChange={onCategoryChange} />)

    const categorySelect = screen.getByLabelText('Category')
    await user.selectOptions(categorySelect, '1')

    expect(onCategoryChange).toHaveBeenCalledWith(1)
  })

  it('calls onStoreChange when store is selected', async () => {
    const onStoreChange = vi.fn()
    const user = userEvent.setup()

    render(<ProductFilters {...defaultProps} onStoreChange={onStoreChange} />)

    const storeSelect = screen.getByLabelText('Store')
    await user.selectOptions(storeSelect, '2')

    expect(onStoreChange).toHaveBeenCalledWith(2)
  })

  it('displays Clear All button when filters are active', () => {
    render(<ProductFilters {...defaultProps} selectedCategory={1} />)

    expect(screen.getByText('Clear All')).toBeInTheDocument()
  })

  it('does not display Clear All button when no filters are active', () => {
    render(<ProductFilters {...defaultProps} />)

    expect(screen.queryByText('Clear All')).not.toBeInTheDocument()
  })

  it('calls onReset when Clear All button is clicked', async () => {
    const onReset = vi.fn()
    const user = userEvent.setup()

    render(<ProductFilters {...defaultProps} selectedCategory={1} onReset={onReset} />)

    const clearButton = screen.getByText('Clear All')
    await user.click(clearButton)

    expect(onReset).toHaveBeenCalled()
  })

  it('displays active filter tags', () => {
    render(<ProductFilters {...defaultProps} selectedCategory={1} selectedStore={2} />)

    expect(screen.getByText('Active Filters:')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
  })

  it('calls onCategoryChange with null when category filter tag is removed', async () => {
    const onCategoryChange = vi.fn()
    const user = userEvent.setup()

    render(
      <ProductFilters
        {...defaultProps}
        selectedCategory={1}
        onCategoryChange={onCategoryChange}
      />
    )

    const removeButtons = screen.getAllByLabelText('Remove category filter')
    await user.click(removeButtons[0])

    expect(onCategoryChange).toHaveBeenCalledWith(null)
  })

  it('calls onStoreChange with null when store filter tag is removed', async () => {
    const onStoreChange = vi.fn()
    const user = userEvent.setup()

    render(
      <ProductFilters {...defaultProps} selectedStore={2} onStoreChange={onStoreChange} />
    )

    const removeButtons = screen.getAllByLabelText('Remove store filter')
    await user.click(removeButtons[0])

    expect(onStoreChange).toHaveBeenCalledWith(null)
  })

  it('disables selects when isLoading is true', () => {
    render(<ProductFilters {...defaultProps} isLoading={true} />)

    const categorySelect = screen.getByLabelText('Category')
    const storeSelect = screen.getByLabelText('Store')

    expect(categorySelect).toBeDisabled()
    expect(storeSelect).toBeDisabled()
  })

  it('calls onCategoryChange with null when "All Categories" is selected', async () => {
    const onCategoryChange = vi.fn()
    const user = userEvent.setup()

    render(
      <ProductFilters
        {...defaultProps}
        selectedCategory={1}
        onCategoryChange={onCategoryChange}
      />
    )

    const categorySelect = screen.getByLabelText('Category')
    await user.selectOptions(categorySelect, '')

    expect(onCategoryChange).toHaveBeenCalledWith(null)
  })
})
