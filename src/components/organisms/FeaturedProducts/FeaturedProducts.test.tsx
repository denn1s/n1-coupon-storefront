import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FeaturedProducts from './FeaturedProducts'

// Define mock function
const mockUseGetProducts = vi.fn()

// Mock the service hook
vi.mock('@services/holding.graphql', () => ({
  useGetProducts: (...args: unknown[]) => mockUseGetProducts(...args)
}))

// Mock deep dependency to avoid resolution errors (just in case)
vi.mock('@lib/api/graphqlFn', () => ({}))

// Mock styles
vi.mock('./FeaturedProducts.module.css', () => ({
  default: {
    container: 'container',
    contentWrapper: 'contentWrapper',
    textContent: 'textContent',
    imageContent: 'imageContent',
    navButton: 'navButton',
    navButtonLeft: 'navButtonLeft',
    navButtonRight: 'navButtonRight',
    title: 'title',
    priceContainer: 'priceContainer',
    actionButton: 'actionButton',
    fadeIn: 'fadeIn'
  }
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
    quantityAvailable: 10,
    store: { name: 'Store 1' }
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description 2',
    price: 200,
    salePrice: 150,
    productImageUrl: 'img2.jpg',
    images: [],
    quantityAvailable: 5,
    store: { name: 'Store 2' }
  }
]

describe('FeaturedProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGetProducts.mockReset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders loading state initially', () => {
    mockUseGetProducts.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    render(<FeaturedProducts collectionId={1} />)
    expect(screen.getByText('Loading featured deals...')).toBeInTheDocument()
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

  it('renders first product when data is available', () => {
    mockUseGetProducts.mockReturnValue({
      data: { holdingProducts: { nodes: mockProducts } },
      isLoading: false,
      error: null
    })

    render(<FeaturedProducts collectionId={1} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument()
    expect(screen.getByText('$80.00')).toBeInTheDocument()
    expect(screen.getByText('Store 1')).toBeInTheDocument()
  })

  it('navigates to next product on click', () => {
    mockUseGetProducts.mockReturnValue({
      data: { holdingProducts: { nodes: mockProducts } },
      isLoading: false,
      error: null
    })

    render(<FeaturedProducts collectionId={1} />)

    const nextButton = screen.getByLabelText('Next product')
    fireEvent.click(nextButton)

    expect(screen.getByText('Product 2')).toBeInTheDocument()
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument()
  })

  it('navigates to previous product on click', () => {
    mockUseGetProducts.mockReturnValue({
      data: { holdingProducts: { nodes: mockProducts } },
      isLoading: false,
      error: null
    })

    render(<FeaturedProducts collectionId={1} />)

    const prevButton = screen.getByLabelText('Previous product')
    fireEvent.click(prevButton)

    // Should wrap around to last product (Product 2)
    expect(screen.getByText('Product 2')).toBeInTheDocument()
  })

  it('auto-advances carousel', () => {
    mockUseGetProducts.mockReturnValue({
      data: { holdingProducts: { nodes: mockProducts } },
      isLoading: false,
      error: null
    })

    render(<FeaturedProducts collectionId={1} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByText('Product 2')).toBeInTheDocument()
  })

  it('calls onBuyClick when buy button is clicked', () => {
    const onBuyClick = vi.fn()
    mockUseGetProducts.mockReturnValue({
      data: { holdingProducts: { nodes: mockProducts } },
      isLoading: false,
      error: null
    })

    render(<FeaturedProducts collectionId={1} onBuyClick={onBuyClick} />)

    const buyButton = screen.getByText('Comprar ahora')
    fireEvent.click(buyButton)

    expect(onBuyClick).toHaveBeenCalledWith(mockProducts[0])
  })
})
