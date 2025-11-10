import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Checkbox, { CheckboxProps } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    className: { control: false },
    onChange: { action: 'changed' }
  }
}

export default meta
type Story = StoryObj<typeof Checkbox>

const ControlledCheckbox = (args: Omit<CheckboxProps, 'onChange'>) => {
  const [checked, setChecked] = useState(args.checked ?? false)
  return <Checkbox {...args} checked={checked} onChange={setChecked} />
}

export const Default: Story = {
  render: (args) => <ControlledCheckbox {...args} />,
  args: {
    label: 'Accept terms',
    checked: false
  }
}

export const Checked: Story = {
  render: (args) => <ControlledCheckbox {...args} />,
  args: {
    label: 'Checked',
    checked: true
  }
}

export const Disabled: Story = {
  render: (args) => <ControlledCheckbox {...args} />,
  args: {
    label: 'Disabled',
    checked: false,
    disabled: true
  }
}

export const WithoutLabel: Story = {
  render: (args) => <ControlledCheckbox {...args} />,
  args: {
    checked: false
  }
}
