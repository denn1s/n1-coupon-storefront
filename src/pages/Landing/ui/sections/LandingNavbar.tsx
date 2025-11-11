import { Link } from '@tanstack/react-router'

export const LandingNavbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/70 bg-white/80 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="LoyaltyCo" className="h-6 w-6" />
          <span className="font-semibold tracking-tight">Loyalty Core</span>
        </div>
        <nav className="hidden gap-6 md:flex">
          <a
            href="#features"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Features
          </a>
          <a
            href="#use-cases"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Use Cases
          </a>
          <a
            href="#pricing"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
