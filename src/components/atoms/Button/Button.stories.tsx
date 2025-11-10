import type { Meta, StoryObj } from '@storybook/react'
import { FaBeer } from 'react-icons/fa'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
    disableAfterClick: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Click me',
    onClick: () => {
      console.log('clicked')
    }
  }
}

export const WithIcon: Story = {
  args: {
    children: 'Cheers',
    icon: <FaBeer />,
    onClick: () => {
      console.log('clicked with icon')
    }
  }
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
    onClick: () => {
      console.log('should not be called')
    }
  }
}

export const DisableAfterClick: Story = {
  args: {
    children: 'Disable After Click',
    disableAfterClick: true,
    onClick: () => {
      console.log('clicked once')
    }
  }
}
