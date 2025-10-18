'use client'

import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Showcase } from '@/components/landing/Showcase'
import { CTA } from '@/components/landing/CTA'
import { Navigation } from '@/components/layout/Navigation'
import { useSmoothScroll } from '@/lib/hooks/useSmoothScroll'

export default function LandingPage() {
  useSmoothScroll()

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <Hero />
      <Features />
      <Showcase />
      <CTA />
    </main>
  )
}