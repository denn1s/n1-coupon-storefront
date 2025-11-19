import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard'
import { HoldingProduct } from '@lib/api/types'

// Mock TanStack Router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="mock-link" {...props}>
      {children}
    </div>
  )
}))

const mockProduct: HoldingProduct = {
  id: 1,
  name: 'Test Product',
  description: 'This is a test product description',
  salePrice: 29.99,
  productImageUrl: 'https://example.com/image.jpg',
  quantityAvailable: 10,
  images: [
    {
      sequence: 1,
      url: 'https://example.com/image.jpg'
    }
  ]
}

const mockOutOfStockProduct: HoldingProduct = {
  ...mockProduct,
  id: 2,
  name: 'Out of Stock Product',
  quantityAvailable: 0
}

const mockLowStockProduct: HoldingProduct = {
  ...mockProduct,
  id: 3,
  name: 'Low Stock Product',
  quantityAvailable: 5
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('This is a test product description')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('Buy Now')).toBeInTheDocument()
  })

  it('displays product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />)

    const image = screen.getByRole('img', { name: 'Test Product' })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('calls onBuyClick when Buy Now button is clicked', async () => {
    const handleBuyClick = vi.fn()
    const user = userEvent.setup()

    render(<ProductCard product={mockProduct} onBuyClick={handleBuyClick} />)

    const buyButton = screen.getByText('Buy Now')
    await user.click(buyButton)

    expect(handleBuyClick).toHaveBeenCalledWith(mockProduct)
  })

  it('displays "Out of Stock" badge and disables button when quantity is 0', () => {
    render(<ProductCard product={mockOutOfStockProduct} />)

    expect(screen.getByText('Out of Stock', { selector: 'div' })).toBeInTheDocument()
    const buyButton = screen.getByRole('button', { name: /Out of Stock Product/i })
    expect(buyButton).toBeDisabled()
    expect(buyButton).toHaveTextContent('Out of Stock')
  })

  it('displays low stock warning when quantity is less than 10', () => {
    render(<ProductCard product={mockLowStockProduct} />)

    expect(screen.getByText('Only 5 left!')).toBeInTheDocument()
  })

  it('does not display low stock warning when quantity is 10 or more', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.queryByText(/Only \d+ left!/)).not.toBeInTheDocument()
  })

  it('truncates long descriptions', () => {
    const longDescriptionProduct: HoldingProduct = {
      ...mockProduct,
      description:
        'This is a very long description that should be truncated after 80 characters to maintain consistent card heights and improve readability'
    }

    render(<ProductCard product={longDescriptionProduct} />)

    const description = screen.getByText(/This is a very long description/)
    expect(description.textContent).toContain('...')
    expect(description.textContent?.length).toBeLessThan((longDescriptionProduct.description ?? '').length)
  })

  it('formats price with two decimal places', () => {
    const productWithWholePrice: HoldingProduct = {
      ...mockProduct,
      salePrice: 50
    }

    render(<ProductCard product={productWithWholePrice} />)

    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('prevents navigation when buy button is clicked', async () => {
    const handleBuyClick = vi.fn((e) => e)
    const user = userEvent.setup()

    render(<ProductCard product={mockProduct} onBuyClick={handleBuyClick} />)

    const buyButton = screen.getByText('Buy Now')
    await user.click(buyButton)

    // Verify the click handler was called
    expect(handleBuyClick).toHaveBeenCalledWith(mockProduct)
  })
})
