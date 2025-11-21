import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FeaturedProducts from './FeaturedProducts'

// Define mock function
const mockUseGetProducts = vi.fn()

// Mock the service hook
vi.mock('@services/holding.graphql', () => ({
  useGetProducts: (...args: unknown[]) => mockUseGetProducts(...args)
}))

// Mock styles to return simple class names for testing
vi.mock('./FeaturedProducts.module.css', () => ({
  default: {
    container: 'container',
    skeletonCard: 'skeletonCard',
    productsGrid: 'productsGrid'
  }
}))

// Mock ProductCard to avoid complex rendering and Router dependencies inside it
// but we need to verify it renders. Actually, we can just use the real one but wrap in a Router context.
// However, since ProductCard uses Link from @tanstack/react-router, we need to mock it or provide a router.
// Providing a router is better for integration testing, but mocking is easier for unit testing the container.
// Let's mock ProductCard for simplicity and focus on FeaturedProducts logic.
vi.mock('@components/molecules/ProductCard', () => ({
  default: ({ product }: { product: { name: string } }) => <div data-testid="product-card">{product.name}</div>
}))

const mockProducts = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
    salePrice: 80,
    productImageUrl: 'img1.jpg',
    images: [],
    quantityAvailable: 10
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description 2',
    price: 200,
    salePrice: 150,
    productImageUrl: 'img2.jpg',
    images: [],
    quantityAvailable: 5
  }
]

describe('FeaturedProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGetProducts.mockReset()
  })

  it('renders loading state initially', () => {
    mockUseGetProducts.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    const { container } = render(<FeaturedProducts collectionId={1} />)
    // We expect skeleton cards in the loading state
    const skeletons = container.getElementsByClassName('skeletonCard')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders nothing on error', () => {
    mockUseGetProducts.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed')
    })

    const { container } = render(<FeaturedProducts collectionId={1} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing if no products found', () => {
    mockUseGetProducts.mockReturnValue({
      data: { holdingProducts: { nodes: [] } },
      isLoading: false,
      error: null
    })

    const { container } = render(<FeaturedProducts collectionId={1} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders products when data is available', () => {
    mockUseGetProducts.mockReturnValue({
      data: { holdingProducts: { nodes: mockProducts } },
      isLoading: false,
      error: null
    })

    render(<FeaturedProducts collectionId={1} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
  })

  it('limits the number of products displayed', () => {
    // create 15 items
    const manyProducts = Array.from({ length: 15 }, (_, i) => ({
      ...mockProducts[0],
      id: i + 1,
      name: `Product ${i + 1}`
    }))

    mockUseGetProducts.mockReturnValue({
      data: { holdingProducts: { nodes: manyProducts } },
      isLoading: false,
      error: null
    })

    render(<FeaturedProducts collectionId={1} maxProducts={5} />)

    // Should see 1-5
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 5')).toBeInTheDocument()
    // Should not see 6
    expect(screen.queryByText('Product 6')).not.toBeInTheDocument()
  })
})
