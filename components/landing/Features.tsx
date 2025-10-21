'use client'

import { useRef } from 'react'
import { Zap, Users, BookOpen, Sparkles, PenSquare } from 'lucide-react'
import { useGSAP } from '@/hooks/useGSAP'
import { fadeInUp } from '@/lib/utils/animations'


export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useGSAP(sectionRef as React.RefObject<HTMLElement>, fadeInUp)

  return (
          <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              Everything you need
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Simple, powerful, and beautiful
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <PenSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Rich Editor</h3>
              <p className="text-white/60 leading-relaxed">Write with markdown support and see live previews</p>
            </div>

            <div className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Discover</h3>
              <p className="text-white/60 leading-relaxed">Find amazing stories from writers around the world</p>
            </div>

            <div className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-white/60 leading-relaxed">Optimized performance for the best experience</p>
            </div>
          </div>
        </div>
      </section>
  )
}

