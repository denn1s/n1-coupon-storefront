import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ProductCardSkeleton from './ProductCardSkeleton'

describe('ProductCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProductCardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders all skeleton elements', () => {
    const { container } = render(<ProductCardSkeleton />)

    // Check for main card container
    expect(container.querySelector('[class*="card"]')).toBeInTheDocument()

    // Check for image skeleton
    expect(container.querySelector('[class*="imageSkeleton"]')).toBeInTheDocument()

    // Check for content skeleton
    expect(container.querySelector('[class*="content"]')).toBeInTheDocument()
  })

  it('renders title skeleton elements', () => {
    const { container } = render(<ProductCardSkeleton />)

    // Should have 2 title skeleton lines
    const titleSkeletons = container.querySelectorAll('[class*="titleSkeleton"]')
    expect(titleSkeletons.length).toBe(2)
  })

  it('renders description skeleton elements', () => {
    const { container } = render(<ProductCardSkeleton />)

    // Should have 3 description skeleton lines
    const descriptionSkeletons = container.querySelectorAll('[class*="descriptionSkeleton"]')
    expect(descriptionSkeletons.length).toBe(3)
  })

  it('renders footer skeleton elements', () => {
    const { container } = render(<ProductCardSkeleton />)

    // Check for footer container
    expect(container.querySelector('[class*="footer"]')).toBeInTheDocument()

    // Check for price skeleton
    expect(container.querySelector('[class*="priceSkeleton"]')).toBeInTheDocument()

    // Check for button skeleton
    expect(container.querySelector('[class*="buttonSkeleton"]')).toBeInTheDocument()
  })

  it('matches the structure of ProductCard', () => {
    const { container } = render(<ProductCardSkeleton />)

    // Verify the skeleton has the same basic structure as ProductCard
    // Card > Image + Content > (Titles + Descriptions + Footer)
    const card = container.querySelector('[class*="card"]')
    expect(card?.children.length).toBe(2) // Image + Content

    const content = container.querySelector('[class*="content"]')
    // Should have 2 titles + 3 descriptions + 1 footer = 6 children
    expect(content?.children.length).toBeGreaterThanOrEqual(6)
  })

  it('applies animate-pulse class for shimmer effect', () => {
    const { container } = render(<ProductCardSkeleton />)

    // All skeleton elements should have animation
    const imageSkeleton = container.querySelector('[class*="imageSkeleton"]')
    expect(imageSkeleton?.className).toContain('animate-pulse')
  })

  it('renders multiple skeletons without key conflicts', () => {
    const { container } = render(
      <>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </>
    )

    const cards = container.querySelectorAll('[class*="card"]')
    expect(cards.length).toBe(3)
  })
})
