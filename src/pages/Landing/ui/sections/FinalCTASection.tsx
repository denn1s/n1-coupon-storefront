import { Link } from '@tanstack/react-router'

export const FinalCTASection = () => {
  return (
    <section className="border-t border-neutral-200/70 dark:border-neutral-800/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-neutral-950 px-6 py-12 text-center dark:bg-white">
          <h3 className="text-xl font-semibold text-white dark:text-neutral-900">
            Build loyalty into your product today
          </h3>
          <p className="mt-2 text-sm text-neutral-300 dark:text-neutral-700">
            Get started and start creating campaigns, tiers, and rewards with a modern API.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex rounded-md bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-white dark:hover:bg-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
