import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import ProductFilters from './ProductFilters'
import { HoldingBusinessCategory, HoldingStore } from '@lib/api/types'

const mockCategories: HoldingBusinessCategory[] = [
  {
    id: 1,
    name: 'Food',
    description: 'Food category',
    bannerImageUrl: null,
    smallBannerImageUrl: null,
    storeCount: 12,
  },
  {
    id: 2,
    name: 'Entertainment',
    description: 'Entertainment category',
    bannerImageUrl: null,
    smallBannerImageUrl: null,
    storeCount: 8,
  },
  {
    id: 3,
    name: 'Health & Wellness',
    description: 'Health category',
    bannerImageUrl: null,
    smallBannerImageUrl: null,
    storeCount: 5,
  },
  {
    id: 4,
    name: 'Travel',
    description: 'Travel category',
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
  {
    id: 3,
    name: 'Burger Joint',
    description: 'Amazing burgers',
    storeImageUrl: 'https://example.com/burger.jpg',
  },
  {
    id: 4,
    name: 'Spa & Wellness',
    description: 'Relaxation services',
    storeImageUrl: 'https://example.com/spa.jpg',
  },
]

const meta = {
  title: 'Molecules/ProductFilters',
  component: ProductFilters,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    categories: mockCategories,
    stores: mockStores,
    onCategoryChange: fn(),
    onStoreChange: fn(),
    onReset: fn(),
  },
} satisfies Meta<typeof ProductFilters>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default filters with no selection
 */
export const Default: Story = {
  args: {
    selectedCategory: null,
    selectedStore: null,
  },
}

/**
 * Filters with a category selected
 */
export const WithCategorySelected: Story = {
  args: {
    selectedCategory: 1,
    selectedStore: null,
  },
}

/**
 * Filters with a store selected
 */
export const WithStoreSelected: Story = {
  args: {
    selectedCategory: null,
    selectedStore: 2,
  },
}

/**
 * Filters with both category and store selected
 */
export const WithBothSelected: Story = {
  args: {
    selectedCategory: 1,
    selectedStore: 3,
  },
}

/**
 * Filters in loading state
 */
export const Loading: Story = {
  args: {
    selectedCategory: null,
    selectedStore: null,
    isLoading: true,
  },
}

/**
 * Interactive example with state management
 */
export const Interactive: Story = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const [selectedStore, setSelectedStore] = useState<number | null>(null)

    const handleReset = () => {
      setSelectedCategory(null)
      setSelectedStore(null)
    }

    return (
      <div style={{ maxWidth: '400px' }}>
        <ProductFilters
          categories={mockCategories}
          stores={mockStores}
          selectedCategory={selectedCategory}
          selectedStore={selectedStore}
          onCategoryChange={setSelectedCategory}
          onStoreChange={setSelectedStore}
          onReset={handleReset}
        />
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Current Selection:
          </h4>
          <p style={{ fontSize: '0.875rem' }}>
            Category: {selectedCategory ? mockCategories.find(c => c.id === selectedCategory)?.name : 'None'}
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            Store: {selectedStore ? mockStores.find(s => s.id === selectedStore)?.name : 'None'}
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Empty state with no categories or stores
 */
export const EmptyState: Story = {
  args: {
    categories: [],
    stores: [],
    selectedCategory: null,
    selectedStore: null,
  },
}
