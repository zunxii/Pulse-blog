'use client'

import { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGSAP } from '@/hooks/useGSAP'
import { fadeInUp } from '@/lib/utils/animations'

export function CTA() {
  const ctaRef = useRef<HTMLDivElement>(null)
  useGSAP(ctaRef, fadeInUp)

  return (
    <section className="py-32 px-6">
      <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already sharing their stories on Pulse.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 font-medium text-base px-8 h-12 group"
          >
            Get Started for Free
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
