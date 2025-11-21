import type { Meta, StoryObj } from '@storybook/react'
import FeaturedProducts from './FeaturedProducts'

const meta: Meta<typeof FeaturedProducts> = {
  title: 'Organisms/FeaturedProducts',
  component: FeaturedProducts,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof FeaturedProducts>

export const Default: Story = {
  args: {
    title: 'Descubre lo más nuevo',
    maxProducts: 5
  },
  parameters: {
    // If MSW is used
    msw: {
      handlers: [
        // We would define handlers here if we had the msw addon
      ]
    }
  }
}
