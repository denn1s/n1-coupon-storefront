// FeaturesSection: marketing feature grid for the public landing page. Icons use react-icons to match app style.
import { RiCodeSSlashLine, RiMedalLine } from 'react-icons/ri'
import { AiOutlineAppstore } from 'react-icons/ai'
import { HiOutlineTag, HiOutlineUser, HiOutlineKey } from 'react-icons/hi'

const features = [
  {
    title: 'API-First',
    description: 'Built for fast integration. SDKs, webhooks, and robust access policies.',
    icon: <RiCodeSSlashLine className="h-6 w-6" aria-hidden="true" />
  },
  {
    title: 'Campaign Management',
    description: 'Create and manage complex campaigns with rules, windows, and goals.',
    icon: <AiOutlineAppstore className="h-6 w-6" aria-hidden="true" />
  },
  {
    title: 'Tiers & Benefits',
    description: 'Support multiple tiers, progressive benefits, and upgrade/downgrade rules.',
    icon: <RiMedalLine className="h-6 w-6" aria-hidden="true" />
  },
  {
    title: 'Advanced Segmentation',
    description: 'Segment by tags, behavior, or attributes. Trigger selective actions.',
    icon: <HiOutlineTag className="h-6 w-6" aria-hidden="true" />
  },
  {
    title: 'Profiles & Rewards',
    description: 'Manage profiles, wallets, points, and redemption. Auditable and secure.',
    icon: <HiOutlineUser className="h-6 w-6" aria-hidden="true" />
  },
  {
    title: 'Credentials & Security',
    description: 'Granular API keys, rotation, scopes, and audits for secure integrations.',
    icon: <HiOutlineKey className="h-6 w-6" aria-hidden="true" />
  }
]

export const FeaturesSection = () => {
  return (
    <section id="features" className="border-t border-neutral-200/70 dark:border-neutral-800/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Key features</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Built for teams that demand speed, control, and security.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-neutral-200/70 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800/70"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white dark:bg-neutral-900 dark:text-neutral-200 dark:group-hover:bg-white dark:group-hover:text-neutral-900">
                {f.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
