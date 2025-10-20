'use client'

import { useRef } from 'react'
import { Zap, Users, BookOpen, Sparkles } from 'lucide-react'
import { useGSAP } from '@/hooks/useGSAP'
import { fadeInUp } from '@/lib/utils/animations'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance with instant page loads and seamless transitions that feel native.'
  },
  {
    icon: Users,
    title: 'Built for Community',
    description: 'Connect with readers through comments, follows, and meaningful interactions.'
  },
  {
    icon: BookOpen,
    title: 'Powerful Editor',
    description: 'Rich text editing with markdown support, media embeds, and real-time collaboration.'
  },
  {
    icon: Sparkles,
    title: 'Beautiful by Default',
    description: 'Every story looks stunning with our carefully crafted typography and layouts.'
  }
]

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useGSAP(sectionRef, fadeInUp)

  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div ref={sectionRef} className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Everything you need
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Powerful features wrapped in a beautiful interface. No compromises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} delay={idx * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, description, delay }: any) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  useGSAP(cardRef, (el) => {
    setTimeout(() => fadeInUp(el), delay)
  })

  return (
    <div
      ref={cardRef}
      className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]"
    >
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed">{description}</p>
    </div>
  )
}