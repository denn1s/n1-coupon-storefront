import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import SearchBox from './SearchBox'

const meta: Meta<typeof SearchBox> = {
  title: 'Atoms/SearchBox',
  component: SearchBox,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    onChange: { action: 'changed' },
    onClear: { action: 'cleared' },
    className: { control: false }
  }
}

export default meta
type Story = StoryObj<typeof SearchBox>

const ControlledSearchBox = (
  args: Omit<typeof SearchBox, 'onChange' | 'value'> & {
    value?: string
  }
) => {
  const [value, setValue] = useState(args.value ?? '')
  return <SearchBox {...args} value={value} onChange={setValue} onClear={() => setValue('')} />
}

export const Default: Story = {
  render: (args) => <ControlledSearchBox {...args} />,
  args: {
    placeholder: 'Search...',
    value: ''
  }
}

export const WithInitialValue: Story = {
  render: (args) => <ControlledSearchBox {...args} />,
  args: {
    placeholder: 'Type to search',
    value: 'initial'
  }
}

export const WithoutClearButton: Story = {
  render: (args) => <SearchBox {...args} onClear={undefined} value="" onChange={() => {}} />
}
