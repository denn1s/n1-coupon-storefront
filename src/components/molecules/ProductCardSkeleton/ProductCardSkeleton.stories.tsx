import type { Meta, StoryObj } from '@storybook/react'
import ProductCardSkeleton from './ProductCardSkeleton'

const meta = {
  title: 'Molecules/ProductCardSkeleton',
  component: ProductCardSkeleton,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ProductCardSkeleton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Single skeleton card
 */
export const Default: Story = {}

/**
 * Grid layout showing multiple skeleton cards (typical pagination loading state)
 */
export const PaginationLoading: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        padding: '1rem'
      }}
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  )
}

/**
 * Small grid showing initial loading state (4 cards)
 */
export const InitialLoading: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        padding: '1rem'
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  )
}

/**
 * Two-column layout (tablet/mobile view)
 */
export const MobileView: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        padding: '1rem',
        maxWidth: '600px'
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  )
}

/**
 * Single column layout (mobile view)
 */
export const SingleColumn: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', maxWidth: '400px' }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  )
}

/**
 * Side-by-side comparison with skeleton animation
 */
export const AnimationDemo: Story = {
  render: () => (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Skeleton cards with animated shimmer effect:</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', padding: '1rem' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Notice the staggered pulse animations on different elements for a more natural loading effect.
      </p>
    </div>
  )
}
