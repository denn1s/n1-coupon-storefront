const logos = ['/n1.svg', '/favicon.png', '/n1.svg', '/favicon.png', '/n1.svg', '/favicon.png']

export const SocialProofSection = () => {
  return (
    <section aria-labelledby="social-proof" className="border-t border-neutral-200/70 dark:border-neutral-800/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Trusted by modern teams</p>
        <div className="mt-6 grid grid-cols-3 items-center justify-items-center gap-6 sm:grid-cols-6">
          {logos.map((src, i) => (
            <img key={i} src={src} alt="logo" className="h-6 opacity-70 grayscale transition hover:opacity-100" />
          ))}
        </div>
      </div>
    </section>
  )
}


