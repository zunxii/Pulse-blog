'use client'

import { useRef } from 'react'
import { ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGSAP } from '@/hooks/useGSAP'
import { fadeInUp } from '@/lib/utils/animations'

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  useGSAP(heroRef, fadeInUp)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent opacity-50" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div ref={heroRef} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-white/60" />
          <span className="text-sm text-white/80">Built for creators who demand excellence</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Share Your Voice.
          </span>
          <br />
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Amplify Your Impact.
          </span>
        </h1>

        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
          The modern blogging platform designed for seamless storytelling. 
          Create, connect, and captivate with an experience that feels effortless.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 font-medium text-base px-8 h-12 group"
          >
            Start Creating
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/5 font-medium text-base px-8 h-12"
          >
            Explore Stories
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-24 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">500K+</div>
            <div className="text-sm text-white/60">Active Creators</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">2M+</div>
            <div className="text-sm text-white/60">Stories Published</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">10M+</div>
            <div className="text-sm text-white/60">Monthly Readers</div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}
