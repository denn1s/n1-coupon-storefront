import '@testing-library/jest-dom'

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver

const originalConsoleWarn = console.warn
console.warn = (...args) => {
  const message = args[0]
  if (
    typeof message === 'string' &&
    message.includes('An aria-label or aria-labelledby prop is required for accessibility.')
  ) {
    return
  }

  originalConsoleWarn(...args)
}
