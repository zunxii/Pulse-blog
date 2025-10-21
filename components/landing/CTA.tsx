'use client'

import { useRef } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGSAP } from '@/hooks/useGSAP'
import { fadeInUp } from '@/lib/utils/animations'
import Link from 'next/link'

export function CTA() {
  const ctaRef = useRef<HTMLDivElement>(null)
  useGSAP(ctaRef as React.RefObject<HTMLElement>, fadeInUp)

  return (
          <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to start writing?
            </h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Join our community of writers and readers today
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-medium text-base px-8 h-12 group"
            >
              <Link href="/write">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
  )
}
