import { Link } from '@tanstack/react-router'

export const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            The Headless Platform for Modern Loyalty Programs
          </h1>
          <p className="mt-6 text-base leading-7 text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Build, manage, and scale loyalty campaigns, rewards, and tiers with our powerful API. Stop reinventing the
            wheel and focus on your product.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/login"
              className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
            >
              See features
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
