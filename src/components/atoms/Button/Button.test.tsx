import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import Button from './Button'
import { FaBeer } from 'react-icons/fa'

describe('Button component', () => {
  test('renders with text and icon', () => {
    render(
      <Button icon={<FaBeer />} onClick={() => {}}>
        Click me
      </Button>
    )
    expect(screen.getByText('Click me')).toBeInTheDocument()
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
  })

  test('calls onClick once on click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    await act(async () => {
      await user.click(screen.getByRole('button'))
    })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('prevents double clicking during async onClick', async () => {
    const user = userEvent.setup()
    let resolvePromise: () => void
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve
    })
    const onClick = vi.fn(() => promise)
    render(<Button onClick={onClick}>Click me</Button>)

    await act(async () => {
      // Click first time
      await user.click(screen.getByRole('button'))
    })
    expect(onClick).toHaveBeenCalledTimes(1)

    await act(async () => {
      // Try clicking again while promise is pending
      await user.click(screen.getByRole('button'))
    })
    expect(onClick).toHaveBeenCalledTimes(1)

    await act(async () => {
      // Resolve promise to finish loading
      resolvePromise!()
      await promise
    })
  })

  test('disables button after one click if disableAfterClick is true', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disableAfterClick>
        Click me
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()

    await act(async () => {
      await user.click(button)
    })
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(button).toBeDisabled()

    await act(async () => {
      // Try clicking again
      await user.click(button)
    })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('does not call onClick if disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Click me
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()

    await act(async () => {
      await user.click(button)
    })
    expect(onClick).not.toHaveBeenCalled()
  })
})
