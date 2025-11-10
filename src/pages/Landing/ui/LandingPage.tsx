import { useEffect } from 'react'

// Sections
import { LandingNavbar } from './sections/LandingNavbar'
import { HeroSection } from './sections/HeroSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { SocialProofSection } from './sections/SocialProofSection'
import { FinalCTASection } from './sections/FinalCTASection'
import { LandingFooter } from './sections/LandingFooter'

export const LandingPage = () => {
  useEffect(() => {
    // Ensure we start at top when coming from internal routes
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <SocialProofSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  )
}


