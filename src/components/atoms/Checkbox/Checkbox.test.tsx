import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkbox from './Checkbox'

describe('Checkbox component', () => {
  test('renders with label', () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  test('renders without label', () => {
    render(<Checkbox checked={false} onChange={() => {}} />)
    expect(screen.queryByText('Accept terms')).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  test('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Click me" />)

    await user.click(screen.getByRole('checkbox'))

    expect(onChange).toHaveBeenCalledWith(true)
  })

  test('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} disabled label="Disabled" />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-disabled', 'true')

    await user.click(checkbox)

    expect(onChange).not.toHaveBeenCalled()
  })

  test('label click toggles checkbox', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Toggle me" />)

    await user.click(screen.getByText('Toggle me'))

    expect(onChange).toHaveBeenCalledWith(true)
  })
})
