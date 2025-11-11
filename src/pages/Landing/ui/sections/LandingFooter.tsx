export const LandingFooter = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-neutral-200/70 py-10 dark:border-neutral-800/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">© {year} LoyaltyCo. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="#"
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://x.com"
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              X
            </a>
            <a
              href="https://www.linkedin.com"
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
