import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import SearchBox from './SearchBox'

function ControlledSearchBox({ initialValue = '' }) {
  const [value, setValue] = useState(initialValue)
  return <SearchBox value={value} onChange={setValue} />
}

describe('SearchBox component', () => {
  test('renders with placeholder and value', () => {
    render(<SearchBox value="" onChange={() => {}} placeholder="Search here" />)
    expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument()
  })

  test('calls onChange when typing', async () => {
    const user = userEvent.setup()
    render(<ControlledSearchBox />)

    const input = screen.getByRole('searchbox')

    await user.type(input, 'hello')

    expect(input).toHaveValue('hello')
  })

  test('calls onClear when clear button clicked', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<SearchBox value="test" onChange={() => {}} onClear={onClear} />)

    const button = screen.getByRole('button', { name: /clear search/i })

    await user.click(button)

    expect(onClear).toHaveBeenCalled()
  })

  test('does not render clear button when value is empty', () => {
    render(<SearchBox value="" onChange={() => {}} onClear={() => {}} />)
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
  })
})
