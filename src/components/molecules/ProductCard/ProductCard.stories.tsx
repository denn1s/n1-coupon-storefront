import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import ProductCard from './ProductCard'
import { HoldingProduct } from '@lib/api/types'

// Mock products
const mockProduct: HoldingProduct = {
  id: 1,
  name: 'Delicious Pizza Deal',
  description: 'Get 2 large pizzas with unlimited toppings for the price of one! Valid at all locations.',
  salePrice: 29.99,
  productImageUrl: 'https://cdn.h4b.dev/images/store85/products/product19087/Image1.jpg?20220401011344',
  quantityAvailable: 50,
  images: [
    {
      sequence: 1,
      url: 'https://cdn.h4b.dev/images/store85/products/product19087/Image1.jpg?20220401011344',
    },
  ],
}

const mockOutOfStockProduct: HoldingProduct = {
  ...mockProduct,
  id: 2,
  name: 'Popular Burger Combo',
  description: 'Best burger in town with fries and drink',
  quantityAvailable: 0,
}

const mockLowStockProduct: HoldingProduct = {
  ...mockProduct,
  id: 3,
  name: 'Limited Coffee Deal',
  description: 'Premium coffee package with pastries',
  quantityAvailable: 3,
}

const mockLongDescriptionProduct: HoldingProduct = {
  ...mockProduct,
  id: 4,
  name: 'Gourmet Restaurant Experience',
  description: 'Experience the finest dining in the city with our exclusive 5-course meal featuring locally sourced ingredients, wine pairing, and complimentary dessert. This incredible deal includes appetizer, soup, salad, main course, and a decadent dessert prepared by our award-winning chef.',
  salePrice: 89.99,
  quantityAvailable: 25,
}

// Router wrapper for stories
const withRouter = (Story: React.ComponentType) => {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Story />,
  })
  const productRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/products/$productId',
    component: () => <div>Product Detail Page</div>,
  })

  const routeTree = rootRoute.addChildren([indexRoute, productRoute])
  const router = createRouter({ routeTree, history: createMemoryHistory() })

  return <RouterProvider router={router} />
}

const meta = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  decorators: [withRouter],
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onBuyClick: fn(),
  },
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default product card with available stock
 */
export const Default: Story = {
  args: {
    product: mockProduct,
  },
}

/**
 * Product card for out of stock items
 */
export const OutOfStock: Story = {
  args: {
    product: mockOutOfStockProduct,
  },
}

/**
 * Product card with low stock warning
 */
export const LowStock: Story = {
  args: {
    product: mockLowStockProduct,
  },
}

/**
 * Product card with long description (gets truncated)
 */
export const LongDescription: Story = {
  args: {
    product: mockLongDescriptionProduct,
  },
}

/**
 * Product card with high price
 */
export const HighPrice: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Luxury Spa Package',
      description: 'Full day spa treatment with massage, facial, and relaxation',
      salePrice: 299.99,
    },
  },
}

/**
 * Multiple product cards in a grid (typical usage)
 */
export const GridLayout: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
      <ProductCard product={mockProduct} onBuyClick={args.onBuyClick} />
      <ProductCard product={mockLowStockProduct} onBuyClick={args.onBuyClick} />
      <ProductCard product={mockLongDescriptionProduct} onBuyClick={args.onBuyClick} />
      <ProductCard product={mockOutOfStockProduct} onBuyClick={args.onBuyClick} />
    </div>
  ),
}
